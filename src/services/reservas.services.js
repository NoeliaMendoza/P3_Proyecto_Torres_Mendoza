import api from '../api/axios';

const normalizarReserva = (r) => ({
  id: r.id,
  espacioNombre: r.espacio_nombre || r.espacioNombre,
  espacioCodigo: r.espacio_codigo,
  espacioId: r.id_espacio,
  fecha: r.fecha,
  horario: r.horario || `${(r.hora_inicio || '').slice(0,5)} - ${(r.hora_fin || '').slice(0,5)}`,
  horaInicio: r.hora_inicio,
  horaFin: r.hora_fin,
  estado: r.estado,
  motivo: r.motivo,
  created_at: r.created_at,
});

export const obtenerReservasAdmin = async () => {
  const r = await api.get('/reservas/admin');
  return r.data;
};

export const obtenerMisReservas = async () => {
  const r = await api.get('/reservas');
  return r.data.map(normalizarReserva);
};

export const actualizarEstadoReserva = async (id, estado) =>
  (await api.patch(`/reservas/${id}/estado`, { estado })).data;
