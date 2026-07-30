const path = require('path');
const dotenv = require('dotenv');

// Configuración compartida (base de datos, JWT, VAPID).
dotenv.config({ path: path.resolve(__dirname, '../.env') });
// Secretos exclusivos del backend local (por ejemplo SMTP).
// Estos valores tienen prioridad y el archivo permanece ignorado por Git.
dotenv.config({ path: path.resolve(__dirname, '.env'), override: true });
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
    const email = require('./services/email.service').getEmailStatus();
    res.json({ status: 'ok', email });
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
app.use('/notificaciones', require('./routes/notificaciones.routes'));
app.use('/matriculas', require('./routes/matriculas.routes'));


let httpServer;

const start = async () => {
  try {
    await require('./database/migrate')();
    await require('./database/seed-demo-users')();
    httpServer = app.listen(PUERTO, (listenError) => {
      if (listenError) {
        console.error(`No se pudo iniciar el servidor en el puerto ${PUERTO}:`, {
          code: listenError.code,
          message: listenError.message,
        });
        process.exitCode = 1;
        return;
      }

      console.log(`Servidor ESPEConnect ejecutándose en el puerto: ${PUERTO}`);
      require('./services/email.service')
        .verifyEmailTransport()
        .catch((error) => {
          console.error('[email] SMTP no disponible:', {
            code: error.code,
            responseCode: error.responseCode,
            message: error.message,
          });
        });
    });
  } catch (error) {
    console.error('No se pudo preparar la base de datos:', error);
    process.exit(1);
  }
};

start();

module.exports = { app, start, getHttpServer: () => httpServer };
