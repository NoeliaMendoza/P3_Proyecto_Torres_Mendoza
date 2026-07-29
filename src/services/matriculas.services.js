import api from '../api/axios';

export const obtenerNrcsDisponibles = async () => {
  const response = await api.get('/matriculas');
  return response.data;
};

export const inscribirNrc = async (id_nrc) => {
  const response = await api.post('/matriculas/inscribir', { id_nrc });
  return response.data;
};

export const obtenerNrcsDisponiblesDocente = async () => {
  const response = await api.get('/matriculas/docente/disponibles');
  return response.data;
};

export const asignarNrcDocente = async (id_nrc) => {
  const response = await api.post('/matriculas/docente/asignar', { id_nrc });
  return response.data;
};

export const cancelarMatricula = async (id_nrc) => {
  const response = await api.delete(`/matriculas/${id_nrc}`);
  return response.data;
};
