export const PASSWORD_RULES = [
  { key: 'length', label: '8 caracteres', test: (value) => value.length >= 8 },
  { key: 'uppercase', label: 'una mayúscula', test: (value) => /[A-ZÁÉÍÓÚÑ]/.test(value) },
  { key: 'lowercase', label: 'una minúscula', test: (value) => /[a-záéíóúñ]/.test(value) },
  { key: 'number', label: 'un número', test: (value) => /\d/.test(value) },
  { key: 'symbol', label: 'un símbolo', test: (value) => /[^A-Za-zÁÉÍÓÚÑáéíóúñ0-9\s]/.test(value) },
];

const INSTITUTIONAL_EMAIL = /^[a-z0-9._%+-]+@espe\.edu\.ec$/i;
const PERSON_NAME = /^[A-Za-zÁÉÍÓÚÑáéíóúñÜü]+(?:[ '-][A-Za-zÁÉÍÓÚÑáéíóúñÜü]+)+$/;

export const normalizeEmail = (value = '') => value.trim().toLowerCase();
export const normalizeName = (value = '') => value.trim().replace(/\s+/g, ' ');

export const getPasswordChecks = (password = '') =>
  PASSWORD_RULES.map((rule) => ({ ...rule, valid: rule.test(password) }));

export const validateRegistration = ({ nombre, correo, password, confirmPassword, acceptedTerms }) => {
  const errors = {};
  const cleanName = normalizeName(nombre);
  const cleanEmail = normalizeEmail(correo);

  if (!cleanName) {
    errors.nombre = 'Ingresa tu nombre completo.';
  } else if (cleanName.length < 5 || cleanName.length > 100 || !PERSON_NAME.test(cleanName)) {
    errors.nombre = 'Escribe al menos un nombre y un apellido, usando solo letras.';
  }

  if (!cleanEmail) {
    errors.correo = 'Ingresa tu correo institucional.';
  } else if (!INSTITUTIONAL_EMAIL.test(cleanEmail)) {
    errors.correo = 'Utiliza un correo institucional terminado en @espe.edu.ec.';
  }

  if (!password) {
    errors.password = 'Crea una contraseña.';
  } else if (getPasswordChecks(password).some((rule) => !rule.valid)) {
    errors.password = 'La contraseña todavía no cumple todos los requisitos.';
  }

  if (!confirmPassword) {
    errors.confirmPassword = 'Confirma tu contraseña.';
  } else if (password !== confirmPassword) {
    errors.confirmPassword = 'Las contraseñas no coinciden.';
  }

  if (!acceptedTerms) {
    errors.acceptedTerms = 'Debes aceptar los términos y la política de privacidad.';
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
    values: { nombre: cleanName, correo: cleanEmail, password },
  };
};
