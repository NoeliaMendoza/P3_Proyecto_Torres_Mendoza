const path = require('path');
const dotenv = require('dotenv');

dotenv.config({ path: path.resolve(__dirname, '../../.env') });
dotenv.config({ path: path.resolve(__dirname, '../.env'), override: true });

const { verifyEmailTransport } = require('../services/email.service');

verifyEmailTransport()
  .then(() => {
    console.log('Diagnóstico SMTP correcto.');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Diagnóstico SMTP fallido:', {
      code: error.code,
      responseCode: error.responseCode,
      message: error.message,
    });
    process.exit(1);
  });
