-- Adds 'cash' as a valid accounts.type value without touching existing rows.
-- Run this against a database that was seeded before 'cash' existed
-- (fresh installs get it for free via db/seed.sql).
ALTER TABLE accounts DROP CONSTRAINT accounts_type_check;
ALTER TABLE accounts ADD CONSTRAINT accounts_type_check
  CHECK (type IN ('checking', 'savings', 'cash', 'cd', 'ira', '401k', 'brokerage'));
