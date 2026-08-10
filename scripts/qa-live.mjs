#!/usr/bin/env node
/**
 * TrapTrace Explorer — live QA via headless Chrome (CDP).
 *
 * Verifies two interactions end-to-end against the deployed site:
 *   1. Error cards are real buttons: Tab focus lands on a card, Enter opens the modal.
 *   2. Docs TOC scroll-spy: the active TOC entry follows scroll position.
 *
 * Usage: node scripts/qa-live.mjs [url]
 * Requires: Node >= 21 (global WebSocket) and Google Chrome on PATH.
 */
import { spawn } from 'node:child_process';
import { mkdtempSync, readFileSync, existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const URL = process.argv[2] || 'https://traptrace-explorer.vercel.app/';
const CHROME = process.env.CHROME_BIN || 'google-chrome';
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// ---------- launch headless chrome ----------
const profile = mkdtempSync(join(tmpdir(), 'traptrace-qa-'));
const chrome = spawn(CHROME, [
  '--headless=new',
  '--no-sandbox',
  '--disable-gpu',
  '--disable-dev-shm-usage',
  `--user-data-dir=${profile}`,
  '--remote-debugging-port=0',
  '--window-size=1440,900',
  URL,
], { stdio: ['ignore', 'ignore', 'pipe'] });

let stderr = '';
chrome.stderr.on('data', (d) => { stderr += d.toString(); });

// Ensure the headless Chrome process is never orphaned.
process.on('exit', () => chrome.kill());
process.on('SIGINT', () => process.exit(130));
process.on('SIGTERM', () => process.exit(143));

async function getPort() {
  const portFile = join(profile, 'DevToolsActivePort');
  for (let i = 0; i < 50; i++) {
    if (existsSync(portFile)) {
      const [port] = readFileSync(portFile, 'utf8').split('\n');
      return port.trim();
    }
    await sleep(100);
  }
  throw new Error('Chrome did not expose DevToolsActivePort. stderr: ' + stderr.slice(0, 500));
}

// ---------- minimal CDP client ----------
async function connect(wsUrl) {
  const ws = new WebSocket(wsUrl);
  await new Promise((resolve, reject) => {
    ws.onopen = resolve;
    ws.onerror = reject;
  });
  let id = 0;
  const pending = new Map();
  const events = [];
  ws.onmessage = (ev) => {
    const msg = JSON.parse(ev.data);
    if (msg.id) {
      const p = pending.get(msg.id);
      if (p) {
        pending.delete(msg.id);
        msg.error ? p.reject(new Error(JSON.stringify(msg.error))) : p.resolve(msg.result);
      }
    } else if (msg.method) {
      events.push(msg);
    }
  };
  const send = (method, params = {}) =>
    new Promise((resolve, reject) => {
      const mid = ++id;
      pending.set(mid, { resolve, reject });
      ws.send(JSON.stringify({ id: mid, method, params }));
    });
  return { ws, send, events };
}

// ---------- helpers (never throw; capture full error detail) ----------
async function evaluate(send, expression) {
  const res = await send('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true });
  if (res.exceptionDetails) {
    const desc = res.exceptionDetails.exception?.description || res.exceptionDetails.text || 'unknown';
    return { ok: false, error: desc, value: undefined };
  }
  return { ok: true, error: null, value: res.result?.value };
}

async function waitFor(send, expression, timeoutMs = 15000) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    const r = await evaluate(send, expression);
    if (r.ok && r.value) return true;
    await sleep(150);
  }
  return false;
}

async function press(send, key, code, vk, text) {
  // rawKeyDown triggers OS-level default actions; a char event with the key's
  // text is required for keys like Enter ('\r') to synthesize the button click.
  const base = { key, code, windowsVirtualKeyCode: vk, nativeVirtualKeyCode: vk };
  await send('Input.dispatchKeyEvent', { type: 'rawKeyDown', ...base });
  await sleep(60);
  if (text) await send('Input.dispatchKeyEvent', { type: 'char', text, key, code, windowsVirtualKeyCode: vk });
  await sleep(60);
  await send('Input.dispatchKeyEvent', { type: 'keyUp', ...base });
  await sleep(60);
}

const results = [];
function check(name, pass, detail) {
  results.push({ name, pass, detail });
  console.log(`${pass ? 'PASS' : 'FAIL'}  ${name}${detail ? ' — ' + detail : ''}`);
}

// ---------- main ----------
const port = await getPort();
const targets = await (await fetch(`http://127.0.0.1:${port}/json/list`)).json();
const page = targets.find((t) => t.type === 'page');
const { ws, send, events } = await connect(page.webSocketDebuggerUrl);

await send('Runtime.enable');
await send('Log.enable');
await send('Page.enable');

