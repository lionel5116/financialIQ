require('dotenv').config();

const fs = require('fs');
const path = require('path');
const pool = require('../src/config/db');

async function run() {
  const sql = fs.readFileSync(path.join(__dirname, '../db/clear.sql'), 'utf8');
  await pool.query(sql);
  console.log('All data cleared (accounts, transactions, investments are now empty).');
  await pool.end();
}

run().catch((err) => {
  console.error('Failed to clear database:', err.message);
  process.exit(1);
});
