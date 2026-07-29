const INSTITUTIONAL_EMAIL = /^[a-z0-9._%+-]+@espe\.edu\.ec$/i;
const PERSON_NAME = /^[A-Za-zÁÉÍÓÚÑáéíóúñÜü]+(?:[ '-][A-Za-zÁÉÍÓÚÑáéíóúñÜü]+)+$/;

const normalizeEmail = (value = '') => String(value).trim().toLowerCase();
const normalizeName = (value = '') => String(value).trim().replace(/\s+/g, ' ');

const isStrongPassword = (value) =>
  typeof value === 'string' &&
  value.length >= 8 &&
  value.length <= 72 &&
  /[A-ZÁÉÍÓÚÑ]/.test(value) &&
  /[a-záéíóúñ]/.test(value) &&
  /\d/.test(value) &&
  /[^A-Za-zÁÉÍÓÚÑáéíóúñ0-9\s]/.test(value);

const validateRegistration = (body = {}) => {
  const nombre = normalizeName(body.nombre);
  const correo = normalizeEmail(body.correo);
  const password = typeof body.password === 'string' ? body.password : '';
  const errors = {};

  if (nombre.length < 5 || nombre.length > 100 || !PERSON_NAME.test(nombre)) {
    errors.nombre = 'Escribe al menos un nombre y un apellido, usando solo letras.';
  }
  if (!INSTITUTIONAL_EMAIL.test(correo)) {
    errors.correo = 'Utiliza un correo institucional terminado en @espe.edu.ec.';
  }
  if (!isStrongPassword(password)) {
    errors.password = 'La contraseña debe tener entre 8 y 72 caracteres, mayúscula, minúscula, número y símbolo.';
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
    values: { nombre, correo, password },
  };
};

module.exports = { validateRegistration, normalizeEmail, isStrongPassword };