// wait for the app shell to render
const ready = await waitFor(send, `document.querySelectorAll('.card-hit-area').length > 0`);
check('App renders with error cards', ready, ready ? `${(await evaluate(send, `document.querySelectorAll('.card-hit-area').length`)).value} cards` : 'no .card-hit-area found');

// ---------- Test 1: keyboard access on error cards ----------
let focusedClass = '';
let tabsUsed = 0;
for (let i = 0; i < 14; i++) {
  await press(send, 'Tab', 'Tab', 9);
  const r = await evaluate(send, `document.activeElement ? document.activeElement.className || document.activeElement.tagName : 'none'`);
  focusedClass = r.value;
  tabsUsed = i + 1;
  if (String(focusedClass).includes('card-hit-area')) break;
}
const keyboardFocused = String(focusedClass).includes('card-hit-area');
check('Tab focus lands on an error card button', keyboardFocused, `after ${tabsUsed} Tab(s), activeElement = "${focusedClass}"`);

if (keyboardFocused) {
  // Primary check: Enter (with the char event the browser needs to synthesize click).
  await press(send, 'Enter', 'Enter', 13, '\r');
  await sleep(700);
  let modalOpen = (await evaluate(send, `!!document.querySelector('.modal-backdrop')`)).value;
  let titleRes = await evaluate(send, `document.querySelector('.modal-title')?.textContent?.trim() || ''`);
  let modalTitle = titleRes.value;
  let detail = modalOpen
    ? (modalTitle ? `modal title: "${modalTitle}"` : 'modal opened, title lookup failed')
    : 'modal did not open';
  if (modalOpen && !modalTitle) {
    const dump = await evaluate(send, `document.querySelector('.modal-panel')?.innerText?.slice(0, 220) || '(no panel)'`);
    detail += ` | panel text: ${JSON.stringify(dump.value)}`;
  }
  check('Enter opens the details modal', modalOpen && !!modalTitle, detail);

  // If Enter did not open it, control check: trusted mouse click on the same button.
  // Distinguishes a harness/keyboard-fidelity issue from a broken click handler.
  if (!modalOpen) {
    const box = (await evaluate(send, `(() => { const b = document.querySelector('.card-hit-area').getBoundingClientRect(); return { x: b.x + b.width / 2, y: b.y + b.height / 2 }; })()`)).value;
    await send('Input.dispatchMouseEvent', { type: 'mousePressed', x: box.x, y: box.y, button: 'left', clickCount: 1 });
    await send('Input.dispatchMouseEvent', { type: 'mouseReleased', x: box.x, y: box.y, button: 'left', clickCount: 1 });
    await sleep(600);
    modalOpen = (await evaluate(send, `!!document.querySelector('.modal-backdrop')`)).value;
    titleRes = await evaluate(send, `document.querySelector('.modal-title')?.textContent?.trim() || ''`);
    modalTitle = titleRes.value;
    check('Control: trusted mouse click opens the modal', modalOpen && !!modalTitle, modalTitle ? `modal title: "${modalTitle}"` : 'mouse click also failed');
  }

  // Close the modal (Escape also exercises the focus-restore path).
  await press(send, 'Escape', 'Escape', 27);
  await sleep(400);
  const modalClosed = (await evaluate(send, `!document.querySelector('.modal-backdrop')`)).value;
  check('Escape closes the modal', modalClosed, 'modal removed from DOM');
  const restored = (await evaluate(send, `document.activeElement?.className || ''`)).value;
  check('Focus restores to the card after close', String(restored).includes('card-hit-area'), `activeElement = "${restored}"`);
}

// ---------- Test 2: docs TOC scroll-spy ----------
await evaluate(send, `document.querySelectorAll('.nav-tab')[1].click()`);
await sleep(500);
const activeTab = (await evaluate(send, `document.querySelector('.nav-tab--active')?.textContent?.trim() || '(none)'`)).value;
const docsCount = (await evaluate(send, `document.querySelectorAll('.doc-section').length`)).value;
// Direct selector poll — the same expression verified above; avoids any __qa indirection.
const docsReady = await waitFor(send, `document.querySelectorAll('.doc-section').length > 0`);
check('Documentation page renders', docsReady && String(activeTab).includes('Documentation'), `${docsCount} .doc-section, active tab = "${activeTab}"`);

