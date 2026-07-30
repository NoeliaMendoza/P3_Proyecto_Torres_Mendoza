const fs = require('fs');
const path = require('path');
const conexion = require('./conexion');
const seedDemoUsers = require('./seed-demo-users');

const ensureConstraint = async (table, name, definition) => {
  const exists = await conexion.query(
    'SELECT 1 FROM pg_constraint WHERE conname = $1',
    [name],
  );
  if (!exists.rows.length) {
    await conexion.query(`ALTER TABLE ${table} ADD CONSTRAINT ${name} ${definition}`);
  }
};

const ensureSerialDefault = async (table) => {
  const sequence = `${table}_id_seq`;
  await conexion.query(`
    CREATE SEQUENCE IF NOT EXISTS ${sequence};
    ALTER SEQUENCE ${sequence} OWNED BY ${table}.id;
    ALTER TABLE ${table}
      ALTER COLUMN id SET DEFAULT nextval('${sequence}');
    SELECT setval(
      '${sequence}',
      GREATEST(COALESCE((SELECT MAX(id) FROM ${table}), 0) + 1, 1),
      false
    );
  `);
};

const repairBaseConstraints = async () => {
  const constraints = [
    ['periodos_academicos', 'periodos_academicos_pkey', 'PRIMARY KEY (id)'],
    ['periodos_academicos', 'periodos_academicos_codigo_key', 'UNIQUE (codigo)'],
    ['carreras', 'carreras_pkey', 'PRIMARY KEY (id)'],
    ['carreras', 'carreras_codigo_key', 'UNIQUE (codigo)'],
    ['docentes', 'docentes_pkey', 'PRIMARY KEY (id)'],
    ['docentes', 'docentes_nombre_completo_key', 'UNIQUE (nombre_completo)'],
    ['asignaturas', 'asignaturas_pkey', 'PRIMARY KEY (id)'],
    ['asignaturas', 'asignaturas_codigo_key', 'UNIQUE (codigo)'],
    ['nrc', 'nrc_pkey', 'PRIMARY KEY (id)'],
    ['tipos_espacio', 'tipos_espacio_pkey', 'PRIMARY KEY (id)'],
    ['tipos_espacio', 'tipos_espacio_nombre_key', 'UNIQUE (nombre)'],
    ['espacios_academicos', 'espacios_academicos_pkey', 'PRIMARY KEY (id)'],
    ['espacios_academicos', 'espacios_academicos_codigo_key', 'UNIQUE (codigo)'],
    ['horarios', 'horarios_pkey', 'PRIMARY KEY (id)'],
    ['disponibilidad_espacios', 'disponibilidad_espacios_pkey', 'PRIMARY KEY (id)'],
    ['categorias_objetos', 'categorias_objetos_pkey', 'PRIMARY KEY (id)'],
    ['categorias_objetos', 'categorias_objetos_nombre_key', 'UNIQUE (nombre)'],
    ['objetos_perdidos', 'objetos_perdidos_pkey', 'PRIMARY KEY (id)'],
  ];

  for (const [table, name, definition] of constraints) {
    await ensureConstraint(table, name, definition);
  }

  await ensureSerialDefault('categorias_objetos');
  await ensureSerialDefault('objetos_perdidos');
};

const migrate = async () => {
  const schemaExists = await conexion.query(
    `SELECT to_regclass('public.usuarios') AS table_name`,
  );

  if (!schemaExists.rows[0].table_name) {
    const localSchemaPath = path.join(__dirname, '../../database/schema.sql');
    const containerSchemaPath = path.join(__dirname, 'schema.sql');
    const schemaPath = fs.existsSync(localSchemaPath)
      ? localSchemaPath
      : containerSchemaPath;

    if (!fs.existsSync(schemaPath)) {
      throw new Error('La base está vacía y no se encontró database/schema.sql.');
    }

    console.log('Base de datos vacía: creando esquema inicial...');
    await conexion.query(fs.readFileSync(schemaPath, 'utf8'));
  }

  await repairBaseConstraints();

  await conexion.query(`
    ALTER TABLE usuarios ADD COLUMN IF NOT EXISTS email_verified_at TIMESTAMP;
    UPDATE usuarios SET email_verified_at = COALESCE(email_verified_at, created_at, NOW());
    CREATE TABLE IF NOT EXISTS auth_tokens (
      id BIGSERIAL PRIMARY KEY,
      user_id UUID NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
      purpose VARCHAR(32) NOT NULL
        CHECK (purpose IN ('email_verification', 'password_reset')),
      token_hash CHAR(64) NOT NULL UNIQUE,
      expires_at TIMESTAMP NOT NULL,
      used_at TIMESTAMP,
      created_at TIMESTAMP NOT NULL DEFAULT NOW()
    );
    CREATE INDEX IF NOT EXISTS idx_auth_tokens_lookup
      ON auth_tokens(token_hash, purpose, expires_at)
      WHERE used_at IS NULL;
    CREATE INDEX IF NOT EXISTS idx_auth_tokens_user
      ON auth_tokens(user_id, purpose);
    CREATE TABLE IF NOT EXISTS reservas_espacios (
      id BIGSERIAL PRIMARY KEY,
      id_espacio INTEGER NOT NULL REFERENCES espacios_academicos(id) ON DELETE CASCADE,
      id_usuario UUID NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
      fecha DATE NOT NULL,
      hora_inicio TIME NOT NULL,
      hora_fin TIME NOT NULL,
      motivo VARCHAR(255),
      estado VARCHAR(20) NOT NULL DEFAULT 'pendiente'
        CHECK (estado IN ('pendiente', 'aprobada', 'rechazada', 'cancelada')),
      created_at TIMESTAMP DEFAULT NOW(),
      UNIQUE(id_espacio, fecha, hora_inicio, hora_fin)
    );
    CREATE TABLE IF NOT EXISTS push_subscriptions (
      id BIGSERIAL PRIMARY KEY,
      id_usuario UUID NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
      endpoint TEXT NOT NULL UNIQUE,
      p256dh TEXT NOT NULL,
      auth TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()
    );
    CREATE INDEX IF NOT EXISTS idx_reservas_usuario ON reservas_espacios(id_usuario);
    ALTER TABLE reservas_espacios
      DROP CONSTRAINT IF EXISTS reservas_espacios_id_espacio_fecha_hora_inicio_hora_fin_key;
    CREATE UNIQUE INDEX IF NOT EXISTS uq_reserva_activa_exacta
      ON reservas_espacios(id_espacio, fecha, hora_inicio, hora_fin)
      WHERE estado IN ('pendiente', 'aprobada');
    CREATE INDEX IF NOT EXISTS idx_push_usuario ON push_subscriptions(id_usuario);
  `);

  const localMigrationsDir = path.join(__dirname, '../../database/migrations');
  const containerMigrationsDir = path.join(__dirname, 'migrations');
  const migrationsDir = fs.existsSync(localMigrationsDir)
    ? localMigrationsDir
    : containerMigrationsDir;

  if (fs.existsSync(migrationsDir)) {
    const files = fs.readdirSync(migrationsDir)
      .filter(f => f.endsWith('.sql'))
      .sort();
    for (const file of files) {
      const filePath = path.join(migrationsDir, file);
      console.log(`Ejecutando migración: ${file}`);
      await conexion.query(fs.readFileSync(filePath, 'utf8'));
    }
  }

  await seedDemoUsers();
};

module.exports = migrate;
