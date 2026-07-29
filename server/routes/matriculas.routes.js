const express = require('express');
const router = express.Router();
const conexion = require('../database/conexion');
const authentication = require('../middlewares/authentication');
const authorization = require('../middlewares/authorization');

router.get('/', authentication, authorization('estudiante'), async (req, res) => {
  try {
    const userId = req.usuario.id;
    const user = (await conexion.query(
      'SELECT id_periodo_activo FROM usuarios WHERE id = $1', [userId],
    )).rows[0];
    if (!user?.id_periodo_activo) {
      return res.status(400).json({ mensaje: 'No tienes un periodo activo.' });
    }
    const result = await conexion.query(
      `SELECT n.id, n.nrc, a.codigo AS codigo_asignatura, a.nombre AS asignatura,
              a.creditos, n.nivel_pao, n.paralelo,
              d.nombre_completo AS docente,
              COALESCE(json_agg(json_build_object(
                'dia_semana', h.dia_semana,
                'hora_inicio', h.hora_inicio::text,
                'hora_fin', h.hora_fin::text,
                'espacio', e.codigo
              ) ORDER BY h.dia_semana, h.hora_inicio)
              FILTER (WHERE h.id IS NOT NULL), '[]'::json) AS horarios
       FROM nrc n
       JOIN asignaturas a ON a.id = n.id_asignatura
       LEFT JOIN docentes d ON d.id = n.id_docente
       LEFT JOIN horarios h ON h.id_nrc = n.id
       LEFT JOIN espacios_academicos e ON e.id = h.id_espacio
       WHERE n.id_periodo = $1
         AND n.id NOT IN (
           SELECT m.id_nrc FROM matriculas m
           WHERE m.id_usuario = $2 AND m.id_periodo = $1 AND m.estado = 'activa'
         )
       GROUP BY n.id, a.codigo, a.nombre, a.creditos, n.nivel_pao, n.paralelo, d.nombre_completo
       ORDER BY n.nivel_pao, a.nombre`,
      [user.id_periodo_activo, userId],
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Error al listar NRCs disponibles:', error);
    res.status(500).json({ mensaje: 'Error al consultar materias disponibles.' });
  }
});

router.post('/inscribir', authentication, authorization('estudiante'), async (req, res) => {
  try {
    const userId = req.usuario.id;
    const { id_nrc } = req.body;
    if (!id_nrc) {
      return res.status(400).json({ mensaje: 'Debes proporcionar el id_nrc.' });
    }
    const user = (await conexion.query(
      'SELECT id_periodo_activo FROM usuarios WHERE id = $1', [userId],
    )).rows[0];
    if (!user?.id_periodo_activo) {
      return res.status(400).json({ mensaje: 'No tienes un periodo activo.' });
    }
    const nrc = await conexion.query(
      'SELECT id, nrc FROM nrc WHERE id = $1 AND id_periodo = $2',
      [id_nrc, user.id_periodo_activo],
    );
    if (nrc.rows.length === 0) {
      return res.status(404).json({ mensaje: 'NRC no encontrado en el periodo actual.' });
    }
    const existe = await conexion.query(
      `SELECT id FROM matriculas
       WHERE id_usuario = $1 AND id_nrc = $2 AND id_periodo = $3 AND estado = 'activa'`,
      [userId, id_nrc, user.id_periodo_activo],
    );
    if (existe.rows.length > 0) {
      return res.status(409).json({ mensaje: 'Ya estás matriculado en este NRC.' });
    }
    const horariosNuevos = (await conexion.query(
      `SELECT dia_semana, hora_inicio, hora_fin
       FROM horarios WHERE id_nrc = $1 ORDER BY dia_semana, hora_inicio`, [id_nrc]
    )).rows;
    const horariosActuales = (await conexion.query(
      `SELECT h.dia_semana, h.hora_inicio, h.hora_fin
       FROM horarios h
       JOIN matriculas m ON m.id_nrc = h.id_nrc
       WHERE m.id_usuario = $1 AND m.id_periodo = $2 AND m.estado = 'activa'`,
      [userId, user.id_periodo_activo],
    )).rows;
    for (const nuevo of horariosNuevos) {
      for (const actual of horariosActuales) {
        if (nuevo.dia_semana === actual.dia_semana &&
            nuevo.hora_inicio < actual.hora_fin &&
            nuevo.hora_fin > actual.hora_inicio) {
          return res.status(409).json({
            mensaje: 'Choque de horarios: el NRC se superpone con una materia que ya tienes matriculada.',
          });
        }
      }
    }
    await conexion.query(
      `INSERT INTO matriculas (id_usuario, id_nrc, id_periodo, estado)
       VALUES ($1, $2, $3, 'activa')`,
      [userId, id_nrc, user.id_periodo_activo],
    );
    res.json({ mensaje: 'Inscripción exitosa.', nrc: nrc.rows[0].nrc });
  } catch (error) {
    console.error('Error al inscribir:', error);
    res.status(500).json({ mensaje: 'Error al inscribir en el NRC.' });
  }
});

router.get('/docente/disponibles', authentication, authorization('docente'), async (req, res) => {
  try {
    const user = (await conexion.query(
      'SELECT id_docente, id_periodo_activo FROM usuarios WHERE id = $1',
      [req.usuario.id],
    )).rows[0];
    if (!user?.id_docente || !user?.id_periodo_activo) {
      return res.status(400).json({ mensaje: 'Tu perfil docente no tiene un periodo activo asociado.' });
    }

    const result = await conexion.query(
      `SELECT n.id, n.nrc, a.codigo AS codigo_asignatura, a.nombre AS asignatura,
              a.creditos, n.nivel_pao, n.paralelo, NULL::text AS docente,
              COALESCE(json_agg(json_build_object(
                'dia_semana', h.dia_semana,
                'hora_inicio', h.hora_inicio::text,
                'hora_fin', h.hora_fin::text,
                'espacio', e.codigo
              ) ORDER BY h.dia_semana, h.hora_inicio)
              FILTER (WHERE h.id IS NOT NULL), '[]'::json) AS horarios
       FROM nrc n
       JOIN asignaturas a ON a.id = n.id_asignatura
       LEFT JOIN horarios h ON h.id_nrc = n.id
       LEFT JOIN espacios_academicos e ON e.id = h.id_espacio
       WHERE n.id_periodo = $1 AND n.id_docente IS NULL
       GROUP BY n.id, a.codigo, a.nombre, a.creditos, n.nivel_pao, n.paralelo
       ORDER BY n.nivel_pao, a.nombre`,
      [user.id_periodo_activo],
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Error al listar materias para docente:', error);
    res.status(500).json({ mensaje: 'Error al consultar materias disponibles.' });
  }
});

router.post('/docente/asignar', authentication, authorization('docente'), async (req, res) => {
  const client = await conexion.connect();
  try {
    const { id_nrc } = req.body;
    if (!id_nrc) {
      return res.status(400).json({ mensaje: 'Debes proporcionar el id_nrc.' });
    }

    await client.query('BEGIN');
    const user = (await client.query(
      'SELECT id_docente, id_periodo_activo FROM usuarios WHERE id = $1',
      [req.usuario.id],
    )).rows[0];
    if (!user?.id_docente || !user?.id_periodo_activo) {
      await client.query('ROLLBACK');
      return res.status(400).json({ mensaje: 'Tu perfil docente no tiene un periodo activo asociado.' });
    }

    const horariosNuevos = (await client.query(
      `SELECT h.dia_semana, h.hora_inicio, h.hora_fin
       FROM horarios h
       JOIN nrc n ON n.id = h.id_nrc
       WHERE n.id = $1 AND n.id_periodo = $2 AND n.id_docente IS NULL`,
      [id_nrc, user.id_periodo_activo],
    )).rows;
    const horariosActuales = (await client.query(
      `SELECT h.dia_semana, h.hora_inicio, h.hora_fin
       FROM horarios h
       JOIN nrc n ON n.id = h.id_nrc
       WHERE n.id_docente = $1 AND n.id_periodo = $2`,
      [user.id_docente, user.id_periodo_activo],
    )).rows;

    for (const nuevo of horariosNuevos) {
      for (const actual of horariosActuales) {
        if (nuevo.dia_semana === actual.dia_semana &&
            nuevo.hora_inicio < actual.hora_fin &&
            nuevo.hora_fin > actual.hora_inicio) {
          await client.query('ROLLBACK');
          return res.status(409).json({ mensaje: 'Choque de horarios con una materia que ya impartes.' });
        }
      }
    }

    const assigned = await client.query(
      `UPDATE nrc SET id_docente = $1
       WHERE id = $2 AND id_periodo = $3 AND id_docente IS NULL
       RETURNING nrc`,
      [user.id_docente, id_nrc, user.id_periodo_activo],
    );
    if (assigned.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(409).json({ mensaje: 'La materia ya fue asignada a otro docente o no está disponible.' });
    }
    await client.query('COMMIT');
    res.json({ mensaje: 'Materia asignada correctamente.', nrc: assigned.rows[0].nrc });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error al asignar materia al docente:', error);
    res.status(500).json({ mensaje: 'Error al asignar la materia.' });
  } finally {
    client.release();
  }
});

router.delete('/:id_nrc', authentication, authorization('estudiante'), async (req, res) => {
  try {
    const userId = req.usuario.id;
    const { id_nrc } = req.params;
    const user = (await conexion.query(
      'SELECT id_periodo_activo FROM usuarios WHERE id = $1', [userId],
    )).rows[0];
    if (!user?.id_periodo_activo) {
      return res.status(400).json({ mensaje: 'No tienes un periodo activo.' });
    }
    const result = await conexion.query(
      `UPDATE matriculas SET estado = 'cancelada'
       WHERE id_usuario = $1 AND id_nrc = $2 AND id_periodo = $3 AND estado = 'activa'
       RETURNING id`,
      [userId, id_nrc, user.id_periodo_activo],
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ mensaje: 'No estás matriculado en este NRC.' });
    }
    res.json({ mensaje: 'Matrícula cancelada correctamente.' });
  } catch (error) {
    console.error('Error al cancelar matrícula:', error);
    res.status(500).json({ mensaje: 'Error al cancelar matrícula.' });
  }
});

module.exports = router;
