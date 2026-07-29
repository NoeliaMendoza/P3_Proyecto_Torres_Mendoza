const nodemailer = require('nodemailer');

const frontendUrl = (process.env.FRONTEND_URL || 'http://localhost:5173').replace(/\/+$/, '');
const deliveryMode = process.env.EMAIL_DELIVERY_MODE
  || (process.env.NODE_ENV === 'production' ? 'smtp' : 'console');

let transporter;

const getTransporter = () => {
  if (transporter) return transporter;

  const required = ['SMTP_HOST', 'SMTP_PORT', 'SMTP_USER', 'SMTP_PASSWORD', 'SMTP_FROM'];
  const missing = required.filter((key) => !process.env[key]);
  if (missing.length) {
    throw new Error(`Faltan secretos SMTP: ${missing.join(', ')}`);
  }

  const port = Number(process.env.SMTP_PORT);
  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port,
    secure: port === 465,
    requireTLS: port !== 465,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD,
    },
    disableFileAccess: true,
    disableUrlAccess: true,
  });
  return transporter;
};

const send = async ({ to, subject, text, html }) => {
  if (deliveryMode === 'console') {
    console.info(`[email:console] Para: ${to} | ${subject}\n${text}`);
    return;
  }
  if (deliveryMode !== 'smtp') throw new Error('EMAIL_DELIVERY_MODE debe ser smtp o console.');

  const info = await getTransporter().sendMail({
    from: process.env.SMTP_FROM,
    to,
    subject,
    text,
    html,
  });
  console.info('[email:smtp]', {
    messageId: info.messageId,
    accepted: info.accepted?.length || 0,
    rejected: info.rejected?.length || 0,
    pending: info.pending?.length || 0,
    response: info.response,
  });
  return info;
};

const emailTemplate = ({ title, message, buttonText, url, expires }) => `
  <!doctype html>
  <html lang="es">
    <body style="margin:0;background:#f4faf7;font-family:Arial,sans-serif;color:#123b38">
      <div style="max-width:560px;margin:32px auto;padding:32px;background:#fff;border:1px solid #d8eae2;border-radius:24px">
        <p style="font-size:20px;font-weight:800;color:#036666">ESPEConnect</p>
        <h1 style="font-size:24px">${title}</h1>
        <p style="line-height:1.6">${message}</p>
        <p style="margin:28px 0">
          <a href="${url}" style="padding:13px 22px;border-radius:14px;background:#036666;color:#fff;text-decoration:none;font-weight:700">${buttonText}</a>
        </p>
        <p style="font-size:12px;color:#52716b">Este enlace caduca en ${expires}. Si no solicitaste esta acción, ignora este mensaje.</p>
      </div>
    </body>
  </html>`;

const sendVerificationEmail = async (email, token) => {
  const url = `${frontendUrl}/verificar-correo?token=${encodeURIComponent(token)}`;
  await send({
    to: email,
    subject: 'Verifica tu cuenta de ESPEConnect',
    text: `Verifica tu cuenta abriendo este enlace (caduca en 24 horas): ${url}`,
    html: emailTemplate({
      title: 'Verifica tu correo institucional',
      message: 'Confirma que este correo te pertenece para activar tu cuenta de estudiante.',
      buttonText: 'Verificar mi correo',
      url,
      expires: '24 horas',
    }),
  });
};

const sendPasswordResetEmail = async (email, token) => {
  const url = `${frontendUrl}/restablecer-password?token=${encodeURIComponent(token)}`;
  await send({
    to: email,
    subject: 'Restablece tu contraseña de ESPEConnect',
    text: `Restablece tu contraseña abriendo este enlace (caduca en 30 minutos): ${url}`,
    html: emailTemplate({
      title: 'Restablecer contraseña',
      message: 'Recibimos una solicitud para cambiar la contraseña de tu cuenta.',
      buttonText: 'Crear nueva contraseña',
      url,
      expires: '30 minutos',
    }),
  });
};

module.exports = { sendVerificationEmail, sendPasswordResetEmail };
