import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { MOCK_STUDENT_PROFILE } from '../data/mockData';

export const useAuthStore = create(
  persist(
    (set) => ({
      usuario: MOCK_STUDENT_PROFILE,
      token: 'demo-espe-jwt-token',
      isAuthenticated: true,

      login: (usuario, token) => {
        const userObj = usuario || MOCK_STUDENT_PROFILE;
        const jwtToken = token || 'demo-espe-jwt-token';
        localStorage.setItem('token', jwtToken);
        localStorage.setItem('usuario', JSON.stringify(userObj));
        set({ usuario: userObj, token: jwtToken, isAuthenticated: true });
      },

      logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('usuario');
        set({ usuario: null, token: null, isAuthenticated: false });
      },

      setUsuario: (usuario) => set({ usuario })
    }),
    {
      name: 'espe-auth',
      partialize: (state) => ({
        usuario: state.usuario,
        token: state.token,
        isAuthenticated: state.isAuthenticated
      })
    }
  )
);
