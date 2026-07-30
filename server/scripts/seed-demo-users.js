const path = require('path');
const dotenv = require('dotenv');

dotenv.config({ path: path.resolve(__dirname, '../../.env') });
dotenv.config({ path: path.resolve(__dirname, '../.env'), override: true });
process.env.SEED_DEMO_USERS = 'true';

const conexion = require('../database/conexion');
const seedDemoUsers = require('../database/seed-demo-users');

seedDemoUsers()
  .catch((error) => {
    console.error('No se pudieron preparar los usuarios demo:', error);
    process.exitCode = 1;
  })
  .finally(() => conexion.end());
