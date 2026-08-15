require('dotenv').config();

const fs = require('fs');
const path = require('path');
const pool = require('../src/config/db');

async function run() {
  const sql = fs.readFileSync(path.join(__dirname, '../db/seed.sql'), 'utf8');
  await pool.query(sql);
  console.log('Database seeded successfully.');
  await pool.end();
}

run().catch((err) => {
  console.error('Failed to seed database:', err.message);
  process.exit(1);
});
