import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { INITIAL_NOTIFICACIONES, INITIAL_ESPACIOS, INITIAL_OBJETOS, MOCK_RESERVAS_HISTORIAL } from '../data/mockData';

export const useUIStore = create(
  persist(
    (set, get) => ({
      sidebarOpen: true,
      notificationDrawerOpen: false,
      notificaciones: INITIAL_NOTIFICACIONES,
      espacios: INITIAL_ESPACIOS,
      objetos: INITIAL_OBJETOS,
      reservas: MOCK_RESERVAS_HISTORIAL,

      toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
      setSidebarOpen: (open) => set({ sidebarOpen: open }),
      
      toggleNotificationDrawer: () => set((state) => ({ notificationDrawerOpen: !state.notificationDrawerOpen })),
      setNotificationDrawerOpen: (open) => set({ notificationDrawerOpen: open }),

      marcarNotificacionLeida: (id) =>
        set((state) => ({
          notificaciones: state.notificaciones.map((n) => (n.id === id ? { ...n, leido: true } : n))
        })),

      marcarTodasLeidas: () =>
        set((state) => ({
          notificaciones: state.notificaciones.map((n) => ({ ...n, leido: true }))
        })),

      agregarReserva: (nuevaReserva) =>
        set((state) => ({
          reservas: [nuevaReserva, ...state.reservas],
          notificaciones: [
            {
              id: Date.now(),
              titulo: 'Reserva Registrada',
              mensaje: `Has reservado ${nuevaReserva.espacioNombre} para el ${nuevaReserva.fecha} (${nuevaReserva.horario}).`,
              fecha: 'Ahora mismo',
              categoria: 'reserva',
              leido: false
            },
            ...state.notificaciones
          ]
        })),

      agregarObjeto: (nuevoObjeto) =>
        set((state) => ({
          objetos: [nuevoObjeto, ...state.objetos],
          notificaciones: [
            {
              id: Date.now(),
              titulo: 'Publicación Exitosa',
              mensaje: `Has publicado "${nuevoObjeto.nombre}" en la sección de objetos ${nuevoObjeto.tipo}s.`,
              fecha: 'Ahora mismo',
              categoria: 'objeto',
              leido: false
            },
            ...state.notificaciones
          ]
        }))
    }),
    {
      name: 'espe-ui-store'
    }
  )
);
