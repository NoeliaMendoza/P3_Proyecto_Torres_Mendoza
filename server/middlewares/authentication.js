const jwt = require('jsonwebtoken');

const authentication = (req, res, next) => {
  const encabezado = req.headers.authorization;
  if (!encabezado) return res.status(401).json({ mensaje: 'Debe enviar el token.' });
  const token = encabezado.split(' ')[1];
  if (!token) return res.status(401).json({ mensaje: 'Token inválido.' });
  try {
    req.usuario = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch (error) {
    return res.status(401).json({ mensaje: 'Token expirado o inválido.' });
  }
};

module.exports = authentication;
