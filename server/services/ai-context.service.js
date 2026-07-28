const conexion = require('../database/conexion');

const getAssistantContext = async (user) => {
  const [reservations, spaces, schedules, lostObjects] = await Promise.all([
    conexion.query(
      `SELECT e.nombre AS espacio, r.fecha, r.hora_inicio, r.hora_fin, r.estado, r.motivo
       FROM reservas_espacios r
       JOIN espacios_academicos e ON e.id = r.id_espacio
       WHERE r.id_usuario = $1
         AND r.fecha >= CURRENT_DATE
       ORDER BY r.fecha, r.hora_inicio
       LIMIT 10`,
      [user.id]
    ),
    conexion.query(
      `SELECT codigo, nombre, edificio, capacidad, estado, tiene_proyector, tiene_computadoras
       FROM espacios_academicos
       ORDER BY nombre
       LIMIT 25`
    ),
    conexion.query(
      `SELECT asignatura, docente, nombre_espacio AS espacio, dia, hora_inicio, hora_fin
       FROM vista_horarios_completa
       ORDER BY dia_semana, hora_inicio
       LIMIT 30`
    ),
    conexion.query(
      `SELECT titulo, tipo, estado, ubicacion, fecha_evento
       FROM objetos_perdidos
       WHERE estado = 'abierto'
       ORDER BY created_at DESC
       LIMIT 15`
    ),
  ]);

  return {
    usuario: { nombre: user.nombre, rol: user.rol },
    fecha_actual: new Date().toISOString().slice(0, 10),
    mis_reservas_proximas: reservations.rows,
    espacios: spaces.rows,
    horarios_institucionales: schedules.rows,
    objetos_abiertos: lostObjects.rows,
  };
};

module.exports = getAssistantContext;
