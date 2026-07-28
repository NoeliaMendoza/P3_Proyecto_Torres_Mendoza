import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useAuthStore = create(
  persist(
    (set) => ({
      usuario: null,
      token: null,
      isAuthenticated: false,
      contexto: null,

      login: (usuario, token) => {
        if (!usuario || !token) throw new Error('La sesión recibida no es válida.');
        localStorage.setItem('token', token);
        localStorage.setItem('usuario', JSON.stringify(usuario));
        set({ usuario, token, isAuthenticated: true });
      },

      logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('usuario');
        set({ usuario: null, token: null, isAuthenticated: false, contexto: null });
      },

      setUsuario: (usuario) => set({ usuario }),

      setContexto: (contexto) => set({ contexto })
    }),
    {
      name: 'espe-auth',
      partialize: (state) => ({
        usuario: state.usuario,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
        contexto: state.contexto
      })
    }
  )
);
