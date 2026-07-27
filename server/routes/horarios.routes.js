const express = require('express');
const router = express.Router();
const conexion = require('../database/conexion');
const authentication = require('../middlewares/authentication');

router.get('/', authentication, async (req, res) => {
  try {
    const { periodo, espacio, docente, dia } = req.query;
    let query = 'SELECT * FROM vista_horarios_completa WHERE 1=1';
    const params = []; let i = 1;
    if (periodo) { query += ` AND periodo = $${i++}`; params.push(periodo); }
    if (espacio) { query += ` AND codigo_espacio ILIKE $${i++}`; params.push(`%${espacio}%`); }
    if (docente) { query += ` AND docente ILIKE $${i++}`; params.push(`%${docente}%`); }
    if (dia) { query += ` AND dia ILIKE $${i++}`; params.push(`%${dia}%`); }
    query += ' ORDER BY dia_semana, hora_inicio';
    res.json((await conexion.query(query, params)).rows);
  } catch (error) { res.status(500).json({ mensaje: 'Error interno del servidor.' }); }
});

router.get('/periodo-actual', authentication, async (req, res) => {
  try {
    const r = await conexion.query('SELECT * FROM periodos_academicos WHERE activo = true LIMIT 1');
    if (r.rows.length === 0) return res.status(404).json({ mensaje: 'No hay periodo activo.' });
    res.json(r.rows[0]);
  } catch (error) { res.status(500).json({ mensaje: 'Error interno del servidor.' }); }
});

router.get('/periodo/:id', authentication, async (req, res) => {
  try {
    res.json((await conexion.query(
      'SELECT * FROM vista_horarios_completa WHERE periodo_id = $1 ORDER BY dia_semana, hora_inicio', [req.params.id]
    )).rows);
  } catch (error) { res.status(500).json({ mensaje: 'Error interno del servidor.' }); }
});

router.get('/espacio/:id', authentication, async (req, res) => {
  try {
    res.json((await conexion.query(
      'SELECT * FROM vista_horarios_completa WHERE espacio_id = $1 ORDER BY dia_semana, hora_inicio', [req.params.id]
    )).rows);
  } catch (error) { res.status(500).json({ mensaje: 'Error interno del servidor.' }); }
});

module.exports = router;
