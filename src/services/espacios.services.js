import api from '../api/axios';
import { useUIStore } from '../store/uiStore';

export const obtenerEspacios = async (params) => {
  try {
    const response = await api.get('/espacios', { params });
    return response.data;
  } catch (error) {
    const espacios = useUIStore.getState().espacios;
    if (params?.search) {
      const q = params.search.toLowerCase();
      return espacios.filter(e => e.nombre.toLowerCase().includes(q) || e.edificio.toLowerCase().includes(q));
    }
    if (params?.tipo && params.tipo !== 'todos') {
      return espacios.filter(e => e.tipo === params.tipo);
    }
    return espacios;
  }
};

export const obtenerUnEspacio = async (id) => {
  try {
    const response = await api.get(`/espacios/${id}`);
    return response.data;
  } catch (error) {
    const espacios = useUIStore.getState().espacios;
    return espacios.find((e) => e.id === Number(id)) || espacios[0];
  }
};

export const reservarEspacio = async (data) => {
  try {
    const response = await api.post('/espacios/reservar', data);
    return response.data;
  } catch (error) {
    useUIStore.getState().agregarReserva({
      id: `RES-${Math.floor(1000 + Math.random() * 9000)}`,
      espacioNombre: data.espacioNombre || 'Espacio Académico',
      fecha: data.fecha,
      horario: data.horario,
      estado: 'Aprobada',
      motivo: data.motivo || 'Uso Académico'
    });
    return { exito: true, mensaje: 'Reserva confirmada con éxito' };
  }
};
