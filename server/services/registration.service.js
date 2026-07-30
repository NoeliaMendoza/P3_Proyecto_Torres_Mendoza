const bcrypt = require('bcrypt');
const conexion = require('../database/conexion');
const { PURPOSES, createToken } = require('./auth-token.service');

const registerPendingUser = async ({ nombre, correo, password }) => {
  const client = await conexion.connect();

  try {
    await client.query('BEGIN');
    const existing = await client.query(
      'SELECT id, email_verified_at FROM usuarios WHERE email = $1 FOR UPDATE',
      [correo],
    );

    if (existing.rows[0]?.email_verified_at) {
      const error = new Error('El correo ya se encuentra registrado.');
      error.code = 'EMAIL_ALREADY_REGISTERED';
      throw error;
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = existing.rows.length
      ? await client.query(
        `UPDATE usuarios
         SET password_hash = $1,
             nombre_completo = $2,
             id_periodo_activo = COALESCE(
               id_periodo_activo,
               (SELECT id FROM periodos_academicos WHERE activo = true LIMIT 1)
             ),
             updated_at = NOW()
         WHERE id = $3
         RETURNING id`,
        [passwordHash, nombre, existing.rows[0].id],
      )
      : await client.query(
        `INSERT INTO usuarios (
           email, password_hash, nombre_completo, rol, id_periodo_activo
         )
         VALUES (
           $1, $2, $3, 'estudiante',
           (SELECT id FROM periodos_academicos WHERE activo = true LIMIT 1)
         )
         RETURNING id`,
        [correo, passwordHash, nombre],
      );

    const verificationToken = await createToken(
      user.rows[0].id,
      PURPOSES.EMAIL_VERIFICATION,
      24 * 60,
      client,
    );

    await client.query('COMMIT');
    return { verificationToken };
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
};

module.exports = { registerPendingUser };
