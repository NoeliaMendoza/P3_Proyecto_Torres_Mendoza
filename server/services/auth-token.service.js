const crypto = require('crypto');
const conexion = require('../database/conexion');

const PURPOSES = {
  EMAIL_VERIFICATION: 'email_verification',
  PASSWORD_RESET: 'password_reset',
};

const hashToken = (token) =>
  crypto.createHash('sha256').update(token, 'utf8').digest('hex');

const createToken = async (userId, purpose, ttlMinutes, db = conexion) => {
  const token = crypto.randomBytes(32).toString('base64url');
  const tokenHash = hashToken(token);

  await db.query(
    `UPDATE auth_tokens
     SET used_at = NOW()
     WHERE user_id = $1 AND purpose = $2 AND used_at IS NULL`,
    [userId, purpose],
  );
  await db.query(
    `INSERT INTO auth_tokens (user_id, purpose, token_hash, expires_at)
     VALUES ($1, $2, $3, NOW() + ($4 * INTERVAL '1 minute'))`,
    [userId, purpose, tokenHash, ttlMinutes],
  );

  return token;
};

const consumeToken = async (token, purpose) => {
  if (typeof token !== 'string' || token.length < 32) return null;

  const result = await conexion.query(
    `UPDATE auth_tokens
     SET used_at = NOW()
     WHERE token_hash = $1
       AND purpose = $2
       AND used_at IS NULL
       AND expires_at > NOW()
     RETURNING user_id`,
    [hashToken(token), purpose],
  );

  return result.rows[0]?.user_id || null;
};

const findVerifiedTokenUser = async (token, purpose) => {
  if (typeof token !== 'string' || token.length < 32) return null;

  const result = await conexion.query(
    `SELECT t.user_id
     FROM auth_tokens t
     JOIN usuarios u ON u.id = t.user_id
     WHERE t.token_hash = $1
       AND t.purpose = $2
       AND u.email_verified_at IS NOT NULL`,
    [hashToken(token), purpose],
  );
  return result.rows[0]?.user_id || null;
};

module.exports = { PURPOSES, createToken, consumeToken, findVerifiedTokenUser };
