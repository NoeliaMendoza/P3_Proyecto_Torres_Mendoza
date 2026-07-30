import api from '../api/axios';

export const login = async (correo, password) => {
  const response = await api.post('/auth/login', { correo, password });
  return response.data;
};

export const registerUser = async (nombre, correo, password) => {
  const response = await api.post(
    '/auth/register',
    { nombre, correo, password },
    { timeout: 60000 },
  );
  return response.data;
};

export const recperarPasswordService = async (correo) => {
  const response = await api.post(
    '/auth/recuperar-password',
    { correo },
    { timeout: 60000 },
  );
  return response.data;
};

export const verificarCorreo = async (token) => {
  const response = await api.get('/auth/verificar-correo', { params: { token } });
  return response.data;
};

export const reenviarVerificacion = async (correo) => {
  const response = await api.post(
    '/auth/reenviar-verificacion',
    { correo },
    { timeout: 60000 },
  );
  return response.data;
};

export const restablecerPassword = async (token, password) => {
  const response = await api.post('/auth/restablecer-password', { token, password });
  return response.data;
};

export const obtenerContextoUsuario = async () => {
  const response = await api.get('/auth/me/contexto');
  return response.data;
};