if (docsReady) {
  // Neutralise smooth scrolling so scroll checks are deterministic.
  await evaluate(send, `document.documentElement.style.scrollBehavior = 'auto'; true`);
  await sleep(400); // let the IntersectionObserver settle at top
  // Direct DOM queries throughout — same expressions proven working above.
  const sectionCount = (await evaluate(send, `document.querySelectorAll('.doc-section').length`)).value;
  const seen = new Set();
  const sequence = [];
  for (let i = 0; i < Math.min(sectionCount, 8); i++) {
    const sr = await evaluate(send, `document.querySelectorAll('.doc-section')[${i}].scrollIntoView({ block: 'start' }); true`);
    if (!sr.ok) sequence.push(`scroll ${i} ERROR: ${sr.error}`);
    await sleep(450);
    const active = (await evaluate(send, `document.querySelector('.toc-link--active')?.textContent?.trim() || '(none)'`)).value;
    const st = (await evaluate(send, `document.querySelectorAll('.doc-section')[${i}].querySelector('.doc-section-title')?.textContent?.trim() || '(missing)'`)).value;
    sequence.push(`${st}->${active}`);
    seen.add(active);
  }
  const spyMoves = seen.size >= 2;
  check('TOC highlight follows scroll (scroll-spy)', spyMoves, `distinct active entries: ${seen.size}; sequence: ${sequence.join(' | ')}`);

  // TOC link click → jumps to section, not hidden behind sticky header
  const clicked = (await evaluate(send, `document.querySelectorAll('.toc-link')[2]?.click(); document.querySelectorAll('.toc-link')[2]?.textContent?.trim() || ''`)).value;
  await sleep(600); // anchor jump is instant once smooth scroll is disabled
  const activeAfterClick = (await evaluate(send, `document.querySelector('.toc-link--active')?.textContent?.trim() || '(none)'`)).value;
  const topRes = await evaluate(send, `(function(){ var el = document.querySelectorAll('.doc-section')[2]; return el ? Math.round(el.getBoundingClientRect().top) : -1; })()`);
  const sectionTop = topRes.ok ? topRes.value : -999;
  const matchesClick = activeAfterClick === clicked;
  const notHidden = sectionTop >= 60 && sectionTop <= 300;
  check('TOC link click navigates + highlights', matchesClick && notHidden, `clicked "${clicked}" → active "${activeAfterClick}", section top at ${sectionTop}px (header is ~64px)`);

  // scroll back to top — set the scroller directly (scrollTo can be a no-op if
  // the document scrolls in a non-root element), then poll for the async
  // IntersectionObserver callback. Compares TOC labels, not section titles.
  const scrollBefore = (await evaluate(send, `(document.scrollingElement || document.documentElement).scrollTop`)).value;
  await evaluate(send, `document.scrollingElement.scrollTop = 0; true`);
  const firstTocLabel = (await evaluate(send, `document.querySelector('.toc-link')?.textContent?.trim() || '(none)'`)).value;
  // Snapshot scrollTop + active label through the poll window to detect any
  // hash-driven scroll restoration racing the programmatic scroll.
  const snapshots = [];
  const polled = await waitFor(send, `document.querySelector('.toc-link--active')?.textContent?.trim() === ${JSON.stringify(firstTocLabel)}`, 4000, () => { /* noop */ });
  for (let i = 0; i < 4; i++) {
    await sleep(250);
    const st = (await evaluate(send, `(document.scrollingElement || document.documentElement).scrollTop`)).value;
    const ac = (await evaluate(send, `document.querySelector('.toc-link--active')?.textContent?.trim() || '(none)'`)).value;
    snapshots.push(`t+${(i + 1) * 250}ms:scrollTop=${st},active=${ac}`);
  }
  const topActive = (await evaluate(send, `document.querySelector('.toc-link--active')?.textContent?.trim() || '(none)'`)).value;
  const scrollAfter = (await evaluate(send, `(document.scrollingElement || document.documentElement).scrollTop`)).value;
  check('Top of page highlights first section', polled || topActive === firstTocLabel, `active "${topActive}" vs first TOC "${firstTocLabel}" (scrollTop ${scrollBefore} → ${scrollAfter}); ${snapshots.join(' | ')}`);
}

// ---------- page-origin console errors / exceptions ----------
const pageErrors = events
  .filter((e) => e.method === 'Runtime.exceptionThrown' ||
    (e.method === 'Runtime.consoleAPICalled' && e.params.type === 'error') ||
    (e.method === 'Log.entryAdded' && e.params.entry.level === 'error'))
  .map((e) => {
    if (e.method === 'Runtime.exceptionThrown') return `exception: ${e.params.exceptionDetails?.exception?.description || e.params.exceptionDetails?.text}`;
    if (e.method === 'Runtime.consoleAPICalled') return `console.error: ${e.params.args?.map((a) => a.value ?? a.description).join(' ')}`;
    return `log: ${e.params.entry.text}`;
  });
check('No console errors during QA', pageErrors.length === 0, pageErrors.length ? pageErrors.slice(0, 5).join(' | ') : 'clean');

const failed = results.filter((r) => !r.pass);
console.log(`\n${failed.length === 0 ? 'ALL CHECKS PASSED' : failed.length + ' CHECK(S) FAILED'} (${results.length - failed.length}/${results.length} passed)`);

chrome.kill();
process.exit(failed.length === 0 ? 0 : 1);
