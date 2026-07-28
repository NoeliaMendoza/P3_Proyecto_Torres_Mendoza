import api from '../api/axios';

export const login = async (correo, password) => {
  const response = await api.post('/auth/login', { correo, password });
  return response.data;
};

export const registerUser = async (nombre, correo, password) => {
  const response = await api.post('/auth/register', { nombre, correo, password });
  return response.data;
};

export const recperarPasswordService = async (correo) => {
  const response = await api.post('/auth/recuperar-password', { correo });
  return response.data;
};
