const express = require('express');
const webpush = require('web-push');
const conexion = require('../database/conexion');
const authentication = require('../middlewares/authentication');

const router = express.Router();
const publicKey = process.env.VAPID_PUBLIC_KEY;
const privateKey = process.env.VAPID_PRIVATE_KEY;

if (publicKey && privateKey) {
  webpush.setVapidDetails(
    process.env.VAPID_SUBJECT || 'mailto:admin@espe.edu.ec',
    publicKey,
    privateKey
  );
}

router.get('/public-key', authentication, (_req, res) => {
  if (!publicKey) return res.status(503).json({ mensaje: 'Las notificaciones push no están configuradas.' });
  res.json({ publicKey });
});

router.post('/subscribe', authentication, async (req, res) => {
  const { endpoint, keys } = req.body;
  if (!endpoint || !keys?.p256dh || !keys?.auth) {
    return res.status(400).json({ mensaje: 'Suscripción push inválida.' });
  }
  try {
    await conexion.query(
      `INSERT INTO push_subscriptions (id_usuario, endpoint, p256dh, auth)
       VALUES ($1,$2,$3,$4)
       ON CONFLICT (endpoint) DO UPDATE
       SET id_usuario=EXCLUDED.id_usuario, p256dh=EXCLUDED.p256dh,
           auth=EXCLUDED.auth, updated_at=NOW()`,
      [req.usuario.id, endpoint, keys.p256dh, keys.auth]
    );
    res.status(201).json({ mensaje: 'Notificaciones activadas.' });
  } catch (_error) {
    res.status(500).json({ mensaje: 'No se pudo guardar la suscripción.' });
  }
});

router.delete('/subscribe', authentication, async (req, res) => {
  await conexion.query(
    'DELETE FROM push_subscriptions WHERE endpoint=$1 AND id_usuario=$2',
    [req.body.endpoint, req.usuario.id]
  );
  res.status(204).end();
});

router.post('/test', authentication, async (req, res) => {
  if (!publicKey || !privateKey) {
    return res.status(503).json({ mensaje: 'Configura las claves VAPID antes de enviar push.' });
  }
  const subscriptions = (await conexion.query(
    'SELECT endpoint, p256dh, auth FROM push_subscriptions WHERE id_usuario=$1',
    [req.usuario.id]
  )).rows;
  const payload = JSON.stringify({
    title: 'ESPEConnect',
    body: 'Las notificaciones push funcionan correctamente.',
    url: '/dashboard',
  });
  let sent = 0;
  for (const item of subscriptions) {
    try {
      await webpush.sendNotification({
        endpoint: item.endpoint,
        keys: { p256dh: item.p256dh, auth: item.auth },
      }, payload);
      sent += 1;
    } catch (error) {
      if (error.statusCode === 404 || error.statusCode === 410) {
        await conexion.query('DELETE FROM push_subscriptions WHERE endpoint=$1', [item.endpoint]);
      }
    }
  }
  res.json({ mensaje: `Notificación enviada a ${sent} dispositivo(s).`, sent });
});

module.exports = router;
