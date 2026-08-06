# TrapTrace Explorer (`soroban-error-explorer`)

![Build Status](https://github.com/TrapTrace/soroban-error-explorer/actions/workflows/deploy.yml/badge.svg)
![License](https://img.shields.io/badge/License-MIT-teal.svg)
![Vite](https://img.shields.io/badge/Vite-5.0-blue.svg)

**TrapTrace Explorer** is the web UI presentation layer for the TrapTrace Soroban error index. Hosted on GitHub Pages, it provides developers with instant fuzzy search, error category filtering, verification badges, and copyable code snippets to diagnose and resolve smart contract errors.

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
