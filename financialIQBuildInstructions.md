# FinancialIQ Project Blueprint & Claude Instructions

## Overview
**FinancialIQ** is a full-stack personal finance application designed to track bank accounts, CDs, IRAs, retirement accounts (401k/brokerage), daily expenses, and investment portfolios.

---

## 1. Tech Stack & Architecture Requirements

### Backend Requirements
- **Language/Runtime:** Plain Node.js (JavaScript). **Strictly NO TypeScript on the backend.**
- **Framework:** Express.js
- **Database:** PostgreSQL (using `pg` driver with parameterized SQL queries)
- **Structure:** Modular structure (`routes/`, `controllers/`, `config/`, `middleware/`)

### Frontend Requirements
- **Language/Framework:** React + TypeScript (configured via Vite)
- **Styling:** Tailwind CSS
- **Visualization:** Recharts (or standard chart library) for asset allocation breakdown charts
- **Exporting Capabilities:** 
  - **CSV Export:** Dynamic generation of investment table data to `.csv` format
  - **PDF Export:** Styled PDF generation (e.g., using `jspdf` and `jspdf-autotable`)

### Repository Structure
Both `frontend` and `backend` must live in the same root directory (Monorepo setup):

```text
financialIQ/
├── INSTRUCTIONS.md
├── package.json              # root: concurrently-based scripts to run both apps together
├── backend/
│   ├── src/
│   │   ├── config/          # DB connections & environment config
│   │   ├── controllers/     # Request handlers & logic
│   │   ├── routes/          # Express routing definitions
│   │   ├── middleware/      # Error handling & middleware
│   │   └── app.js           # Main Express application entry point
│   ├── db/
│   │   └── seed.sql         # PostgreSQL schema DDL & seed records
│   ├── .env.example
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/      # UI components (Tables, Charts, Modals, Sidebar, Logo)
│   │   ├── pages/           # Dashboard, Accounts, Investments, Transactions
│   │   ├── services/        # API service layers
│   │   ├── types/           # TypeScript interfaces and types
│   │   ├── utils/           # CSV and PDF export helpers
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── public/
│   │   └── favicon.svg      # financialIQ mark, matches Logo.tsx
│   ├── package.json
│   ├── tailwind.config.js
│   └── tsconfig.json
└── README.md
```

---

## 2. Database Setup

### Local PostgreSQL Database
- Create a local PostgreSQL database with the **same name as the application**: `financialIQ`.
  ```sql
  CREATE DATABASE "financialIQ";
  ```
  Since the name is mixed-case, it must be quoted in SQL and referenced exactly as `financialIQ` (not folded to lowercase) anywhere it's configured, e.g. in `backend/.env` as `PGDATABASE=financialIQ`.
- Connection settings (host, port, database, user, password) must be read from environment variables via `backend/.env`, based on `backend/.env.example`. Never hardcode credentials in source.

### Schema & Seed Data
- Define the schema (tables, constraints, indexes) as DDL in `backend/db/seed.sql`, covering at minimum:
  - `accounts` — bank accounts, CDs, IRAs, 401(k), and brokerage accounts. `accounts.type` must allow: `checking`, `savings`, `cash`, `cd`, `ira`, `401k`, `brokerage`.
  - `transactions` — daily income/expenses tied to an account
  - `investments` — investment holdings tied to an account (any account type)
- The same `seed.sql` file must also insert **test/seed records** for each table so the app has realistic data to develop and demo against immediately after setup (sample accounts across every account type, a handful of transactions, and a handful of investment holdings).
- Provide an `npm run seed` script in `backend/package.json` that runs `seed.sql` against the configured database (drop/recreate tables, then insert the seed rows), so the database can be reset to a known state on demand.

### Clearing Data
- Provide a separate `backend/db/clear.sql` (a `TRUNCATE ... RESTART IDENTITY CASCADE` over every table) and an `npm run clear` script in `backend/package.json` that empties all tables **without** reinserting seed data and without dropping the schema. This is distinct from `npm run seed`: `seed` resets to demo data, `clear` resets to genuinely empty. Since it's destructive, it must never run automatically (e.g. on server start) — only on explicit invocation.

### Schema Migrations
- `backend/db/seed.sql` drops and recreates tables — safe for a fresh database, but **never** run it against a database that already holds real user data, since it discards everything. When the schema changes after real data exists (e.g. adding a new `accounts.type` value), write a one-off, additive SQL file under `backend/db/migrations/` (e.g. `ALTER TABLE ... DROP/ADD CONSTRAINT`) and apply it directly against the existing database instead of reseeding. `seed.sql` should still be updated in the same change so fresh installs get the new schema for free.

---

## 3. Version Control

- The project is checked into GitHub at: `https://github.com/lionel5116/financialIQ.git`, on the `main` branch.
- `.env` files (root, `backend/`, `frontend/`) must never be committed — only `.env.example` templates belong in the repo. Each of the root, `backend/`, and `frontend/` directories must have a `.gitignore` excluding `node_modules/`, `.env`, and build output (e.g. `dist/`).

---

## 4. Root Tooling

- Add a `package.json` at the project root (separate from `backend/package.json` and `frontend/package.json`) whose only job is to orchestrate both apps, using `concurrently` and `kill-port` as devDependencies:
  - `npm run dev` — starts both dev servers together via `concurrently`, with labeled, color-coded output per app.
  - `npm run dev:backend` / `npm run dev:frontend` — proxy to each app's own dev script via `--prefix`.
  - `npm run install:all` — installs dependencies in both `backend/` and `frontend/`.
  - `npm run seed` — proxies to the backend's seed script.
  - `npm run clear` — proxies to the backend's clear script (wipes all data, keeps schema).
  - `npm run build` — proxies to the frontend's production build.
  - `npm run stop` — frees the backend (4000) and frontend (5173) ports via `kill-port`, and also reaps the `node --watch` / `concurrently` supervisor processes so nothing lingers in the background after stopping.

---

## 5. Design System & Branding

- **Theme:** The application uses a single, fixed dark theme — no light/dark toggle. Page background and panel surfaces must be dark (e.g. slate-900 page, slate-800 panels); primary text near-white, secondary text muted gray; one accent color (e.g. emerald) for active nav state, primary actions, and positive values; a distinct color for negative values.
- **Logo:** The app must use the provided `financialIQ` mark (gradient bar-chart icon in a rounded dark square + wordmark, with "IQ" in the accent color) as a reusable component, rendered in the sidebar, and as the browser favicon (icon only). Since the app has no light theme, the logo component must not rely on `dark:` Tailwind variants — render dark-mode styling unconditionally.
- **Navigation:** Use a fixed-width left sidebar (not a top navbar): dark surface, logo at the top, nav items with icons + labels, and a visually distinct active-route state.
- **Dashboard layout:** greeting header → a row of stat cards summarizing net worth, total assets, total cash, and current-month expenses → an asset allocation breakdown chart paired with an accounts overview list → an investment portfolio summary paired with an income/expense trend chart. The dashboard summary API must supply whatever aggregate fields these widgets need (e.g. total assets, total cash, a time-series of income vs. expenses) in addition to the core net worth / allocation / spend figures.
- **Chart colors:** Never eyeball chart colors. Assign categorical series colors in a fixed hue order and validate them (contrast, colorblind-safe separation, lightness) against the actual surface color each chart renders on before shipping.