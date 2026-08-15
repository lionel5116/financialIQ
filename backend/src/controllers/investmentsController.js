const pool = require('../config/db');

const ASSET_CLASSES = ['stock', 'bond', 'etf', 'mutual_fund', 'cash'];

async function listInvestments(req, res, next) {
  try {
    const { accountId } = req.query;
    const params = [];
    let query = `SELECT i.*, a.name AS account_name,
                   (i.shares * i.current_price) AS current_value
                 FROM investments i
                 JOIN accounts a ON a.id = i.account_id`;

    if (accountId) {
      params.push(accountId);
      query += ` WHERE i.account_id = $${params.length}`;
    }
    query += ' ORDER BY i.symbol';

    const { rows } = await pool.query(query, params);
    res.json(rows);
  } catch (err) {
    next(err);
  }
}

async function createInvestment(req, res, next) {
  try {
    const { account_id, symbol, name, asset_class, shares, cost_basis, current_price } = req.body;

    if (!account_id || !symbol || !name || !asset_class) {
      return res.status(400).json({ error: 'account_id, symbol, name and asset_class are required' });
    }
    if (!ASSET_CLASSES.includes(asset_class)) {
      return res.status(400).json({ error: `asset_class must be one of: ${ASSET_CLASSES.join(', ')}` });
    }

    const { rows } = await pool.query(
      `INSERT INTO investments (account_id, symbol, name, asset_class, shares, cost_basis, current_price)
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [account_id, symbol.toUpperCase(), name, asset_class, shares || 0, cost_basis || 0, current_price || 0]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    next(err);
  }
}

async function updateInvestment(req, res, next) {
  try {
    const { symbol, name, asset_class, shares, cost_basis, current_price } = req.body;

    if (asset_class && !ASSET_CLASSES.includes(asset_class)) {
      return res.status(400).json({ error: `asset_class must be one of: ${ASSET_CLASSES.join(', ')}` });
    }

    const { rows } = await pool.query(
      `UPDATE investments SET
        symbol = COALESCE($1, symbol),
        name = COALESCE($2, name),
        asset_class = COALESCE($3, asset_class),
        shares = COALESCE($4, shares),
        cost_basis = COALESCE($5, cost_basis),
        current_price = COALESCE($6, current_price),
        updated_at = now()
       WHERE id = $7 RETURNING *`,
      [symbol ? symbol.toUpperCase() : null, name, asset_class, shares, cost_basis, current_price, req.params.id]
    );
    if (rows.length === 0) return res.status(404).json({ error: 'Investment not found' });
    res.json(rows[0]);
  } catch (err) {
    next(err);
  }
}

async function deleteInvestment(req, res, next) {
  try {
    const { rows } = await pool.query('DELETE FROM investments WHERE id = $1 RETURNING id', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ error: 'Investment not found' });
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}

module.exports = { listInvestments, createInvestment, updateInvestment, deleteInvestment, ASSET_CLASSES };
