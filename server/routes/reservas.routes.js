const express = require('express');
const router = express.Router();
const conexion = require('../database/conexion');
const authentication = require('../middlewares/authentication');
const authorization = require('../middlewares/authorization');

router.get('/admin', authentication, authorization('admin'), async (_req, res) => {
  try {
    const result = await conexion.query(
      `SELECT
         r.id, r.fecha, r.hora_inicio, r.hora_fin, r.motivo, r.estado, r.created_at,
         CASE
           WHEN r.estado = 'aprobada' AND (r.fecha + r.hora_fin) < CURRENT_TIMESTAMP
             THEN 'finalizada'
           ELSE r.estado
         END AS estado_visual,
         u.id AS estudiante_id, u.nombre_completo AS estudiante_nombre, u.email AS estudiante_email,
         e.id AS espacio_id, e.codigo AS espacio_codigo, e.nombre AS espacio_nombre,
         e.edificio AS espacio_edificio
       FROM reservas_espacios r
       JOIN usuarios u ON u.id = r.id_usuario
       JOIN espacios_academicos e ON e.id = r.id_espacio
       ORDER BY
         CASE WHEN r.fecha >= CURRENT_DATE THEN 0 ELSE 1 END,
         r.fecha ASC, r.hora_inicio ASC`,
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Error al consultar reservas administrativas:', error);
    res.status(500).json({ mensaje: 'No se pudieron consultar las reservas.' });
  }
});

router.patch('/:id/estado', authentication, authorization('admin'), async (req, res) => {
  const estadosPermitidos = ['aprobada', 'rechazada', 'cancelada'];
  const { estado } = req.body;
  if (!estadosPermitidos.includes(estado)) {
    return res.status(400).json({ mensaje: 'El estado solicitado no es válido.' });
  }

  try {
    const result = await conexion.query(
      `UPDATE reservas_espacios
       SET estado = $1
       WHERE id = $2
         AND NOT (fecha + hora_fin < CURRENT_TIMESTAMP)
       RETURNING id, id_usuario, id_espacio, fecha, hora_inicio, hora_fin, estado`,
      [estado, req.params.id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({
        mensaje: 'La reserva no existe o ya finalizó y no puede modificarse.',
      });
    }
    res.json({ mensaje: `Reserva ${estado} correctamente.`, reserva: result.rows[0] });
  } catch (error) {
    console.error('Error al actualizar reserva:', error);
    res.status(500).json({ mensaje: 'No se pudo actualizar la reserva.' });
  }
});

router.get('/', authentication, async (req, res) => {
  try {
    const result = await conexion.query(
      `SELECT r.*, e.nombre AS espacio_nombre, e.codigo AS espacio_codigo
       FROM reservas_espacios r
       JOIN espacios_academicos e ON e.id = r.id_espacio
       WHERE r.id_usuario = $1
       ORDER BY r.fecha DESC, r.hora_inicio`,
      [req.usuario.id]
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Error al consultar reservas:', error);
    res.status(500).json({ mensaje: 'No se pudieron consultar las reservas.' });
  }
});

router.post('/', authentication, async (req, res) => {
  const { espacioId, fecha, horaInicio, horaFin, motivo } = req.body;
  if (!espacioId || !fecha || !horaInicio || !horaFin) {
    return res.status(400).json({ mensaje: 'Espacio, fecha y horario son obligatorios.' });
  }

  const client = await conexion.connect();
  try {
    await client.query('BEGIN');

    const input = await client.query(
      `SELECT $1::date AS fecha, $2::time AS hora_inicio,
              $3::time AS hora_fin, CURRENT_DATE AS hoy`,
      [fecha, horaInicio, horaFin]
    );
    const range = input.rows[0];

    if (range.fecha < range.hoy) {
      await client.query('ROLLBACK');
      return res.status(400).json({ mensaje: 'No puedes reservar una fecha pasada.' });
    }
    if (range.hora_inicio >= range.hora_fin) {
      await client.query('ROLLBACK');
      return res.status(400).json({
        mensaje: 'La hora de finalización debe ser posterior a la hora de inicio.',
      });
    }

    // Evita que dos peticiones simultáneas reserven el mismo espacio y fecha.
    await client.query(
      'SELECT pg_advisory_xact_lock($1::integer, hashtext($2::text))',
      [espacioId, fecha]
    );

    const espacioResult = await client.query(
      'SELECT id, estado FROM espacios_academicos WHERE id = $1 FOR SHARE',
      [espacioId]
    );
    if (espacioResult.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ mensaje: 'El espacio académico no existe.' });
    }
    if (['mantenimiento', 'cerrado'].includes(espacioResult.rows[0].estado)) {
      await client.query('ROLLBACK');
      return res.status(409).json({ mensaje: 'El espacio no está disponible para reservas.' });
    }

    const reservaConflictiva = await client.query(
      `SELECT id
       FROM reservas_espacios
       WHERE id_espacio = $1
         AND fecha = $2::date
         AND estado IN ('pendiente', 'aprobada')
         AND hora_inicio < $4::time
         AND hora_fin > $3::time
       LIMIT 1`,
      [espacioId, fecha, horaInicio, horaFin]
    );
    if (reservaConflictiva.rows.length > 0) {
      await client.query('ROLLBACK');
      return res.status(409).json({
        mensaje: 'Ese espacio ya está reservado total o parcialmente en el horario seleccionado.',
      });
    }

    const claseConflictiva = await client.query(
      `SELECT id
       FROM horarios
       WHERE id_espacio = $1
         AND dia_semana = EXTRACT(ISODOW FROM $2::date)
         AND hora_inicio < $4::time
         AND hora_fin > $3::time
       LIMIT 1`,
      [espacioId, fecha, horaInicio, horaFin]
    );
    if (claseConflictiva.rows.length > 0) {
      await client.query('ROLLBACK');
      return res.status(409).json({
        mensaje: 'El espacio tiene una clase programada durante ese horario.',
      });
    }

    const bloqueoManual = await client.query(
      `SELECT id
       FROM disponibilidad_espacios
       WHERE id_espacio = $1
         AND disponible = false
         AND (fecha = $2::date OR (fecha IS NULL AND dia_semana = EXTRACT(ISODOW FROM $2::date)))
         AND hora_inicio < $4::time
         AND hora_fin > $3::time
       LIMIT 1`,
      [espacioId, fecha, horaInicio, horaFin]
    );
    if (bloqueoManual.rows.length > 0) {
      await client.query('ROLLBACK');
      return res.status(409).json({
        mensaje: 'El espacio fue bloqueado por administración durante ese horario.',
      });
    }

    const result = await client.query(
      `INSERT INTO reservas_espacios
       (id_espacio, id_usuario, fecha, hora_inicio, hora_fin, motivo)
       VALUES ($1,$2,$3,$4,$5,$6) RETURNING *`,
      [espacioId, req.usuario.id, fecha, horaInicio, horaFin, motivo || null]
    );
    await client.query('COMMIT');
    res.status(201).json({ mensaje: 'Reserva registrada correctamente.', reserva: result.rows[0] });
  } catch (error) {
    await client.query('ROLLBACK');
    if (error.code === '22007' || error.code === '22008') {
      return res.status(400).json({ mensaje: 'La fecha o el horario tienen un formato inválido.' });
    }
    if (error.code === '23505') {
      return res.status(409).json({ mensaje: 'Ese espacio ya está reservado en el horario seleccionado.' });
    }
    console.error('Error al registrar reserva:', error);
    res.status(500).json({ mensaje: 'No se pudo registrar la reserva.' });
  } finally {
    client.release();
  }
});

module.exports = router;
