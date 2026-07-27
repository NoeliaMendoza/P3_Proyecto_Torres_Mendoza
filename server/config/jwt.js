const jwt = require('jsonwebtoken');

const generarToken = (usuario) => {
  return jwt.sign(
    { id: usuario.id, nombre: usuario.nombre, correo: usuario.correo, rol: usuario.rol },
    process.env.JWT_SECRET,
    { expiresIn: '8h' }
  );
};

module.exports = generarToken;
