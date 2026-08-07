<div align="center">

# ⚡ TrapTrace Explorer — Web Search Interface

**The web UI presentation layer for the TrapTrace Soroban error index, providing instant fuzzy search, category filters, and interactive code snippets.**

[![Build Status](https://img.shields.io/github/actions/workflow/status/TrapTrace/soroban-error-explorer/deploy.yml?branch=main&style=flat-square&color=2FA98C&label=Deploy%20Status)](https://github.com/TrapTrace/soroban-error-explorer/actions)
[![Vite](https://img.shields.io/badge/Vite-5.4-1B1F23?style=flat-square)](https://vitejs.dev)
[![React](https://img.shields.io/badge/React-18-2FA98C?style=flat-square)](https://react.dev)
[![License](https://img.shields.io/badge/License-MIT-2FA98C?style=flat-square)](./LICENSE)
[![Stellar Wave](https://img.shields.io/badge/Drips%20Wave-8%20Target-E2984B?style=flat-square)](https://drips.network)

</div>

---

## 🎨 Features & Design System

- **Brand Aesthetic:** Built using the official TrapTrace color scheme (Ink `#1B1F23`, Trap-amber `#E2984B`, Trace-teal `#2FA98C`).
- **Instant Search:** Search across error codes, WASM trap strings, and keywords in real time.
- **Keyboard Shortcuts:** Press `/` anywhere to focus search. Press `Esc` to close detailed entry modals.
- **Verification Badges:** Clearly tags entries as `✔ Verified` or `⚠ Unverified`.

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
