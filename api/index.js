require('dotenv').config();
const express = require('express');
const cors = require('cors');
const conexion = require('../server/database/conexion');

const app = express();

app.use(express.json());
app.use(cors());

app.get('/api/health', async (_req, res) => {
  try {
    await conexion.query('SELECT 1');
    res.json({ status: 'ok' });
  } catch (_error) {
    res.status(503).json({ status: 'database-unavailable' });
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

const migrate = async () => {
  try {
    await require('../server/database/migrate')();
    await require('../server/database/seed-demo-users')();
    console.log('Migraciones y seed completados.');
  } catch (error) {
    console.error('Error en migraciones:', error);
  }
};

if (process.env.VERCEL !== '1') {
  const PUERTO = process.env.PUERTO || 3000;
  migrate().then(() => {
    app.listen(PUERTO, () => {
      console.log(`Servidor ESPEConnect en puerto: ${PUERTO}`);
    });
  });
}

module.exports = app;