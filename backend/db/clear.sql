-- Deletes all rows from every FinancialIQ table without dropping the schema.
-- RESTART IDENTITY resets the id sequences back to 1; CASCADE follows the
-- accounts -> transactions/investments foreign keys.
TRUNCATE TABLE accounts, transactions, investments RESTART IDENTITY CASCADE;
