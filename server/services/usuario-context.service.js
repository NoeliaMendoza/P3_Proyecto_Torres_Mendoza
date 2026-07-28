const conexion = require('../database/conexion');

const mapUsuarioBase = (row) => ({
  id: row.id,
  nombre: row.nombre_completo,
  correo: row.email,
  rol: row.rol,
  telefono: row.telefono,
  avatar: row.avatar_url,
  codigo_estudiante: row.codigo_estudiante,
  nivel_pao: row.nivel_pao,
  carrera: row.carrera_id
    ? { id: row.carrera_id, codigo: row.carrera_codigo, nombre: row.carrera_nombre }
    : null,
  campus: row.sede_nombre || null,
  sede: row.sede_codigo
    ? { codigo: row.sede_codigo, nombre: row.sede_nombre }
    : null,
  periodo: row.periodo_id
    ? {
        id: row.periodo_id,
        codigo: row.periodo_codigo,
        nombre: row.periodo_nombre,
        fecha_inicio: row.periodo_inicio,
        fecha_fin: row.periodo_fin,
      }
    : null,
});

const getUsuarioProfile = async (userId) => {
  const result = await conexion.query(
    `SELECT u.id, u.email, u.nombre_completo, u.rol, u.telefono, u.avatar_url,
            u.codigo_estudiante, u.nivel_pao, u.id_docente,
            c.id AS carrera_id, c.codigo AS carrera_codigo, c.nombre AS carrera_nombre,
            s.codigo AS sede_codigo, s.nombre AS sede_nombre,
            p.id AS periodo_id, p.codigo AS periodo_codigo, p.nombre AS periodo_nombre,
            p.fecha_inicio AS periodo_inicio, p.fecha_fin AS periodo_fin
     FROM usuarios u
     LEFT JOIN carreras c ON c.id = u.id_carrera
     LEFT JOIN sedes s ON s.id = c.id_sede
     LEFT JOIN periodos_academicos p ON p.id = u.id_periodo_activo
     WHERE u.id = $1`,
    [userId],
  );
  if (result.rows.length === 0) return null;
  return mapUsuarioBase(result.rows[0]);
};

const getMatriculasActivas = async (userId, periodoId) => {
  const result = await conexion.query(
    `SELECT n.nrc, a.codigo AS codigo_asignatura, a.nombre AS asignatura, a.creditos,
            n.nivel_pao, n.paralelo, d.nombre_completo AS docente
     FROM matriculas m
     JOIN nrc n ON n.id = m.id_nrc
     JOIN asignaturas a ON a.id = n.id_asignatura
     LEFT JOIN docentes d ON d.id = n.id_docente
     WHERE m.id_usuario = $1
       AND m.id_periodo = $2
       AND m.estado = 'activa'
     ORDER BY n.nivel_pao, a.nombre`,
    [userId, periodoId],
  );
  return result.rows;
};

const getHorarioEstudiante = async (userId, periodoId) => {
  const result = await conexion.query(
    `SELECT v.*
     FROM matriculas m
     JOIN horarios h ON h.id_nrc = m.id_nrc
     JOIN vista_horarios_completa v ON v.id = h.id
     WHERE m.id_usuario = $1
       AND m.id_periodo = $2
       AND m.estado = 'activa'
     ORDER BY v.dia_semana, v.hora_inicio`,
    [userId, periodoId],
  );
  return result.rows;
};

const getHorarioDocente = async (docenteId, periodoId) => {
  const result = await conexion.query(
    `SELECT v.*
     FROM vista_horarios_completa v
     JOIN nrc n ON n.nrc = v.nrc AND n.id_periodo = v.periodo_id
     WHERE n.id_docente = $1
       AND v.periodo_id = $2
     ORDER BY v.dia_semana, v.hora_inicio`,
    [docenteId, periodoId],
  );
  return result.rows;
};

const getUsuarioContext = async (userId) => {
  const profile = await getUsuarioProfile(userId);
  if (!profile) return null;

  const row = (
    await conexion.query(
      'SELECT id_docente, id_periodo_activo FROM usuarios WHERE id = $1',
      [userId],
    )
  ).rows[0];

  const periodoId = row?.id_periodo_activo;
  let asignaturas_matriculadas = [];
  let horario_personal = [];

  if (profile.rol === 'estudiante' && periodoId) {
    asignaturas_matriculadas = await getMatriculasActivas(userId, periodoId);
    horario_personal = await getHorarioEstudiante(userId, periodoId);
  } else if (profile.rol === 'docente' && row?.id_docente && periodoId) {
    horario_personal = await getHorarioDocente(row.id_docente, periodoId);
    asignaturas_matriculadas = horario_personal.reduce((acc, item) => {
      if (!acc.some((a) => a.nrc === item.nrc)) {
        acc.push({
          nrc: item.nrc,
          codigo_asignatura: item.codigo_asignatura,
          asignatura: item.asignatura,
          creditos: item.creditos,
          nivel_pao: item.nivel_pao,
          paralelo: item.paralelo,
          docente: item.docente,
        });
      }
      return acc;
    }, []);
  }

  return {
    usuario: profile,
    semestre: profile.nivel_pao ? `PAO ${profile.nivel_pao}` : null,
    asignaturas_matriculadas,
    horario_personal,
  };
};

module.exports = {
  getUsuarioProfile,
  getUsuarioContext,
  getHorarioEstudiante,
  getHorarioDocente,
};
