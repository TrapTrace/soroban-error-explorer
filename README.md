<div align="center">

# ⚡ TrapTrace Explorer — Web Search Interface

**The web UI presentation layer for the TrapTrace Soroban error index, providing instant fuzzy search, category filters, and interactive code snippets.**

[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-1B1F23?style=flat-square&logo=vercel&logoColor=white)](https://traptrace-explorer.vercel.app)
[![Build Status](https://img.shields.io/github/actions/workflow/status/TrapTrace/soroban-error-explorer/deploy.yml?branch=main&style=flat-square&color=2FA98C&label=Deploy%20Status)](https://github.com/TrapTrace/soroban-error-explorer/actions)
[![Vite](https://img.shields.io/badge/Vite-5.4-1B1F23?style=flat-square)](https://vitejs.dev)
[![React](https://img.shields.io/badge/React-18-2FA98C?style=flat-square)](https://react.dev)
[![License](https://img.shields.io/badge/License-MIT-2FA98C?style=flat-square)](./LICENSE)
[![Stellar Wave](https://img.shields.io/badge/Drips%20Wave-8%20Target-E2984B?style=flat-square)](https://drips.network)

</div>

---

## 🎨 Features & Operational Diagnostics Studio

- **Live Diagnostics Studio:** Interactive browser-based developer suite connected directly to Stellar/Soroban Testnet:
  - 🔍 **Tx Hash Inspector:** Fetches on-chain execution traces, decodes DiagnosticEvents, and automatically maps failure root causes to verified catalog entries with 1-click fix pathways.
  - ⚡ **Pre-Flight Simulation Debugger:** Simulates transaction envelope XDR against live RPC, calculating CPU instruction count, memory bytes, and min resource fees.
  - 📜 **Soroban XDR & Event Decoder:** Decodes base64 `DiagnosticEvent` and `SCVal` data structures into readable JSON and event topics.
  - 🗄️ **Storage & State TTL Auditor:** Queries contract ledger entries, monitors archival status, and checks remaining TTL ledgers before archival.
- **Brand Aesthetic:** Built using the official TrapTrace color scheme (Ink `#1B1F23`, Trap-amber `#E2984B`, Trace-teal `#2FA98C`).
- **Instant Search:** Search across error codes, WASM trap strings, and keywords in real time.
- **Keyboard Shortcuts:** Press `/` anywhere to focus search. Press `Esc` to close detailed entry modals.
- **Verification Badges:** Clearly tags entries as `✔ Verified` or `⚠ Unverified`.

---

## 🌐 Live Deployment

The explorer is deployed and served from Vercel (auto-deploys on every push to `main`):

**https://traptrace-explorer.vercel.app**

> Note: the `gh-pages` branch is intentionally ignored by Vercel builds (`ignoreCommand` in `vercel.json`) — it only exists to feed the legacy GitHub Pages workflow and should never be built or deployed to production.

---

## 🛠 Local Setup & Development

Install dependencies and start dev server:

```bash
npm install
npm run dev
```

Build production bundle:

```bash
npm run build
```

Preview production build:

```bash
npm run preview
```

---

## 📄 License

Distributed under the MIT License. Copyright (c) 2026 TrapTrace.
