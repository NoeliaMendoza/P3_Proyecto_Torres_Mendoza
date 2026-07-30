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
    if (params?.tipo && params.tipo !== 'todos') objetos = objetos.filter((o) => o.tipo === params.tipo);
    if (params?.categoria && params.categoria !== 'todas') objetos = objetos.filter((o) => o.categoria === params.categoria);
    if (params?.search) {
      const query = params.search.toLowerCase();
      objetos = objetos.filter((o) =>
        o.nombre?.toLowerCase().includes(query) || o.lugar?.toLowerCase().includes(query));
    }
    return objetos;
  }
};

const CATEGORIAS = {
  'Electrónica': 1, 'Documentos': 2, 'Mochilas y Bolsos': 3, 'Accesorios': 4,
  'Útiles Académicos': 5, 'Ropa': 6, 'Billeteras': 7, 'Otros': 8,
};

export const crearObjeto = async (data) => {
  const payload = {
    titulo: data.nombre,
    descripcion: data.descripcion,
    tipo: data.tipo,
    id_categoria: CATEGORIAS[data.categoria] || null,
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
