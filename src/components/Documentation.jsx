import React, { useEffect, useState } from 'react';
import { BookOpen, Terminal, Shield, Cpu, Database, Copy, Check, ExternalLink, AlertTriangle } from 'lucide-react';

const SECTIONS = [
  { id: 'cli-quickstart', label: 'CLI Quickstart' },
  { id: 'error-architecture', label: 'Soroban Error Architecture' },
  { id: 'state-archival', label: 'State Archival & TTL Expiration' },
  { id: 'contribution-schema', label: 'Schema & Contribution Guidelines' }
];

export default function Documentation() {
  const [copiedCmd, setCopiedCmd] = useState('');
  const [activeSection, setActiveSection] = useState(SECTIONS[0].id);

  // Scroll-spy: highlight the TOC entry for the section currently in view.
  // A scroll-position check (not a bare IntersectionObserver) so a section is
  // ALWAYS active: at the very top and bottom of the page no section may sit in
  // an observer's root band, which would otherwise leave the highlight stale.
  useEffect(() => {
    const update = () => {
      // Scrolled to the bottom: the last section may never reach the band line
      // because the page cannot scroll it up that far — force it active.
      const atBottom =
        window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2;
      if (atBottom) {
        setActiveSection(SECTIONS[SECTIONS.length - 1].id);
        return;
      }
      // Active = the last section whose top has crossed the upper-quarter line.
      const bandTop = window.innerHeight * 0.25;
      let current = SECTIONS[0].id;
      for (const { id } of SECTIONS) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= bandTop) current = id;
      }
      setActiveSection(current);
    };
    update();
    window.addEventListener('scroll', update, { passive: true });
    return () => window.removeEventListener('scroll', update);
  }, []);

  const copyToClipboard = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedCmd(id);
    setTimeout(() => setCopiedCmd(''), 2000);
  };

  return (
    <div className="docs">
      {/* Docs Header Banner */}
      <div className="docs-banner">
        <div className="docs-banner-title">
          <BookOpen size={28} color="var(--color-trace-teal)" />
          TrapTrace Documentation &amp; Developer Guide
        </div>
        <p>
          Comprehensive guide to Soroban smart contract error diagnostics, state archival lifecycles,
          WASM execution envelopes, CLI tool usage, and contribution guidelines.
        </p>
      </div>

      <div className="docs-layout">
        {/* Sidebar Nav */}
        <aside className="docs-toc">
          <div className="toc-panel">
            <p className="section-head" style={{ marginBottom: '12px', paddingLeft: '8px' }}>
              Table of Contents
            </p>
            <nav className="toc-list" aria-label="Documentation sections">
              {SECTIONS.map(({ id, label }, idx) => (
                <a
                  key={id}
                  href={`#${id}`}
                  className={`toc-link ${activeSection === id ? 'toc-link--active' : ''}`}
                  aria-current={activeSection === id ? 'location' : undefined}
                >
                  {idx + 1}. {label}
                </a>
              ))}
            </nav>
          </div>
        </aside>

        {/* Content Body */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {/* Section 1 */}
          <section id="cli-quickstart" className="doc-section">
            <h2 className="doc-section-title">
              <Terminal color="var(--color-trace-teal)" size={20} /> 1. CLI Quickstart (soroban-explain)
            </h2>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '14px', marginBottom: '16px' }}>
              Install the lightweight Python command-line utility to query error diagnostics directly
              from your local terminal session during smart contract development.
            </p>

            <div className="copy-row">
              <code>pip install traptrace-cli</code>
              <button onClick={() => copyToClipboard('pip install traptrace-cli', 'pip')} className="btn btn-secondary" style={{ padding: '5px 11px', fontSize: '12px' }}>
                {copiedCmd === 'pip' ? <Check size={14} color="var(--color-trace-teal)" /> : <Copy size={14} />}
              </button>
            </div>

            <h4 style={{ color: '#fff', fontSize: '14px', marginBottom: '8px', fontWeight: 600 }}>
              Command Line Usage Examples:
            </h4>
            <pre className="code-block">
              <code>{`# Explain an error string or host trap code
soroban-explain "HostError::BudgetExceeded"

# Display detailed symptoms and verified solution steps
soroban-explain "ttl" --detailed

# Filter by error category
soroban-explain --category host-error

# Output raw JSON for IDE extension integration
soroban-explain "account-not-found" --json`}</code>
            </pre>
          </section>

          {/* Section 2 */}
          <section id="error-architecture" className="doc-section">
            <h2 className="doc-section-title">
              <Cpu color="var(--color-trap-amber)" size={20} /> 2. Soroban Error Architecture
            </h2>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '14px', marginBottom: '16px' }}>
              Errors in Soroban occur across four distinct architectural layers. Understanding which
              layer emitted the error accelerates resolution:
            </p>

            <div className="doc-grid-2">
              <div className="doc-card">
                <h4 data-accent="host">Host Errors</h4>
                <p>Emitted by the Soroban Environment VM when execution budget limits are exceeded, panics occur, or invalid contract IDs are called.</p>
              </div>
              <div className="doc-card">
                <h4 data-accent="cli">CLI Errors</h4>
                <p>Occur during key management, un-funded account deployment attempts, or sequence number mismatches (txBAD_SEQ).</p>
              </div>
              <div className="doc-card">
                <h4 data-accent="rpc">RPC Simulation Errors</h4>
                <p>Returned by simulateTransaction when authorization trees fail verification or footprint storage keys are missing.</p>
              </div>
              <div className="doc-card">
                <h4 data-accent="sdk">SDK Conversion Errors</h4>
                <p>Raised when client libraries fail to deserialize raw XDR ScVal structures into native JavaScript or Rust types.</p>
              </div>
            </div>
          </section>

          {/* Section 3 */}
          <section id="state-archival" className="doc-section">
            <h2 className="doc-section-title">
              <Database color="#5B9DF0" size={20} /> 3. State Archival &amp; TTL Expiration (CAP-0046)
            </h2>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '14px', marginBottom: '16px' }}>
              Soroban persistent and instance storage entries are bounded by a Time-To-Live (TTL) ledger
              counter. If an entry reaches zero remaining TTL ledgers, it is archived to prevent ledger bloat.
            </p>

            <div className="doc-note">
              <AlertTriangle size={18} color="var(--color-trap-amber)" style={{ flexShrink: 0, marginTop: 2 }} />
              <span>
                <strong>Important:</strong> Attempting to read or write an archived storage key raises{' '}
                <code className="code-inline">HostError::EntryArchived</code>. To restore an archived key,
                issue a <code className="code-inline">RestoreFootprint</code> operation.
              </span>
            </div>

            <h4 style={{ color: '#fff', fontSize: '14px', marginBottom: '8px', fontWeight: 600 }}>
              Extending TTL in Contract Logic:
            </h4>
            <pre className="code-block">
              <code>{`// Extend storage key lifespan by 100,000 ledgers if remaining TTL < 1,000 ledgers
env.storage().persistent().extend_ttl(&storage_key, 1000, 100000);`}</code>
            </pre>
          </section>

          {/* Section 4 */}
          <section id="contribution-schema" className="doc-section">
            <h2 className="doc-section-title">
              <Shield color="var(--color-trace-teal)" size={20} /> 4. Schema &amp; Contribution Guidelines
            </h2>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '14px', marginBottom: '16px' }}>
              All catalog entries in <code className="code-inline">soroban-error-index</code> are formatted
              in Markdown with a YAML frontmatter header validated against{' '}
              <code className="code-inline">schema/entry.schema.json</code>.
            </p>

            <pre className="code-block">
              <code>{`---
id: my-error-id
title: Host Error - Short Description
category: host-error # host-error | cli-error | rpc-error | sdk-error
error_code: ErrorCodeString
verified: true # true if confirmed on testnet/mainnet with reproduction
summary: Concise 1-2 sentence description.
tags: [tag1, tag2]
soroban_version: "21.0.0"
---`}</code>
            </pre>

            <p style={{ color: 'var(--color-text-muted)', fontSize: '13px', marginTop: '16px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <ExternalLink size={13} color="var(--color-trace-teal)" />
              See the <a href="https://github.com/TrapTrace/soroban-error-index" target="_blank" rel="noreferrer" style={{ color: 'var(--color-trace-teal)' }}>soroban-error-index</a> repo for the full contribution guide.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
