const path = require('path');
const dotenv = require('dotenv');

dotenv.config({ path: path.resolve(__dirname, '../../.env'), quiet: true });
dotenv.config({ path: path.resolve(__dirname, '../.env'), override: true, quiet: true });

const conexion = require('../database/conexion');

const run = async () => {
  const tables = await conexion.query(`
    SELECT table_name
    FROM information_schema.tables
    WHERE table_schema = 'public' AND table_type = 'BASE TABLE'
    ORDER BY table_name
  `);
  const constraints = await conexion.query(`
    SELECT tc.table_name, tc.constraint_name, tc.constraint_type,
           string_agg(kcu.column_name, ', ' ORDER BY kcu.ordinal_position) AS columns
    FROM information_schema.table_constraints tc
    LEFT JOIN information_schema.key_column_usage kcu
      ON tc.constraint_schema = kcu.constraint_schema
     AND tc.constraint_name = kcu.constraint_name
    WHERE tc.table_schema = 'public'
      AND tc.constraint_type IN ('PRIMARY KEY', 'UNIQUE')
    GROUP BY tc.table_name, tc.constraint_name, tc.constraint_type
    ORDER BY tc.table_name, tc.constraint_type
  `);
  console.log('Tablas:', tables.rows.map((row) => row.table_name).join(', '));
  console.log('Restricciones primarias/únicas:', constraints.rows);

  if (tables.rows.some((row) => row.table_name === 'auth_tokens')) {
    const authState = await conexion.query(`
      SELECT
        (SELECT COUNT(*)::int FROM usuarios) AS users,
        (SELECT COUNT(*)::int FROM usuarios WHERE email_verified_at IS NULL) AS unverified_users,
        COUNT(*) FILTER (WHERE purpose = 'email_verification')::int AS verification_tokens,
        COUNT(*) FILTER (WHERE purpose = 'password_reset')::int AS reset_tokens,
        COUNT(*) FILTER (WHERE used_at IS NULL AND expires_at > NOW())::int AS active_tokens,
        MAX(created_at) AS latest_token_at
      FROM auth_tokens
    `);
    console.log('Estado de autenticación por correo:', authState.rows[0]);
  }
};

run()
  .catch((error) => {
    console.error(error.message);
    process.exitCode = 1;
  })
  .finally(() => conexion.end());
