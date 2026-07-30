require('dotenv').config();

const express = require('express');
const cors = require('cors');
const conexion = require('../server/database/conexion');
const app = express();

app.use(cors());
app.use(express.json({ limit: '10mb' }));

app.use(async (_req, _res, next) => {
  try {
    const { rows } = await conexion.query(
      `SELECT to_regclass('public.auth_tokens') AS t`
    );
    if (!rows[0]?.t) {
      await require('../server/database/migrate')();
    }
  } catch (_) {}
  next();
});

app.get('/api/health', async (_req, res) => {
  try {
    await conexion.query('SELECT 1');
    res.json({ status: 'ok', db: 'neon' });
  } catch (e) {
    res.status(503).json({ status: 'error', message: e.message });
  }
});

app.use('/api/auth', require('../server/routes/auth.routes'));
app.use('/api/usuarios', require('../server/routes/usuarios.routes'));
app.use('/api/espacios', require('../server/routes/espacios.routes'));
app.use('/api/horarios', require('../server/routes/horarios.routes'));
app.use('/api/objetos-perdidos', require('../server/routes/objetos.routes'));
app.use('/api/reservas', require('../server/routes/reservas.routes'));
app.use('/api/push', require('../server/routes/push.routes'));
app.use('/api/ai', require('../server/routes/ai.routes'));
app.use('/api/notificaciones', require('../server/routes/notificaciones.routes'));
app.use('/api/matriculas', require('../server/routes/matriculas.routes'));

if (process.env.VERCEL !== '1') {
  const PUERTO = process.env.PUERTO || 3000;
  app.listen(PUERTO, () => console.log('Servidor ESPEConnect en puerto: ' + PUERTO));
}

module.exports = app;
