const express = require('express');
const router = express.Router();
const conexion = require('../database/conexion');
const authentication = require('../middlewares/authentication');
const { getHorarioEstudiante, getHorarioDocente } = require('../services/usuario-context.service');

router.get('/mi-horario', authentication, async (req, res) => {
  try {
    const user = (
      await conexion.query(
        'SELECT id, rol, id_docente, id_periodo_activo FROM usuarios WHERE id = $1',
        [req.usuario.id],
      )
    ).rows[0];

    if (!user?.id_periodo_activo) {
      return res.status(404).json({
        mensaje: 'No tienes un periodo académico activo registrado.',
      });
    }

    let horario = [];
    if (user.rol === 'estudiante') {
      horario = await getHorarioEstudiante(user.id, user.id_periodo_activo);
    } else if (user.rol === 'docente' && user.id_docente) {
      horario = await getHorarioDocente(user.id_docente, user.id_periodo_activo);
    } else {
      return res.status(403).json({
        mensaje: 'Tu rol no tiene un horario personal asociado.',
      });
    }

    res.json(horario);
  } catch (error) {
    console.error('Error al consultar horario personal:', error);
    res.status(500).json({ mensaje: 'No se pudo consultar tu horario.' });
  }
});

router.get('/', authentication, async (req, res) => {
  try {
    const { periodo, espacio, docente, dia, carrera } = req.query;

    let query = 'SELECT * FROM vista_horarios_completa WHERE 1=1';
    const params = [];
    let i = 1;
    if (periodo) {
      query += ` AND periodo = $${i++}`;
      params.push(periodo);
    }
    if (espacio) {
      query += ` AND codigo_espacio ILIKE $${i++}`;
      params.push(`%${espacio}%`);
    }
    if (docente) {
      query += ` AND docente ILIKE $${i++}`;
      params.push(`%${docente}%`);
    }
    if (dia) {
      query += ` AND dia ILIKE $${i++}`;
      params.push(`%${dia}%`);
    }
    if (carrera) {
      query += ` AND carrera ILIKE $${i++}`;
      params.push(`%${carrera}%`);
    }
    query += ' ORDER BY dia_semana, hora_inicio';
    res.json((await conexion.query(query, params)).rows);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error interno del servidor.' });
  }
});

router.get('/periodo-actual', authentication, async (req, res) => {
  try {
    const r = await conexion.query(
      'SELECT * FROM periodos_academicos WHERE activo = true LIMIT 1',
    );
    if (r.rows.length === 0) {
      return res.status(404).json({ mensaje: 'No hay periodo activo.' });
    }
    res.json(r.rows[0]);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error interno del servidor.' });
  }
});

router.get('/periodo/:id', authentication, async (req, res) => {
  try {
    res.json(
      (
        await conexion.query(
          'SELECT * FROM vista_horarios_completa WHERE periodo_id = $1 ORDER BY dia_semana, hora_inicio',
          [req.params.id],
        )
      ).rows,
    );
  } catch (error) {
    res.status(500).json({ mensaje: 'Error interno del servidor.' });
  }
});

router.get('/espacio/:id', authentication, async (req, res) => {
  try {
    res.json(
      (
        await conexion.query(
          'SELECT * FROM vista_horarios_completa WHERE espacio_id = $1 ORDER BY dia_semana, hora_inicio',
          [req.params.id],
        )
      ).rows,
    );
  } catch (error) {
    res.status(500).json({ mensaje: 'Error interno del servidor.' });
  }
});

module.exports = router;
