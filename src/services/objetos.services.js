import api from '../api/axios';
import { useUIStore } from '../store/uiStore';
import { isNetworkError, queueRequest } from './offlineQueue';

export const obtenerObjetos = async (params) => {
  try {
    const response = await api.get('/objetos-perdidos', { params });
    return response.data;
  } catch (error) {
    if (!isNetworkError(error)) throw error;

    let objetos = useUIStore.getState().objetos;
    if (params?.tipo && params.tipo !== 'todos') {
      objetos = objetos.filter((objeto) => objeto.tipo === params.tipo);
    }
    if (params?.categoria && params.categoria !== 'todas') {
      objetos = objetos.filter((objeto) => objeto.categoria === params.categoria);
    }
    if (params?.search) {
      const query = params.search.toLowerCase();
      objetos = objetos.filter((objeto) =>
        objeto.nombre?.toLowerCase().includes(query)
        || objeto.lugar?.toLowerCase().includes(query));
    }
    return objetos;
  }
};

export const marcarComoEncontrado = async (id) => {
  const { data } = await api.patch(`/objetos-perdidos/${id}/marcar-encontrado`);
  return data;
};

export const reclamarObjeto = async (id) => {
  const { data } = await api.post(`/objetos-perdidos/${id}/reclamar`);
  return data;
};

export const crearObjeto = async (data) => {
  const payload = {
    titulo: data.nombre,
    descripcion: data.descripcion,
    tipo: data.tipo,
    categoria: data.categoria,
    ubicacion: data.lugar,
    fecha_evento: data.fecha,
    informacion_contacto: data.reportante_contacto,
    imagen: data.imagen,
  };

  try {
    const response = await api.post('/objetos-perdidos', payload);
    return response.data;
  } catch (error) {
    if (!isNetworkError(error)) throw error;

    const queueId = await queueRequest({ url: '/objetos-perdidos', data: payload });
    const objeto = {
      id: `pending-${queueId}`,
      ...data,
      estado: 'pendiente_sincronizacion',
      pendienteSincronizacion: true,
      imagen: data.imagen,
    };
    useUIStore.getState().agregarObjeto(objeto);
    return { objeto, queued: true };
  }
};
