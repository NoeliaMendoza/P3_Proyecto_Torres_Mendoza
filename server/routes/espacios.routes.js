const express = require('express');
const router = express.Router();
const conexion = require('../database/conexion');
const authentication = require('../middlewares/authentication');
const authorization = require('../middlewares/authorization');

router.get('/', authentication, async (req, res) => {
  try {
    const { tipo, estado, capacidad } = req.query;
    let query = `SELECT e.id, e.codigo, e.nombre, e.capacidad, e.edificio, e.piso, e.estado,
                        e.tiene_proyector, e.tiene_computadoras, te.nombre AS tipo_espacio
                 FROM espacios_academicos e INNER JOIN tipos_espacio te ON e.id_tipo = te.id WHERE 1=1`;
    const params = []; let i = 1;
    if (tipo) { query += ` AND te.nombre ILIKE $${i++}`; params.push(`%${tipo}%`); }
    if (estado) { query += ` AND e.estado = $${i++}`; params.push(estado); }
    if (capacidad) { query += ` AND e.capacidad >= $${i++}`; params.push(parseInt(capacidad)); }
    query += ' ORDER BY e.edificio, e.codigo';
    res.json((await conexion.query(query, params)).rows);
  } catch (error) { res.status(500).json({ mensaje: 'Error interno del servidor.' }); }
});

router.get('/tipos', authentication, async (req, res) => {
  try { res.json((await conexion.query('SELECT * FROM tipos_espacio ORDER BY nombre')).rows); }
  catch (error) { res.status(500).json({ mensaje: 'Error interno del servidor.' }); }
});

router.get('/:id', authentication, async (req, res) => {
  try {
    const r = await conexion.query(
      `SELECT e.*, te.nombre AS tipo_espacio FROM espacios_academicos e
       INNER JOIN tipos_espacio te ON e.id_tipo = te.id WHERE e.id = $1`, [req.params.id]
    );
    if (r.rows.length === 0) return res.status(404).json({ mensaje: 'Espacio no encontrado.' });
    res.json(r.rows[0]);
  } catch (error) { res.status(500).json({ mensaje: 'Error interno del servidor.' }); }
});

router.get('/:id/disponibilidad', authentication, async (req, res) => {
  try {
    const horarios = (await conexion.query(
      `SELECT h.dia_semana, h.hora_inicio, h.hora_fin, a.nombre AS asignatura, d.nombre_completo AS docente
       FROM horarios h INNER JOIN nrc n ON h.id_nrc = n.id
       INNER JOIN asignaturas a ON n.id_asignatura = a.id
       LEFT JOIN docentes d ON n.id_docente = d.id
       WHERE h.id_espacio = $1 ORDER BY h.dia_semana, h.hora_inicio`, [req.params.id]
    )).rows;
    const disp = (await conexion.query(
      `SELECT fecha, dia_semana, hora_inicio, hora_fin, disponible, motivo
       FROM disponibilidad_espacios WHERE id_espacio = $1 ORDER BY fecha, hora_inicio`, [req.params.id]
    )).rows;
    res.json({ horarios, disponibilidad: disp });
  } catch (error) { res.status(500).json({ mensaje: 'Error interno del servidor.' }); }
});

router.post('/', authentication, authorization('admin'), async (req, res) => {
  try {
    const { codigo, nombre, id_tipo, edificio, piso, capacidad, tiene_proyector, tiene_computadoras } = req.body;
    if (!codigo || !nombre || !id_tipo) return res.status(400).json({ mensaje: 'Código, nombre y tipo son requeridos.' });
    const r = await conexion.query(
      `INSERT INTO espacios_academicos (codigo, nombre, id_tipo, edificio, piso, capacidad, tiene_proyector, tiene_computadoras)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *`,
      [codigo, nombre, id_tipo, edificio||null, piso||null, capacidad||null, tiene_proyector||false, tiene_computadoras||false]
    );
    res.status(201).json({ mensaje: 'Espacio creado correctamente.', espacio: r.rows[0] });
  } catch (error) { res.status(500).json({ mensaje: 'Error interno del servidor.' }); }
});

router.put('/:id', authentication, authorization('admin'), async (req, res) => {
  try {
    const { codigo, nombre, id_tipo, edificio, piso, capacidad, tiene_proyector, tiene_computadoras, estado } = req.body;
    const r = await conexion.query(
      `UPDATE espacios_academicos SET codigo=COALESCE($1,codigo), nombre=COALESCE($2,nombre),
       id_tipo=COALESCE($3,id_tipo), edificio=COALESCE($4,edificio), piso=COALESCE($5,piso),
       capacidad=COALESCE($6,capacidad), tiene_proyector=COALESCE($7,tiene_proyector),
       tiene_computadoras=COALESCE($8,tiene_computadoras), estado=COALESCE($9,estado)
       WHERE id=$10 RETURNING *`,
      [codigo, nombre, id_tipo, edificio, piso, capacidad, tiene_proyector, tiene_computadoras, estado, req.params.id]
    );
    if (r.rows.length === 0) return res.status(404).json({ mensaje: 'Espacio no encontrado.' });
    res.json({ mensaje: 'Espacio actualizado correctamente.', espacio: r.rows[0] });
  } catch (error) { res.status(500).json({ mensaje: 'Error interno del servidor.' }); }
});

router.patch('/:id/estado', authentication, authorization('admin'), async (req, res) => {
  try {
    const { estado } = req.body;
    if (!estado || !['disponible', 'mantenimiento'].includes(estado))
      return res.status(400).json({ mensaje: 'Estado inválido. Use "disponible" o "mantenimiento".' });
    const r = await conexion.query(
      'UPDATE espacios_academicos SET estado=$1 WHERE id=$2 RETURNING id, codigo, nombre, estado',
      [estado, req.params.id]
    );
    if (r.rows.length === 0) return res.status(404).json({ mensaje: 'Espacio no encontrado.' });
    res.json({ mensaje: 'Estado actualizado.', espacio: r.rows[0] });
  } catch (error) { res.status(500).json({ mensaje: 'Error interno del servidor.' }); }
});

module.exports = router;
