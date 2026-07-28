const bcrypt = require('bcrypt');
const conexion = require('./conexion');

const DEMO_USERS = [
  {
    email: 'ceandrade@espe.edu.ec',
    password: 'espe2026',
    nombre: 'Carlos Eduardo Andrade Paredes',
    rol: 'estudiante',
    codigo_estudiante: 'L00394857',
    nivel_pao: 3,
    nrcs: ['31379', '29533', '29528', '29531', '29523', '29532'],
  },
  {
    email: 'admin@espe.edu.ec',
    password: 'admin2026',
    nombre: 'Administrador ESPEConnect',
    rol: 'admin',
  },
  {
    email: 'ppuente@espe.edu.ec',
    password: 'docente2026',
    nombre: 'Pablo Francisco Puente Ponce',
    rol: 'docente',
    docente: 'PUENTE PONCE PABLO FRANCISCO',
  },
  {
    email: 'kjchuquitarko@espe.edu.ec',
    password: 'docente2026',
    nombre: 'Kevin Jair Chuquitarko',
    rol: 'docente',
    docente: 'CHUQUITARCO KEVIN JAIR',
  },
];

const seedDemoUsers = async () => {
  if (process.env.SEED_DEMO_USERS !== 'true') return;

  const carrera = await conexion.query(
    "SELECT id FROM carreras WHERE codigo = 'TECINFO' LIMIT 1",
  );
  const periodo = await conexion.query(
    'SELECT id FROM periodos_academicos WHERE codigo = $1 LIMIT 1',
    ['202650'],
  );

  if (carrera.rows.length === 0 || periodo.rows.length === 0) {
    console.warn('Seed demo: ejecuta seed_horarios.sql antes de crear usuarios demo.');
    return;
  }

  const carreraId = carrera.rows[0].id;
  const periodoId = periodo.rows[0].id;

  for (const demo of DEMO_USERS) {
    const hash = await bcrypt.hash(demo.password, 10);
    let docenteId = null;

    if (demo.docente) {
      const doc = await conexion.query(
        'SELECT id FROM docentes WHERE nombre_completo = $1 LIMIT 1',
        [demo.docente],
      );
      docenteId = doc.rows[0]?.id ?? null;
      if (docenteId) {
        await conexion.query(
          'UPDATE docentes SET email_institucional = $1 WHERE id = $2',
          [demo.email, docenteId],
        );
      }
    }

    const userResult = await conexion.query(
      `INSERT INTO usuarios (
         email, password_hash, nombre_completo, rol,
         codigo_estudiante, id_carrera, nivel_pao, id_docente, id_periodo_activo
       ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
       ON CONFLICT (email) DO UPDATE SET
         password_hash = EXCLUDED.password_hash,
         nombre_completo = EXCLUDED.nombre_completo,
         rol = EXCLUDED.rol,
         codigo_estudiante = COALESCE(EXCLUDED.codigo_estudiante, usuarios.codigo_estudiante),
         id_carrera = COALESCE(EXCLUDED.id_carrera, usuarios.id_carrera),
         nivel_pao = COALESCE(EXCLUDED.nivel_pao, usuarios.nivel_pao),
         id_docente = COALESCE(EXCLUDED.id_docente, usuarios.id_docente),
         id_periodo_activo = COALESCE(EXCLUDED.id_periodo_activo, usuarios.id_periodo_activo)
       RETURNING id`,
      [
        demo.email,
        hash,
        demo.nombre,
        demo.rol,
        demo.codigo_estudiante || null,
        demo.rol === 'admin' ? null : carreraId,
        demo.nivel_pao || null,
        docenteId,
        demo.rol === 'admin' ? null : periodoId,
      ],
    );

    const userId = userResult.rows[0].id;

    if (demo.nrcs?.length) {
      for (const nrcCode of demo.nrcs) {
        const nrc = await conexion.query(
          'SELECT id FROM nrc WHERE nrc = $1 AND id_periodo = $2 LIMIT 1',
          [nrcCode, periodoId],
        );
        if (nrc.rows.length === 0) continue;

        await conexion.query(
          `INSERT INTO matriculas (id_usuario, id_nrc, id_periodo, estado)
           VALUES ($1, $2, $3, 'activa')
           ON CONFLICT (id_usuario, id_nrc, id_periodo) DO NOTHING`,
          [userId, nrc.rows[0].id, periodoId],
        );
      }
    }
  }

  console.log('Usuarios de demostración preparados.');
};

module.exports = seedDemoUsers;
