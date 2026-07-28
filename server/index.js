require('dotenv').config();
const express = require('express');
const cors = require('cors');
const conexion = require('./database/conexion');

const app = express();
const PUERTO = process.env.PUERTO || 3000;

app.use(express.json());
app.use(cors());

app.get('/health', async (_req, res) => {
  try {
    await conexion.query('SELECT 1');
    res.json({ status: 'ok' });
  } catch (_error) {
    res.status(503).json({ status: 'database-unavailable' });
  }
});

app.use('/auth', require('./routes/auth.routes'));
app.use('/usuarios', require('./routes/usuarios.routes'));
app.use('/espacios', require('./routes/espacios.routes'));
app.use('/horarios', require('./routes/horarios.routes'));
app.use('/objetos-perdidos', require('./routes/objetos.routes'));
app.use('/reservas', require('./routes/reservas.routes'));
app.use('/push', require('./routes/push.routes'));
app.use('/ai', require('./routes/ai.routes'));

const start = async () => {
  try {
    await require('./database/migrate')();
    app.listen(PUERTO, () => {
      console.log(`Servidor ESPEConnect ejecutándose en el puerto: ${PUERTO}`);
    });
  } catch (error) {
    console.error('No se pudo preparar la base de datos:', error);
    process.exit(1);
  }
};

start();
