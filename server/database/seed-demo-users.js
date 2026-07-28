const bcrypt = require('bcrypt');
const conexion = require('./conexion');

const DEMO_USERS = [
  {
    email: 'ceandrade@espe.edu.ec',
    password: 'espe2026',
    nombre: 'Carlos Eduardo Andrade Paredes',
    rol: 'estudiante',
  },
  {
    email: 'admin@espe.edu.ec',
    password: 'admin2026',
    nombre: 'Administrador ESPEConnect',
    rol: 'admin',
  },
];

const seedDemoUsers = async () => {
  if (process.env.SEED_DEMO_USERS !== 'true') return;

  for (const user of DEMO_USERS) {
    const passwordHash = await bcrypt.hash(user.password, 10);
    await conexion.query(
      `INSERT INTO usuarios (email, password_hash, nombre_completo, rol)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (email) DO NOTHING`,
      [user.email, passwordHash, user.nombre, user.rol]
    );
  }

  console.log('Usuarios de demostración preparados.');
};

module.exports = seedDemoUsers;
