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
│   │   ├── components/      # UI components (Tables, Charts, Modals, Navbar)
│   │   ├── pages/           # Dashboard, Accounts, Investments, Transactions
│   │   ├── services/        # API service layers
│   │   ├── types/           # TypeScript interfaces and types
│   │   ├── utils/           # CSV and PDF export helpers
│   │   ├── App.tsx
│   │   └── main.tsx
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
  - `accounts` — bank accounts, CDs, IRAs, 401(k), and brokerage accounts
  - `transactions` — daily income/expenses tied to an account
  - `investments` — investment holdings tied to an IRA/401(k)/brokerage account
- The same `seed.sql` file must also insert **test/seed records** for each table so the app has realistic data to develop and demo against immediately after setup (sample accounts across every account type, a handful of transactions, and a handful of investment holdings).
- Provide an `npm run seed` script in `backend/package.json` that runs `seed.sql` against the configured database (drop/recreate tables, then insert the seed rows), so the database can be reset to a known state on demand.

---

## 3. Version Control

- The project is checked into GitHub at: `https://github.com/lionel5116/financialIQ.git`, on the `main` branch.
- `.env` files (root, `backend/`, `frontend/`) must never be committed — only `.env.example` templates belong in the repo. Each of the root, `backend/`, and `frontend/` directories must have a `.gitignore` excluding `node_modules/`, `.env`, and build output (e.g. `dist/`).