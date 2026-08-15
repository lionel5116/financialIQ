const pool = require('../config/db');

async function getSummary(req, res, next) {
  try {
    const accountsResult = await pool.query('SELECT type, balance FROM accounts');
    const investmentsResult = await pool.query(
      'SELECT asset_class, (shares * current_price) AS current_value FROM investments'
    );
    const monthlySpendResult = await pool.query(
      `SELECT COALESCE(SUM(amount), 0) AS total
       FROM transactions
       WHERE amount < 0 AND date >= date_trunc('month', CURRENT_DATE)`
    );

    const accountsByType = {};
    let netWorth = 0;
    for (const row of accountsResult.rows) {
      const balance = Number(row.balance);
      netWorth += balance;
      accountsByType[row.type] = (accountsByType[row.type] || 0) + balance;
    }

    const allocationByAssetClass = {};
    let investmentsTotal = 0;
    for (const row of investmentsResult.rows) {
      const value = Number(row.current_value);
      investmentsTotal += value;
      allocationByAssetClass[row.asset_class] = (allocationByAssetClass[row.asset_class] || 0) + value;
    }

    res.json({
      netWorth,
      accountsByType,
      investmentsTotal,
      allocationByAssetClass,
      monthToDateSpend: Math.abs(Number(monthlySpendResult.rows[0].total)),
    });
  } catch (err) {
    next(err);
  }
}

module.exports = { getSummary };
