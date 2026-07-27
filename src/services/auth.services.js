import api from '../api/axios';
import { MOCK_STUDENT_PROFILE } from '../data/mockData';

export const login = async (correo, password) => {
  try {
    const response = await api.post('/auth/login', { correo, password });
    return response.data;
  } catch (error) {
    console.warn('Backend no disponible, usando autenticación demo ESPEConnect:', error.message);
    if (correo.includes('admin')) {
      return {
        token: 'mock-admin-token',
        usuario: {
          ...MOCK_STUDENT_PROFILE,
          nombre: 'Dra. María Fernández (Administrador)',
          correo: 'admin@espe.edu.ec',
          rol: 'admin'
        }
      };
    }
    return {
      token: 'mock-student-token',
      usuario: {
        ...MOCK_STUDENT_PROFILE,
        correo: correo || MOCK_STUDENT_PROFILE.correo
      }
    };
  }
};

export const recperarPasswordService = async (correo) => {
  try {
    const response = await api.post('/auth/recuperar-password', { correo });
    return response.data;
  } catch (error) {
    return { mensaje: 'Se han enviado las instrucciones de recuperación a su correo institucional.' };
  }
};
