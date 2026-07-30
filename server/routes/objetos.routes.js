const express = require('express');
const router = express.Router();
const conexion = require('../database/conexion');
const authentication = require('../middlewares/authentication');
const authorization = require('../middlewares/authorization');

router.get('/', authentication, async (req, res) => {
  try {
    const { tipo, estado, categoria, search } = req.query;
    let query = `SELECT o.*, c.nombre AS categoria_nombre, c.icono AS categoria_icono,
                        u.nombre_completo AS reportante_nombre
                 FROM objetos_perdidos o
                 LEFT JOIN categorias_objetos c ON o.id_categoria = c.id
                 LEFT JOIN usuarios u ON o.id_reportante = u.id WHERE 1=1`;
    const params = []; let i = 1;
    if (tipo) { query += ` AND o.tipo = $${i++}`; params.push(tipo); }
    if (estado) { query += ` AND o.estado = $${i++}`; params.push(estado); }
    if (categoria) { query += ` AND o.id_categoria = $${i++}`; params.push(parseInt(categoria)); }
    if (search) { query += ` AND (o.titulo ILIKE $${i} OR o.descripcion ILIKE $${i})`; params.push(`%${search}%`); i++; }
    query += ' ORDER BY o.created_at DESC';
    res.json((await conexion.query(query, params)).rows);
  } catch (error) {
    console.error('[objetos:listar]', error);
    res.status(500).json({ mensaje: 'No se pudieron consultar los objetos.' });
  }
});

router.get('/categorias', authentication, async (req, res) => {
  try { res.json((await conexion.query('SELECT * FROM categorias_objetos ORDER BY nombre')).rows); }
  catch (error) { res.status(500).json({ mensaje: 'Error interno del servidor.' }); }
});

router.post('/', authentication, async (req, res) => {
  try {
    const { titulo, descripcion, id_categoria, tipo, ubicacion, fecha_evento, informacion_contacto, imagen } = req.body;
    if (!titulo || !descripcion || !tipo)
      return res.status(400).json({ mensaje: 'Título, descripción y tipo son requeridos.' });
    let categoriaId = id_categoria || null;
    if (req.body.categoria) {
      const categoriaResult = await conexion.query(
        'SELECT id FROM categorias_objetos WHERE nombre = $1 LIMIT 1',
        [req.body.categoria],
      );
      categoriaId = categoriaResult.rows[0]?.id || null;
    }
    if (!categoriaId) {
      return res.status(400).json({ mensaje: 'Selecciona una categoría válida.' });
    }

    const r = await conexion.query(
      `INSERT INTO objetos_perdidos (titulo, descripcion, id_categoria, tipo, ubicacion, fecha_evento, id_reportante, informacion_contacto, imagenes_url)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING *`,
      [titulo, descripcion, categoriaId, tipo, ubicacion||null, fecha_evento||null, req.usuario.id, informacion_contacto||null, imagen ? [imagen] : null]
    );
    res.status(201).json({ mensaje: 'Reporte creado correctamente.', objeto: r.rows[0] });
  } catch (error) {
    console.error('[objetos:crear]', error);
    res.status(500).json({ mensaje: 'No se pudo publicar el objeto.' });
  }
});

router.put('/:id', authentication, async (req, res) => {
  try {
    const r = await conexion.query(
      `UPDATE objetos_perdidos SET titulo=COALESCE($1,titulo), descripcion=COALESCE($2,descripcion),
       id_categoria=COALESCE($3,id_categoria), estado=COALESCE($4,estado),
       imagenes_url=COALESCE($5,imagenes_url), updated_at=NOW()
       WHERE id=$6 AND id_reportante=$7 RETURNING *`,
      [req.body.titulo, req.body.descripcion, req.body.id_categoria, req.body.estado, req.body.imagen ? [req.body.imagen] : null, req.params.id, req.usuario.id]
    );
    if (r.rows.length === 0) return res.status(404).json({ mensaje: 'Objeto no encontrado o no autorizado.' });
    res.json({ mensaje: 'Reporte actualizado.', objeto: r.rows[0] });
  } catch (error) { res.status(500).json({ mensaje: 'Error interno del servidor.' }); }
});

router.delete('/:id', authentication, async (req, res) => {
  try {
    const r = await conexion.query('DELETE FROM objetos_perdidos WHERE id=$1 AND id_reportante=$2 RETURNING id', [req.params.id, req.usuario.id]);
    if (r.rows.length === 0) return res.status(404).json({ mensaje: 'Objeto no encontrado o no autorizado.' });
    res.json({ mensaje: 'Reporte eliminado correctamente.' });
  } catch (error) { res.status(500).json({ mensaje: 'Error interno del servidor.' }); }
});

router.patch('/:id/marcar-encontrado', authentication, async (req, res) => {
  try {
    const r = await conexion.query(
      `UPDATE objetos_perdidos SET estado='resuelto', updated_at=NOW()
       WHERE id=$1 AND id_reportante=$2 AND estado='abierto' RETURNING *`,
      [req.params.id, req.usuario.id]
    );
    if (r.rows.length === 0) return res.status(400).json({ mensaje: 'No se puede marcar como encontrado.' });
    res.json({ mensaje: 'Objeto marcado como encontrado.', objeto: r.rows[0] });
  } catch (error) { res.status(500).json({ mensaje: 'Error interno del servidor.' }); }
});

router.post('/:id/reclamar', authentication, async (req, res) => {
  try {
    const r = await conexion.query(
      `UPDATE objetos_perdidos SET es_reclamado=true, id_reclamante=$1, estado='resuelto', fecha_reclamo=NOW(), updated_at=NOW()
       WHERE id=$2 AND tipo='encontrado' AND es_reclamado=false RETURNING *`, [req.usuario.id, req.params.id]
    );
    if (r.rows.length === 0) return res.status(400).json({ mensaje: 'No se puede reclamar este objeto.' });
    res.json({ mensaje: 'Objeto reclamado correctamente.', objeto: r.rows[0] });
  } catch (error) { res.status(500).json({ mensaje: 'Error interno del servidor.' }); }
});

router.delete('/:id/moderar', authentication, authorization('admin'), async (req, res) => {
  try {
    const r = await conexion.query('DELETE FROM objetos_perdidos WHERE id=$1 RETURNING id', [req.params.id]);
    if (r.rows.length === 0) return res.status(404).json({ mensaje: 'Reporte no encontrado.' });
    res.json({ mensaje: 'Reporte eliminado por administrador.' });
  } catch (error) { res.status(500).json({ mensaje: 'Error interno del servidor.' }); }
});

module.exports = router;
