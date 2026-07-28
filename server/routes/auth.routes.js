const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
const conexion = require('../database/conexion');
const generarToken = require('../config/jwt');
const rateLimit = require('../middlewares/rateLimit');
const { normalizeEmail, validateRegistration } = require('../validators/registration.validator');

const registerLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 8,
  message: 'Demasiados intentos de registro. Espera unos minutos antes de intentarlo nuevamente.',
});

router.post('/register', registerLimiter, async (req, res) => {
  try {
    const validation = validateRegistration(req.body);
    if (!validation.valid) {
      return res.status(400).json({
        mensaje: 'Revisa los datos del formulario.',
        errores: validation.errors,
      });
    }
    const { nombre, correo, password } = validation.values;

    const existe = await conexion.query('SELECT id FROM usuarios WHERE email = $1', [correo]);
    if (existe.rows.length > 0)
      return res.status(409).json({
        mensaje: 'El correo ya se encuentra registrado.',
        errores: { correo: 'Ya existe una cuenta con este correo institucional.' },
      });

    const hash = await bcrypt.hash(password, 10);
    const r = await conexion.query(
      `INSERT INTO usuarios (email, password_hash, nombre_completo, rol) VALUES ($1,$2,$3,'estudiante') RETURNING id, email, nombre_completo, rol`,
      [correo, hash, nombre]
    );
    res.status(201).json({ mensaje: 'Usuario registrado correctamente.', usuario: r.rows[0] });
  } catch (error) {
    if (error.code === '23505') {
      return res.status(409).json({
        mensaje: 'El correo ya se encuentra registrado.',
        errores: { correo: 'Ya existe una cuenta con este correo institucional.' },
      });
    }
    console.error(error);
    res.status(500).json({ mensaje: 'Error interno del servidor.' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const correo = normalizeEmail(req.body.correo);
    const { password } = req.body;
    if (!correo || !password)
      return res.status(400).json({ mensaje: 'Debe ingresar el correo y la contraseña.' });

    const r = await conexion.query(
      'SELECT id, email, nombre_completo, password_hash, rol FROM usuarios WHERE email = $1', [correo]
    );
    if (r.rows.length === 0) return res.status(404).json({ mensaje: 'Usuario no encontrado.' });

    const usuario = r.rows[0];
    const correcta = await bcrypt.compare(password, usuario.password_hash);
    if (!correcta) return res.status(401).json({ mensaje: 'Contraseña incorrecta.' });

    const token = generarToken({ id: usuario.id, nombre: usuario.nombre_completo, correo: usuario.email, rol: usuario.rol });
    res.status(200).json({
      mensaje: 'Inicio de sesión correcto.', token,
      usuario: { id: usuario.id, nombre: usuario.nombre_completo, correo: usuario.email, rol: usuario.rol }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error interno del servidor.' });
  }
});

router.post('/recuperar-password', async (req, res) => {
  const { correo } = req.body;
  if (!correo) return res.status(400).json({ mensaje: 'El correo es obligatorio.' });
  // Respuesta neutra para no revelar si una cuenta existe.
  res.json({
    mensaje: 'Si el correo está registrado, recibirás instrucciones del administrador.',
  });
});

router.get('/perfil', async (req, res) => {
  try {
    const auth = req.headers.authorization;
    if (!auth) return res.status(401).json({ mensaje: 'Token requerido.' });
    const decoded = require('jsonwebtoken').verify(auth.split(' ')[1], process.env.JWT_SECRET);
    const r = await conexion.query('SELECT id, email, nombre_completo, rol FROM usuarios WHERE id = $1', [decoded.id]);
    if (r.rows.length === 0) return res.status(404).json({ mensaje: 'Usuario no encontrado.' });
    res.json(r.rows[0]);
  } catch (error) {
    res.status(401).json({ mensaje: 'Token inválido.' });
  }
});

module.exports = router;
