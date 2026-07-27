import api from '../api/axios';

export const obtenerHorarios = async (params) => {
  const response = await api.get('/horarios', { params });
  return response.data;
};

export const obtenerHorariosPorPeriodo = async (periodoId) => {
  const response = await api.get(`/horarios/periodo/${periodoId}`);
  return response.data;
};

export const obtenerHorariosPorEspacio = async (espacioId) => {
  const response = await api.get(`/horarios/espacio/${espacioId}`);
  return response.data;
};

export const obtenerPeriodoActual = async () => {
  const response = await api.get('/horarios/periodo-actual');
  return response.data;
};
