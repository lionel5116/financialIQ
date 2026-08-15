-- FinancialIQ PostgreSQL schema & seed data

DROP TABLE IF EXISTS investments;
DROP TABLE IF EXISTS transactions;
DROP TABLE IF EXISTS accounts;

-- Bank accounts, CDs, IRAs, 401k/brokerage accounts
CREATE TABLE accounts (
  id SERIAL PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  type VARCHAR(20) NOT NULL CHECK (type IN ('checking', 'savings', 'cash', 'cd', 'ira', '401k', 'brokerage')),
  institution VARCHAR(120),
  balance NUMERIC(14, 2) NOT NULL DEFAULT 0,
  interest_rate NUMERIC(5, 3),
  maturity_date DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Daily expenses / income tied to an account
CREATE TABLE transactions (
  id SERIAL PRIMARY KEY,
  account_id INTEGER NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  description VARCHAR(255) NOT NULL,
  category VARCHAR(50) NOT NULL DEFAULT 'other',
  amount NUMERIC(12, 2) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Investment holdings tied to an IRA/401k/brokerage account
CREATE TABLE investments (
  id SERIAL PRIMARY KEY,
  account_id INTEGER NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
  symbol VARCHAR(20) NOT NULL,
  name VARCHAR(120) NOT NULL,
  asset_class VARCHAR(20) NOT NULL CHECK (asset_class IN ('stock', 'bond', 'etf', 'mutual_fund', 'cash')),
  shares NUMERIC(14, 4) NOT NULL DEFAULT 0,
  cost_basis NUMERIC(14, 2) NOT NULL DEFAULT 0,
  current_price NUMERIC(14, 2) NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_transactions_account_id ON transactions(account_id);
CREATE INDEX idx_investments_account_id ON investments(account_id);

-- Seed data

INSERT INTO accounts (name, type, institution, balance, interest_rate, maturity_date) VALUES
  ('Everyday Checking', 'checking', 'Chase', 4250.35, NULL, NULL),
  ('High-Yield Savings', 'savings', 'Ally Bank', 18500.00, 4.250, NULL),
  ('12-Month CD', 'cd', 'Marcus by Goldman Sachs', 10000.00, 4.750, '2027-02-15'),
  ('Traditional IRA', 'ira', 'Fidelity', 42300.00, NULL, NULL),
  ('401k', '401k', 'Vanguard', 89750.00, NULL, NULL),
  ('Brokerage', 'brokerage', 'Charles Schwab', 27600.00, NULL, NULL);

INSERT INTO transactions (account_id, date, description, category, amount) VALUES
  (1, '2026-08-01', 'Paycheck', 'income', 3200.00),
  (1, '2026-08-02', 'Rent', 'housing', -1800.00),
  (1, '2026-08-03', 'Groceries - Trader Joes', 'groceries', -95.42),
  (1, '2026-08-05', 'Electric Bill', 'utilities', -120.10),
  (1, '2026-08-07', 'Gas Station', 'transportation', -48.00),
  (1, '2026-08-09', 'Netflix', 'subscriptions', -15.49),
  (1, '2026-08-10', 'Dinner Out', 'dining', -62.30),
  (2, '2026-08-01', 'Interest Payment', 'interest', 65.12);

INSERT INTO investments (account_id, symbol, name, asset_class, shares, cost_basis, current_price) VALUES
  (4, 'VTI', 'Vanguard Total Stock Market ETF', 'etf', 120.5000, 28000.00, 265.40),
  (4, 'BND', 'Vanguard Total Bond Market ETF', 'etf', 150.0000, 11000.00, 72.85),
  (5, 'VFIAX', 'Vanguard 500 Index Fund', 'mutual_fund', 300.0000, 65000.00, 235.10),
  (5, 'VBTLX', 'Vanguard Total Bond Market Index', 'mutual_fund', 200.0000, 15000.00, 10.15),
  (6, 'AAPL', 'Apple Inc.', 'stock', 40.0000, 6500.00, 228.50),
  (6, 'MSFT', 'Microsoft Corp.', 'stock', 25.0000, 8200.00, 415.20),
  (6, 'VXUS', 'Vanguard Total International Stock ETF', 'etf', 80.0000, 4400.00, 61.75);
