const pool = require('../config/db');

async function listTransactions(req, res, next) {
  try {
    const { accountId } = req.query;
    const params = [];
    let query = `SELECT t.*, a.name AS account_name FROM transactions t
                 JOIN accounts a ON a.id = t.account_id`;

    if (accountId) {
      params.push(accountId);
      query += ` WHERE t.account_id = $${params.length}`;
    }
    query += ' ORDER BY t.date DESC, t.id DESC';

    const { rows } = await pool.query(query, params);
    res.json(rows);
  } catch (err) {
    next(err);
  }
}

async function createTransaction(req, res, next) {
  try {
    const { account_id, date, description, category, amount } = req.body;

    if (!account_id || !date || !description || amount === undefined) {
      return res.status(400).json({ error: 'account_id, date, description and amount are required' });
    }

    const { rows } = await pool.query(
      `INSERT INTO transactions (account_id, date, description, category, amount)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [account_id, date, description, category || 'other', amount]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    next(err);
  }
}

async function updateTransaction(req, res, next) {
  try {
    const { date, description, category, amount } = req.body;
    const { rows } = await pool.query(
      `UPDATE transactions SET
        date = COALESCE($1, date),
        description = COALESCE($2, description),
        category = COALESCE($3, category),
        amount = COALESCE($4, amount)
       WHERE id = $5 RETURNING *`,
      [date, description, category, amount, req.params.id]
    );
    if (rows.length === 0) return res.status(404).json({ error: 'Transaction not found' });
    res.json(rows[0]);
  } catch (err) {
    next(err);
  }
}

async function deleteTransaction(req, res, next) {
  try {
    const { rows } = await pool.query('DELETE FROM transactions WHERE id = $1 RETURNING id', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ error: 'Transaction not found' });
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}

module.exports = { listTransactions, createTransaction, updateTransaction, deleteTransaction };
