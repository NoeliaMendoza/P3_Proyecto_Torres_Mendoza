const { readFileSync } = require('fs');
const { resolve } = require('path');
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

async function run() {
  const schema = readFileSync(resolve(__dirname, '../database/schema.sql'), 'utf8');
  const seedObjetos = readFileSync(resolve(__dirname, '../database/seed_objetos.sql'), 'utf8');

  try {
    console.log('Creando schema...');
    await pool.query(schema);
    console.log('Schema OK.');
    console.log('Sembrando objetos...');
    await pool.query(seedObjetos);
    console.log('Seed objetos OK.');
  } catch (err) {
    console.error('Error:', err.message);
  } finally {
    await pool.end();
  }
}

run();