# FinancialIQ

A full-stack personal finance app for tracking bank accounts, CDs, IRAs, 401(k)/brokerage accounts, home equity, recurring monthly bills, daily transactions, and investment portfolios — with CSV/PDF export and asset allocation charts.

See [INSTRUCTIONS.md](./INSTRUCTIONS.md) for the original architecture blueprint.

## Stack

- **Backend:** Node.js + Express, PostgreSQL (`pg`, parameterized queries), plain JavaScript (no TypeScript)
- **Frontend:** React + TypeScript (Vite), Tailwind CSS, Recharts, jsPDF/jsPDF-AutoTable

## Prerequisites

- Node.js 18+
- A running local PostgreSQL server (this project is set up against [Postgres.app](https://postgresapp.com/), but any local Postgres works)

## Setup

### 0. Root install (once per clone)

```bash
npm install          # root devDependencies + activates the git hook below
npm run install:all  # backend + frontend dependencies
```

This also wires up a `post-merge` git hook (via `husky`) that re-runs `npm run install:all` automatically after every future `git pull` that brings in new commits — so dependency changes never require a manual reinstall. It only needs this one `npm install` to activate; after that it's automatic for the life of this clone.

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
npm run seed   # drops/recreates accounts, transactions, investments and loads db/seed.sql
npm run dev    # starts the API on http://localhost:4000
```

> `db/seed.sql` currently holds a real snapshot of this project's own account data (see `npm run snapshot` below), not generic demo data — and this repo is public. Be mindful of that before adding more real financial detail to it.

### 3. Frontend

```bash
cd frontend
cp .env.example .env    # points at the backend API
npm install
npm run dev              # starts on http://localhost:5173
```

Open http://localhost:5173.

### 4. Accessing from another device on your network (iPad, phone, etc.)

The Vite dev server binds to all network interfaces (`server.host: true` in `frontend/vite.config.ts`), and `frontend/src/services/api.ts` derives the API URL from whatever host the page was loaded from — so no per-device frontend config is needed. Two things to know:

- Find your Mac's LAN IP (System Settings → Wi-Fi → Details → TCP/IP, or `ipconfig getifaddr en0`) and visit `http://<that-ip>:5173` from the other device, on the same network.
- The backend only accepts requests from origins listed in `CLIENT_ORIGIN` (`backend/.env`) — it must include that same LAN URL, e.g.:
  ```ini
  CLIENT_ORIGIN=http://localhost:5173,http://192.168.1.10:5173
  ```
  If your Mac's LAN IP changes (DHCP), update this and restart the backend.

## API

| Method | Route | Description |
|---|---|---|
| GET/POST | `/api/accounts` | List / create accounts |
| PUT/DELETE | `/api/accounts/:id` | Update / delete an account |
| GET/POST | `/api/transactions` | List (optional `?accountId=`) / create transactions |
| PUT/DELETE | `/api/transactions/:id` | Update / delete a transaction |
| GET/POST | `/api/investments` | List (optional `?accountId=`) / create investment holdings |
| PUT/DELETE | `/api/investments/:id` | Update / delete a holding |
| GET/POST | `/api/recurring-expenses` | List (with `logged_this_month`) / create recurring monthly bills |
| PUT/DELETE | `/api/recurring-expenses/:id` | Update / delete a recurring expense |
| POST | `/api/recurring-expenses/:id/log` | Create this month's transaction for one recurring expense (409 if already logged) |
| POST | `/api/recurring-expenses/log-all` | Log every active recurring expense not yet logged this month |
| GET | `/api/dashboard/summary` | Net worth, total assets, total cash, balances by type, allocation by asset class, month-to-date spend, income/expense trend, recurring monthly total |

## Scripts

From the project root (runs both apps together via `concurrently`):

| Command | Description |
|---|---|
| `npm run dev` | Start backend + frontend together, labeled/color-coded output |
| `npm run stop` | Free ports 4000 + 5173 and stop both dev servers |
| `npm run install:all` | `npm install` in both `backend/` and `frontend/` |
| `npm run seed` | (Re)apply schema + load `db/seed.sql` |
| `npm run clear` | Wipe all data back to empty (keeps schema, does **not** reseed) |
| `npm run snapshot` | Dump the live database into `db/seed.sql`, replacing it — your backup |
| `npm run build` | Production build of the frontend |
| `npm run prepare` | Runs automatically on `npm install` (via `husky`) — wires up the git hooks below, no need to run by hand |

**Git hooks** (`.husky/`): `post-merge` runs `npm run install:all` — since `git pull` performs a merge, this fires after every pull, keeping both apps' dependencies current automatically.

Per-app:

| Location | Command | Description |
|---|---|---|
| `backend/` | `npm run dev` | Start the API with auto-reload |
| `backend/` | `npm run seed` | Drop/recreate tables and load `db/seed.sql` |
| `backend/` | `npm run clear` | Truncate all tables (reset to empty, id sequences reset to 1) |
| `backend/` | `npm run snapshot` | Dump accounts/transactions/investments into `db/seed.sql` (ids and relationships preserved) |
| `frontend/` | `npm run dev` | Start the Vite dev server |
| `frontend/` | `npm run build` | Type-check and build for production |
