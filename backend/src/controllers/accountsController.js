const pool = require('../config/db');

const ACCOUNT_TYPES = ['checking', 'savings', 'cash', 'cd', 'ira', '401k', 'brokerage'];

async function listAccounts(req, res, next) {
  try {
    const { rows } = await pool.query('SELECT * FROM accounts ORDER BY type, name');
    res.json(rows);
  } catch (err) {
    next(err);
  }
}

async function getAccount(req, res, next) {
  try {
    const { rows } = await pool.query('SELECT * FROM accounts WHERE id = $1', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ error: 'Account not found' });
    res.json(rows[0]);
  } catch (err) {
    next(err);
  }
}

async function createAccount(req, res, next) {
  try {
    const { name, type, institution, balance, interest_rate, maturity_date } = req.body;

    if (!name || !type) {
      return res.status(400).json({ error: 'name and type are required' });
    }
    if (!ACCOUNT_TYPES.includes(type)) {
      return res.status(400).json({ error: `type must be one of: ${ACCOUNT_TYPES.join(', ')}` });
    }

    const { rows } = await pool.query(
      `INSERT INTO accounts (name, type, institution, balance, interest_rate, maturity_date)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [name, type, institution || null, balance || 0, interest_rate || null, maturity_date || null]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    next(err);
  }
}

async function updateAccount(req, res, next) {
  try {
    const { name, type, institution, balance, interest_rate, maturity_date } = req.body;

    if (type && !ACCOUNT_TYPES.includes(type)) {
      return res.status(400).json({ error: `type must be one of: ${ACCOUNT_TYPES.join(', ')}` });
    }

    const { rows } = await pool.query(
      `UPDATE accounts SET
        name = COALESCE($1, name),
        type = COALESCE($2, type),
        institution = COALESCE($3, institution),
        balance = COALESCE($4, balance),
        interest_rate = COALESCE($5, interest_rate),
        maturity_date = COALESCE($6, maturity_date),
        updated_at = now()
       WHERE id = $7 RETURNING *`,
      [name, type, institution, balance, interest_rate, maturity_date, req.params.id]
    );

    if (rows.length === 0) return res.status(404).json({ error: 'Account not found' });
    res.json(rows[0]);
  } catch (err) {
    next(err);
  }
}

async function deleteAccount(req, res, next) {
  try {
    const { rows } = await pool.query('DELETE FROM accounts WHERE id = $1 RETURNING id', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ error: 'Account not found' });
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}

module.exports = { listAccounts, getAccount, createAccount, updateAccount, deleteAccount, ACCOUNT_TYPES };
