const fs = require('fs');
const path = require('path');
const webpush = require('web-push');

const envPath = path.resolve(__dirname, '..', '..', '.env');
const keys = webpush.generateVAPIDKeys();
let env = fs.existsSync(envPath) ? fs.readFileSync(envPath, 'utf8') : '';

const setValue = (name, value) => {
  const line = `${name}=${value}`;
  const pattern = new RegExp(`^${name}=.*$`, 'm');
  env = pattern.test(env)
    ? env.replace(pattern, line)
    : `${env.trimEnd()}${env.trim() ? '\n' : ''}${line}\n`;
};

setValue('VAPID_PUBLIC_KEY', keys.publicKey);
setValue('VAPID_PRIVATE_KEY', keys.privateKey);
setValue('VAPID_SUBJECT', 'mailto:admin@espe.edu.ec');
fs.writeFileSync(envPath, env, 'utf8');
console.log('Claves VAPID configuradas en .env.');
