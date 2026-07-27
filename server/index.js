require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
const PUERTO = process.env.PUERTO || 3000;

app.use(express.json());
app.use(cors());

app.use('/auth', require('./routes/auth.routes'));
app.use('/usuarios', require('./routes/usuarios.routes'));
app.use('/espacios', require('./routes/espacios.routes'));
app.use('/horarios', require('./routes/horarios.routes'));
app.use('/objetos-perdidos', require('./routes/objetos.routes'));

app.listen(PUERTO, () => {
  console.log('Servidor ESPEConnect ejecutándose en el puerto: ' + PUERTO);
});
