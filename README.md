# FinancialIQ

A full-stack personal finance app for tracking bank accounts, CDs, IRAs, 401(k)/brokerage accounts, daily transactions, and investment portfolios — with CSV/PDF export and an asset allocation chart.

See [INSTRUCTIONS.md](./INSTRUCTIONS.md) for the original architecture blueprint.

## Stack

- **Backend:** Node.js + Express, PostgreSQL (`pg`, parameterized queries), plain JavaScript (no TypeScript)
- **Frontend:** React + TypeScript (Vite), Tailwind CSS, Recharts, jsPDF/jsPDF-AutoTable

## Prerequisites

- Node.js 18+
- A running local PostgreSQL server (this project is set up against [Postgres.app](https://postgresapp.com/), but any local Postgres works)

## Setup

### 1. Database

This project expects a database named `financialIQ` (mixed-case) to already exist on your local Postgres server. If you're setting this up fresh:

```sql
CREATE DATABASE "financialIQ";
```

> The name is mixed-case, so it must be quoted in SQL and referenced exactly as `financialIQ` in `PGDATABASE`.

### 2. Backend

```bash
cd backend
cp .env.example .env
```

Edit `backend/.env` to point at your local database:

```ini
PGHOST=localhost
PGPORT=5432
PGDATABASE=financialIQ
PGUSER=postgres
PGPASSWORD=<your local postgres password>
```

`.env` is gitignored — it's never committed, so your password stays local.

```bash
npm install
npm run seed   # drops/recreates accounts, transactions, investments and loads seed data
npm run dev    # starts the API on http://localhost:4000
```

### 3. Frontend

```bash
cd frontend
cp .env.example .env    # points at the backend API
npm install
npm run dev              # starts on http://localhost:5173
```

Open http://localhost:5173.

## API

| Method | Route | Description |
|---|---|---|
| GET/POST | `/api/accounts` | List / create accounts |
| PUT/DELETE | `/api/accounts/:id` | Update / delete an account |
| GET/POST | `/api/transactions` | List (optional `?accountId=`) / create transactions |
| PUT/DELETE | `/api/transactions/:id` | Update / delete a transaction |
| GET/POST | `/api/investments` | List (optional `?accountId=`) / create investment holdings |
| PUT/DELETE | `/api/investments/:id` | Update / delete a holding |
| GET | `/api/dashboard/summary` | Net worth, balances by type, allocation by asset class, month-to-date spend |

## Scripts

| Location | Command | Description |
|---|---|---|
| `backend/` | `npm run dev` | Start the API with auto-reload |
| `backend/` | `npm run seed` | (Re)apply schema + seed data |
| `frontend/` | `npm run dev` | Start the Vite dev server |
| `frontend/` | `npm run build` | Type-check and build for production |
