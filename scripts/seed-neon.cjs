const { readFileSync } = require('fs');
const { resolve } = require('path');
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

async function run() {
  for (const file of ['seed_horarios.sql', 'seed_objetos.sql']) {
    const sql = readFileSync(resolve(__dirname, '../database', file), 'utf8');
    try {
      await pool.query(sql);
      console.log(`${file} OK`);
    } catch (err) {
      console.error(`${file}: ${err.message}`);
    }
  }
  await pool.end();
}

run();