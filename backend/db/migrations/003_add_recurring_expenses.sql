-- Adds recurring expense tracking without touching existing rows.
-- Run this against a database that was seeded before recurring_expenses
-- existed (fresh installs get it for free via db/seed.sql).

CREATE TABLE recurring_expenses (
  id SERIAL PRIMARY KEY,
  account_id INTEGER NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  category VARCHAR(50) NOT NULL DEFAULT 'other',
  amount NUMERIC(12, 2) NOT NULL CHECK (amount > 0),
  day_of_month INTEGER NOT NULL CHECK (day_of_month BETWEEN 1 AND 31),
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_recurring_expenses_account_id ON recurring_expenses(account_id);

ALTER TABLE transactions
  ADD COLUMN recurring_expense_id INTEGER REFERENCES recurring_expenses(id) ON DELETE SET NULL;

CREATE INDEX idx_transactions_recurring_expense_id ON transactions(recurring_expense_id);
