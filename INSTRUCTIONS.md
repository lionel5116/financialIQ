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

## 2. Local Environment (this machine)

This project is configured to run against a local PostgreSQL server (Postgres.app) rather than Docker:

- **Host:** `localhost`
- **Port:** `5432`
- **Database:** `financialIQ` (mixed-case — created via a client that preserved the case, so it must stay quoted/exact everywhere it's referenced)
- **User:** `postgres`
- **Password:** set in `backend/.env` (gitignored, not committed — see `backend/.env.example` for the shape)

`backend/src/config/db.js` reads these from environment variables (`PGHOST`, `PGPORT`, `PGDATABASE`, `PGUSER`, `PGPASSWORD`) via `pg.Pool`, loaded from `backend/.env` by `dotenv`.

To (re)apply the schema and seed data against this database:

```bash
cd backend
npm run seed
```

This drops and recreates `accounts`, `transactions`, and `investments`, then reloads the seed rows from `db/seed.sql`.

To wipe all data back to empty **without** reloading the seed rows (e.g. to start clean before entering real data):

```bash
cd backend
npm run clear
```

This runs `backend/db/clear.sql` — `TRUNCATE TABLE accounts, transactions, investments RESTART IDENTITY CASCADE`, which empties all three tables and resets their `id` sequences back to 1, without touching the schema. Unlike `npm run seed`, it leaves the database empty rather than repopulating it with demo data. This is destructive and not reversible except by re-running `npm run seed`.

---

## 3. Version Control

- **Repository:** [github.com/lionel5116/financialIQ](https://github.com/lionel5116/financialIQ.git)
- **Default branch:** `main`
- `.env` files (root, `backend/`, `frontend/`) are gitignored and were never committed — the repo carries only `.env.example` templates. Clone + copy the examples + fill in local credentials to get running.
- Root `.gitignore` covers root-level `node_modules/`, `.env`, `.DS_Store`, and logs; `backend/.gitignore` and `frontend/.gitignore` cover their own `node_modules/`, build output (`dist/`), and env files.

---

## 4. Root Tooling

The root `package.json` doesn't run either app itself — it orchestrates both via `concurrently` and `kill-port` (devDependencies):

| Script | What it does |
|---|---|
| `npm run dev` | Runs `dev:backend` and `dev:frontend` together via `concurrently`, labeled/color-coded (`[backend]` blue, `[frontend]` magenta) |
| `npm run dev:backend` / `npm run dev:frontend` | Proxy to each app's own `npm run dev` via `--prefix` |
| `npm run install:all` | Installs dependencies in both `backend/` and `frontend/` |
| `npm run seed` | Proxies to `backend`'s seed script |
| `npm run clear` | Proxies to `backend`'s clear script — wipes all data, keeps the schema |
| `npm run build` | Proxies to `frontend`'s production build |
| `npm run stop` | Frees ports 4000 (backend) and 5173 (frontend) via `kill-port`, then reaps the lingering `node --watch` and `concurrently` supervisor processes so nothing idles in the background |

---

## 5. Design System & Branding

- **Theme:** Fixed dark theme app-wide (not a light/dark toggle). Page background `slate-900`; panel/card surfaces `slate-800/60` with `border-white/5`; primary text `white`; secondary text `slate-400`/`slate-500`; accent color `emerald-500`/`emerald-400` (active nav state, primary buttons, positive values). Negative values use `rose-400`.
- **Logo:** `frontend/src/components/Logo.tsx` renders the financialIQ mark (gradient bar-chart icon in a rounded dark square + "financial**IQ**" wordmark, IQ in emerald) and is used in the `Sidebar`. `frontend/public/favicon.svg` carries the same mark (icon only) for the browser tab. The component always renders in dark mode — no `dark:` Tailwind variants, since the app has no light theme to fall back to.
- **Navigation:** A fixed-width left `Sidebar` (`frontend/src/components/Sidebar.tsx`), not a top navbar. Dark `slate-950` surface, logo at the top, nav items with `lucide-react` icons (`LayoutDashboard`, `Wallet`, `TrendingUp`, `Receipt`) + label, active route highlighted with an emerald background/text tint.
- **Dashboard layout:** greeting header (page label + heading + date) → 4 stat cards (Net Worth, Total Assets, Total Cash, Expenses This Month) → a two-panel row (Asset Allocation Breakdown donut chart + Accounts Overview list) → a second two-panel row (Investment Portfolio Summary table + Expense & Income Trend bar chart). The backend `/api/dashboard/summary` endpoint supplies `totalAssets`, `totalCash`, and a per-day `incomeExpenseTrend` array to back these widgets, in addition to the pre-existing `netWorth`, `investmentsTotal`, `allocationByAssetClass`, and `monthToDateSpend`.
- **Chart colors:** never eyeballed. Categorical series colors are assigned in a fixed hue order and validated against the actual dark card-surface color they render on (CVD-safe separation, contrast, lightness band) before shipping — see `AllocationChart.tsx` and `IncomeExpenseChart.tsx` for the validated hex values in use.