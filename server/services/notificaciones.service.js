const webpush = require('web-push');
const conexion = require('../database/conexion');

const publicKey = process.env.VAPID_PUBLIC_KEY;
const privateKey = process.env.VAPID_PRIVATE_KEY;

if (publicKey && privateKey) {
  webpush.setVapidDetails(
    process.env.VAPID_SUBJECT || 'mailto:admin@espe.edu.ec',
    publicKey,
    privateKey,
  );
}

const enviarPush = async (userId, payload) => {
  if (!publicKey || !privateKey) return 0;

  const subscriptions = (
    await conexion.query(
      'SELECT endpoint, p256dh, auth FROM push_subscriptions WHERE id_usuario = $1',
      [userId],
    )
  ).rows;

  let sent = 0;
  for (const item of subscriptions) {
    try {
      await webpush.sendNotification(
        { endpoint: item.endpoint, keys: { p256dh: item.p256dh, auth: item.auth } },
        JSON.stringify(payload),
      );
      sent += 1;
    } catch (error) {
      if (error.statusCode === 404 || error.statusCode === 410) {
        await conexion.query('DELETE FROM push_subscriptions WHERE endpoint = $1', [item.endpoint]);
      }
    }
  }
  return sent;
};

const crearNotificacion = async ({
  id_usuario,
  titulo,
  mensaje,
  categoria = 'sistema',
  referencia_tipo = null,
  referencia_id = null,
  pushUrl = '/dashboard',
}) => {
  const result = await conexion.query(
    `INSERT INTO notificaciones (id_usuario, titulo, mensaje, categoria, referencia_tipo, referencia_id)
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING id, titulo, mensaje, categoria, leido, created_at`,
    [id_usuario, titulo, mensaje, categoria, referencia_tipo, referencia_id],
  );

  await enviarPush(id_usuario, {
    title: titulo,
    body: mensaje,
    url: pushUrl,
  });

  return result.rows[0];
};

module.exports = { crearNotificacion, enviarPush };
