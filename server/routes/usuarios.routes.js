const express = require('express');
const router = express.Router();
const conexion = require('../database/conexion');
const authentication = require('../middlewares/authentication');
const authorization = require('../middlewares/authorization');
const { getUsuarioProfile, getUsuarioContext } = require('../services/usuario-context.service');

router.get('/me', authentication, async (req, res) => {
  try {
    const profile = await getUsuarioProfile(req.usuario.id);
    if (!profile) return res.status(404).json({ mensaje: 'Usuario no encontrado.' });
    res.json(profile);
  } catch (error) {
    console.error('Error al consultar perfil:', error);
    res.status(500).json({ mensaje: 'No se pudo consultar el perfil.' });
  }
});

router.get('/me/contexto', authentication, async (req, res) => {
  try {
    const contexto = await getUsuarioContext(req.usuario.id);
    if (!contexto) return res.status(404).json({ mensaje: 'Usuario no encontrado.' });
    res.json(contexto);
  } catch (error) {
    console.error('Error al consultar contexto académico:', error);
    res.status(500).json({ mensaje: 'No se pudo consultar el contexto académico.' });
  }
});

router.get('/', authentication, authorization('admin'), async (req, res) => {
  try {
    const r = await conexion.query(
      'SELECT id, email, nombre_completo, rol, created_at FROM usuarios ORDER BY created_at DESC',
    );
    res.json(r.rows);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error interno del servidor.' });
  }
});

router.get('/:id', authentication, async (req, res) => {
  try {
    const r = await conexion.query(
      'SELECT id, email, nombre_completo, rol FROM usuarios WHERE id = $1',
      [req.params.id],
    );
    if (r.rows.length === 0) return res.status(404).json({ mensaje: 'Usuario no encontrado.' });
    res.json(r.rows[0]);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error interno del servidor.' });
  }
});

module.exports = router;
