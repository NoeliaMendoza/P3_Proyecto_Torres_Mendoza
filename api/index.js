require('dotenv').config();

const express = require('express');
const app = express();

app.use(express.json({ limit: '10mb' }));

app.get('/api/ping', (_req, res) => res.json({ pong: true }));

app.get('/api/health', async (_req, res) => {
  try {
    const { Pool } = require('pg');
    const pool = new Pool({ connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false } });
    await pool.query('SELECT 1');
    await pool.end();
    res.json({ status: 'ok', db: process.env.DATABASE_URL ? 'neon' : 'none' });
  } catch (e) {
    res.status(503).json({ status: 'error', message: e.message });
  }
});

if (process.env.VERCEL !== '1') {
  app.listen(3000, () => console.log('Local:3000'));
}

module.exports = app;