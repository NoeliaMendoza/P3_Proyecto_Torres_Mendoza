import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  HiBuildingOffice2, 
  HiMagnifyingGlass, 
  HiAcademicCap, 
  HiBell, 
  HiArrowRight, 
  HiCalendar, 
  HiClock, 
  HiPlus, 
  HiCheckBadge,
  HiSparkles,
  HiUser
} from 'react-icons/hi2';
import { useAuthStore } from '../../store/authStore';
import { useUIStore } from '../../store/uiStore';
import { SpaceCard } from '../../components/spaces/SpaceCard';
import { ReservationModal } from '../../components/spaces/ReservationModal';

export const DashboardPages = () => {
  const usuario = useAuthStore((s) => s.usuario);
  const { espacios, objetos, reservas, notificaciones } = useUIStore();
  const navigate = useNavigate();

  const [selectedSpace, setSelectedSpace] = useState(null);
  const [modalReservationOpen, setModalReservationOpen] = useState(false);

  const disponiblesCount = espacios.filter((e) => e.estado === 'disponible').length;
  const misReservasCount = reservas.length;
  const objetosCount = objetos.length;
  const unreadNotificationsCount = notificaciones.filter((n) => !n.leido).length;

  const stats = [
    {
      title: 'Espacios Disponibles',
      value: disponiblesCount,
      total: espacios.length,
      label: 'Listos para reservar',
      icon: HiBuildingOffice2,
    },
    {
      title: 'Mis Reservas',
      value: misReservasCount,
      total: misReservasCount,
      label: 'Historial activo',
      icon: HiAcademicCap,
    },
    {
      title: 'Objetos Reportados',
      value: objetosCount,
      total: objetosCount,
      label: 'Perdidos y encontrados',
      icon: HiMagnifyingGlass,
    },
    {
      title: 'Notificaciones',
      value: unreadNotificationsCount,
      total: notificaciones.length,
      label: 'Novedades pendientes',
      icon: HiBell,
    }
  ];

  const handleReservar = (espacio) => {
    setSelectedSpace(espacio);
    setModalReservationOpen(true);
  };

  return (
    <div className="space-y-8">
      {/* Welcome Banner (Botanical dark teal surface matching reference image) */}
      <div className="relative rounded-[32px] bg-[#162E2B] p-6 md:p-10 text-white overflow-hidden shadow-xl border border-[#264743]">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#008345]/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#008345]/30 text-[#36D080] text-xs font-extrabold border border-[#008345]/40">
              <HiSparkles className="w-4 h-4" />
              Campus Matriz - Sangolquí
            </div>
            <h1 className="text-2xl md:text-4xl font-extrabold tracking-tight font-heading leading-tight">
              Bienvenido, {usuario?.nombre || 'Estudiante'}
            </h1>
            <p className="text-xs md:text-sm text-[#D1D9D6] max-w-2xl leading-relaxed font-semibold">
              {usuario?.carrera || 'Ingeniería en Software'} &bull; {usuario?.semestre || '7mo Semestre'} &bull; Promedio: <span className="font-extrabold text-[#36D080]">{usuario?.promedio || '18.85 / 20'}</span>
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              onClick={() => navigate('/espacios')}
              className="px-6 py-3 rounded-full bg-white text-[#162E2B] font-extrabold text-xs hover:bg-[#F2F4EF] shadow-md transition-all flex items-center gap-2"
            >
              <HiPlus className="w-4 h-4 text-[#008345]" />
              Nueva Reserva
            </button>
            <button
              onClick={() => navigate('/objetos-perdidos')}
              className="px-6 py-3 rounded-full bg-[#0D1B19] text-white font-extrabold text-xs border border-[#264743] hover:bg-[#122422] transition-all flex items-center gap-2"
            >
              <HiMagnifyingGlass className="w-4 h-4 text-[#36D080]" />
              Objetos Perdidos
            </button>
          </div>
        </div>
      </div>

      {/* Stat Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s, idx) => {
          const Icon = s.icon;
          return (
            <motion.div
              key={idx}
              whileHover={{ y: -3 }}
              className="p-6 rounded-[24px] bg-white border border-[#E0E4DC] shadow-xs hover:shadow-lg transition-all flex items-center justify-between"
            >
              <div>
                <p className="text-xs font-extrabold text-[#586663]">{s.title}</p>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-3xl font-extrabold text-[#0F1A19] font-heading">
                    {s.value}
                  </span>
                  <span className="text-xs text-[#8A9693] font-bold">/ {s.total}</span>
                </div>
                <span className="text-[11px] text-[#008345] font-extrabold mt-1 block">
                  {s.label}
                </span>
              </div>
              <div className="p-3.5 rounded-2xl bg-[#E6F3EC] text-[#008345] border border-[#008345]/20">
                <Icon className="w-6 h-6" />
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Quick Actions & Recent Reservations */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Academic Spaces Preview (8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-extrabold text-[#0F1A19] font-heading">
                Espacios Académicos Destacados
              </h2>
              <p className="text-xs text-[#586663] font-semibold mt-0.5">
                Consulta y reserva laboratorios y auditorios disponibles hoy
              </p>
            </div>
            <button
              onClick={() => navigate('/espacios')}
              className="text-xs font-extrabold text-[#008345] hover:text-[#006636] flex items-center gap-1 transition-colors"
            >
              Ver todos ({espacios.length}) <HiArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {espacios.slice(0, 2).map((e) => (
              <SpaceCard key={e.id} espacio={e} onReservar={handleReservar} />
            ))}
          </div>
        </div>

        {/* Right Column: Active Reservations & Quick Actions (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Active Reservations Widget */}
          <div className="bg-white rounded-[28px] p-6 border border-[#E0E4DC] shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-[#E0E4DC] pb-3">
              <h3 className="text-sm font-extrabold text-[#0F1A19] flex items-center gap-2 font-heading">
                <HiCalendar className="w-4 h-4 text-[#008345]" />
                Mis Reservas Próximas
              </h3>
              <button
                onClick={() => navigate('/perfil?tab=reservas')}
                className="text-[11px] font-extrabold text-[#008345] hover:underline"
              >
                Historial
              </button>
            </div>

            <div className="space-y-3">
              {reservas.slice(0, 3).map((r) => (
                <div
                  key={r.id}
                  className="p-4 rounded-2xl bg-[#F2F4EF] border border-[#E0E4DC] hover:border-[#008345]/50 transition-colors"
                >
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-extrabold text-[#0F1A19] truncate">{r.espacioNombre}</span>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-[#E6F3EC] text-[#008345]">
                      {r.estado}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-[11px] text-[#586663] font-semibold mt-1">
                    <span className="flex items-center gap-1">
                      <HiCalendar className="w-3.5 h-3.5 text-[#008345]" /> {r.fecha}
                    </span>
                    <span className="flex items-center gap-1">
                      <HiClock className="w-3.5 h-3.5 text-[#008345]" /> {r.horario}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Access Card (Botanical Dark Teal) */}
          <div className="bg-[#162E2B] rounded-[28px] p-6 text-white space-y-4 border border-[#264743] shadow-md">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-[#008345]/30 text-[#36D080] border border-[#008345]/40">
                <HiUser className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-extrabold font-heading">Perfil del Estudiante</h4>
                <p className="text-xs text-[#9EB0AA] font-semibold">Configuración y carnet digital</p>
              </div>
            </div>
            <button
              onClick={() => navigate('/perfil')}
              className="w-full py-3 rounded-full text-xs font-extrabold bg-[#008345] hover:bg-[#006636] text-white transition-all shadow-sm flex items-center justify-center gap-2"
            >
              Gestionar Mi Perfil
            </button>
          </div>
        </div>
      </div>

      {/* Reservation Modal */}
      <ReservationModal
        espacio={selectedSpace}
        isOpen={modalReservationOpen}
        onClose={() => setModalReservationOpen(false)}
      />
    </div>
  );
};
