import api from '../api/axios';

export const obtenerNotificaciones = async () =>
  (await api.get('/notificaciones')).data;

export const marcarLeida = async (id) =>
  (await api.patch(`/notificaciones/${id}/leido`)).data;

export const marcarTodasLeidas = async () =>
  (await api.patch('/notificaciones/leer-todas')).data;