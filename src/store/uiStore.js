import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useUIStore = create(
  persist(
    (set, _get) => ({
      sidebarOpen: true,
      notificationDrawerOpen: false,
      notificaciones: [],
      espacios: [],
      objetos: [],
      reservas: [],

      toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
      setSidebarOpen: (open) => set({ sidebarOpen: open }),
      
      toggleNotificationDrawer: () => set((state) => ({ notificationDrawerOpen: !state.notificationDrawerOpen })),
      setNotificationDrawerOpen: (open) => set({ notificationDrawerOpen: open }),

      setEspacios: (espacios) => set({ espacios }),
      setReservas: (reservas) => set({ reservas }),
      setObjetos: (objetos) => set({ objetos }),
      setNotificaciones: (notificaciones) => set({ notificaciones }),

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
              titulo: 'Reserva Solicitada',
              mensaje: `Has solicitado ${nuevaReserva.espacioNombre} para el ${nuevaReserva.fecha} (${nuevaReserva.horario}). Pendiente de aprobación.`,
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
