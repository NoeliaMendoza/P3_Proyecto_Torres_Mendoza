import api from '../api/axios';

export const obtenerReservasAdmin = async () =>
  (await api.get('/reservas/admin')).data;

export const actualizarEstadoReserva = async (id, estado) =>
  (await api.patch(`/reservas/${id}/estado`, { estado })).data;
