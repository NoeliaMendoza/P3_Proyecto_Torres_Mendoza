import api from '../api/axios';
import { useUIStore } from '../store/uiStore';

export const obtenerObjetos = async (params) => {
  try {
    const response = await api.get('/objetos', { params });
    return response.data;
  } catch (error) {
    let objetos = useUIStore.getState().objetos;
    if (params?.tipo && params.tipo !== 'todos') {
      objetos = objetos.filter(o => o.tipo === params.tipo);
    }
    if (params?.categoria && params.categoria !== 'todas') {
      objetos = objetos.filter(o => o.categoria === params.categoria);
    }
    if (params?.search) {
      const query = params.search.toLowerCase();
      objetos = objetos.filter(o => o.nombre.toLowerCase().includes(query) || o.lugar.toLowerCase().includes(query));
    }
    return objetos;
  }
};

export const crearObjeto = async (data) => {
  try {
    const response = await api.post('/objetos', data);
    return response.data;
  } catch (error) {
    const nuevo = {
      id: Date.now(),
      ...data,
      estado: data.tipo === 'perdido' ? 'Perdido' : 'En custodia',
      imagen: data.imagen || 'https://images.unsplash.com/photo-1584438784894-089d6a62b8fa?auto=format&fit=crop&w=800&q=80'
    };
    useUIStore.getState().agregarObjeto(nuevo);
    return nuevo;
  }
};
