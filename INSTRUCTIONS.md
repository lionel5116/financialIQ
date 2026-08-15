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