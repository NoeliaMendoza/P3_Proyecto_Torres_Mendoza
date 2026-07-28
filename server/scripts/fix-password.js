const conexion = require('../database/conexion');
const bcrypt = require('bcrypt');

const fix = async () => {
  const hash = bcrypt.hashSync('espe2026', 10);
  await conexion.query("UPDATE usuarios SET password_hash = $1 WHERE email = 'ceandrade@espe.edu.ec'", [hash]);
  const hash2 = bcrypt.hashSync('admin2026', 10);
  await conexion.query("UPDATE usuarios SET password_hash = $1 WHERE email = 'admin@espe.edu.ec'", [hash2]);
  const hash3 = bcrypt.hashSync('123456', 10);
  await conexion.query("UPDATE usuarios SET password_hash = $1 WHERE email = 'test@espe.edu.ec'", [hash3]);
  console.log('Passwords updated');
  process.exit(0);
};
fix().catch(e => { console.error(e); process.exit(1); });
