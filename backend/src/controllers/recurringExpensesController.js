const pool = require('../config/db');

function lastDayOfCurrentMonth() {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
}

function currentMonthDateFor(dayOfMonth) {
  const now = new Date();
  const day = Math.min(dayOfMonth, lastDayOfCurrentMonth());
  const date = new Date(now.getFullYear(), now.getMonth(), day);
  return date.toISOString().slice(0, 10);
}

async function listRecurringExpenses(req, res, next) {
  try {
    const { rows } = await pool.query(
      `SELECT re.*, a.name AS account_name,
         EXISTS (
           SELECT 1 FROM transactions t
           WHERE t.recurring_expense_id = re.id
             AND t.date >= date_trunc('month', CURRENT_DATE)
             AND t.date < date_trunc('month', CURRENT_DATE) + interval '1 month'
         ) AS logged_this_month
       FROM recurring_expenses re
       JOIN accounts a ON a.id = re.account_id
       ORDER BY re.day_of_month, re.name`
    );
    res.json(rows);
  } catch (err) {
    next(err);
  }
}

async function createRecurringExpense(req, res, next) {
  try {
    const { account_id, name, category, amount, day_of_month, active } = req.body;

    if (!account_id || !name || amount === undefined || !day_of_month) {
      return res.status(400).json({ error: 'account_id, name, amount and day_of_month are required' });
    }
    if (day_of_month < 1 || day_of_month > 31) {
      return res.status(400).json({ error: 'day_of_month must be between 1 and 31' });
    }

    const { rows } = await pool.query(
      `INSERT INTO recurring_expenses (account_id, name, category, amount, day_of_month, active)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [account_id, name, category || 'other', amount, day_of_month, active === undefined ? true : active]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    next(err);
  }
}

async function updateRecurringExpense(req, res, next) {
  try {
    const { account_id, name, category, amount, day_of_month, active } = req.body;

    if (day_of_month !== undefined && (day_of_month < 1 || day_of_month > 31)) {
      return res.status(400).json({ error: 'day_of_month must be between 1 and 31' });
    }

    const { rows } = await pool.query(
      `UPDATE recurring_expenses SET
        account_id = COALESCE($1, account_id),
        name = COALESCE($2, name),
        category = COALESCE($3, category),
        amount = COALESCE($4, amount),
        day_of_month = COALESCE($5, day_of_month),
        active = COALESCE($6, active),
        updated_at = now()
       WHERE id = $7 RETURNING *`,
      [account_id, name, category, amount, day_of_month, active, req.params.id]
    );
    if (rows.length === 0) return res.status(404).json({ error: 'Recurring expense not found' });
    res.json(rows[0]);
  } catch (err) {
    next(err);
  }
}

async function deleteRecurringExpense(req, res, next) {
  try {
    const { rows } = await pool.query('DELETE FROM recurring_expenses WHERE id = $1 RETURNING id', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ error: 'Recurring expense not found' });
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}

async function logRecurringExpense(req, res, next) {
  try {
    const { rows: reRows } = await pool.query('SELECT * FROM recurring_expenses WHERE id = $1', [req.params.id]);
    if (reRows.length === 0) return res.status(404).json({ error: 'Recurring expense not found' });
    const recurring = reRows[0];

    const { rows: existing } = await pool.query(
      `SELECT id FROM transactions
       WHERE recurring_expense_id = $1
         AND date >= date_trunc('month', CURRENT_DATE)
         AND date < date_trunc('month', CURRENT_DATE) + interval '1 month'`,
      [recurring.id]
    );
    if (existing.length > 0) {
      return res.status(409).json({ error: 'Already logged for this month' });
    }

    const { rows } = await pool.query(
      `INSERT INTO transactions (account_id, date, description, category, amount, recurring_expense_id)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [
        recurring.account_id,
        currentMonthDateFor(recurring.day_of_month),
        recurring.name,
        recurring.category,
        -Math.abs(Number(recurring.amount)),
        recurring.id,
      ]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    next(err);
  }
}

async function logAllDue(req, res, next) {
  try {
    const { rows: due } = await pool.query(
      `SELECT re.* FROM recurring_expenses re
       WHERE re.active = true
         AND NOT EXISTS (
           SELECT 1 FROM transactions t
           WHERE t.recurring_expense_id = re.id
             AND t.date >= date_trunc('month', CURRENT_DATE)
             AND t.date < date_trunc('month', CURRENT_DATE) + interval '1 month'
         )`
    );

    const created = [];
    for (const recurring of due) {
      const { rows } = await pool.query(
        `INSERT INTO transactions (account_id, date, description, category, amount, recurring_expense_id)
         VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
        [
          recurring.account_id,
          currentMonthDateFor(recurring.day_of_month),
          recurring.name,
          recurring.category,
          -Math.abs(Number(recurring.amount)),
          recurring.id,
        ]
      );
      created.push(rows[0]);
    }

    res.status(201).json({ created: created.length, transactions: created });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  listRecurringExpenses,
  createRecurringExpense,
  updateRecurringExpense,
  deleteRecurringExpense,
  logRecurringExpense,
  logAllDue,
};
