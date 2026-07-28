const express = require('express');
const router = express.Router();
const conexion = require('../database/conexion');
const authentication = require('../middlewares/authentication');

router.get('/', authentication, async (req, res) => {
  try {
    const r = await conexion.query(
      `SELECT id, titulo, mensaje, categoria, leido, referencia_tipo, referencia_id, created_at
       FROM notificaciones
       WHERE id_usuario = $1
       ORDER BY created_at DESC
       LIMIT 50`,
      [req.usuario.id]
    );
    res.json(r.rows);
  } catch (error) {
    console.error('Error al consultar notificaciones:', error);
    res.status(500).json({ mensaje: 'No se pudieron consultar las notificaciones.' });
  }
});

router.patch('/:id/leido', authentication, async (req, res) => {
  try {
    await conexion.query(
      `UPDATE notificaciones SET leido = true WHERE id = $1 AND id_usuario = $2`,
      [req.params.id, req.usuario.id]
    );
    res.json({ mensaje: 'Notificación marcada como leída.' });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al actualizar la notificación.' });
  }
});

router.patch('/leer-todas', authentication, async (req, res) => {
  try {
    await conexion.query(
      `UPDATE notificaciones SET leido = true WHERE id_usuario = $1 AND leido = false`,
      [req.usuario.id]
    );
    res.json({ mensaje: 'Todas las notificaciones marcadas como leídas.' });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al actualizar notificaciones.' });
  }
});

module.exports = router;