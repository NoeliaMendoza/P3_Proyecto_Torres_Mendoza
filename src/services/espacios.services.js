import api from '../api/axios';
import { useUIStore } from '../store/uiStore';
import { isNetworkError, queueRequest } from './offlineQueue';

export const obtenerEspacios = async (params) => {
  try {
    return (await api.get('/espacios', { params })).data;
  } catch (error) {
    if (!isNetworkError(error)) throw error;
    let espacios = useUIStore.getState().espacios;
    if (params?.search) {
      const q = params.search.toLowerCase();
      espacios = espacios.filter((e) =>
        e.nombre.toLowerCase().includes(q) || e.edificio.toLowerCase().includes(q));
    }
    if (params?.tipo && params.tipo !== 'todos') espacios = espacios.filter((e) => (e.tipo_espacio || e.tipo) === params.tipo);
    return espacios;
  }
};

export const obtenerUnEspacio = async (id) => {
  try {
    return (await api.get(`/espacios/${id}`)).data;
  } catch (error) {
    if (!isNetworkError(error)) throw error;
    return useUIStore.getState().espacios.find((e) => e.id === Number(id));
  }
};

export const reservarEspacio = async (data) => {
  const [horaInicio, horaFin] = data.horario.split(' - ');
  const payload = {
    espacioId: data.espacioId,
    fecha: data.fecha,
    horaInicio,
    horaFin,
    motivo: data.motivo,
  };
  try {
    const response = await api.post('/reservas', payload);
    useUIStore.getState().agregarReserva({
      id: response.data.reserva.id,
      espacioNombre: data.espacioNombre,
      fecha: data.fecha,
      horario: data.horario,
      estado: response.data.reserva.estado,
      motivo: data.motivo,
    });
    return response.data;
  } catch (error) {
    if (!isNetworkError(error)) throw error;
    const queueId = await queueRequest({ url: '/reservas', data: payload });
    useUIStore.getState().agregarReserva({
      id: `pending-${queueId}`,
      espacioNombre: data.espacioNombre,
      fecha: data.fecha,
      horario: data.horario,
      estado: 'Pendiente de sincronización',
      motivo: data.motivo,
    });
    return { queued: true, mensaje: 'Reserva pendiente de sincronización.' };
  }
};
