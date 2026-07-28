import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Button, Card, CardContent } from '@heroui/react';
import { 
  HiBuildingOffice2, 
  HiMagnifyingGlass, 
  HiAcademicCap, 
  HiBell, 
  HiArrowRight, 
  HiCalendar, 
  HiClock, 
  HiPlus,
  HiUser
} from 'react-icons/hi2';
import { useAuthStore } from '../../store/authStore';
import { useUIStore } from '../../store/uiStore';
import { obtenerEspacios } from '../../services/espacios.services';
import { obtenerMisReservas } from '../../services/reservas.services';
import { obtenerContextoUsuario } from '../../services/auth.services';
import { SpaceCard } from '../../components/spaces/SpaceCard';
import { ReservationModal } from '../../components/spaces/ReservationModal';

export const DashboardPages = () => {
  const usuario = useAuthStore((s) => s.usuario);
  const contexto = useAuthStore((s) => s.contexto);
  const setContexto = useAuthStore((s) => s.setContexto);
  const { espacios, objetos, reservas, notificaciones, setEspacios, setReservas } = useUIStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (!contexto && usuario) {
      obtenerContextoUsuario().then(setContexto).catch(() => {});
    }
  }, [contexto, usuario, setContexto]);

  const { data: espaciosAPI } = useQuery({
    queryKey: ['espacios'],
    queryFn: obtenerEspacios,
    staleTime: 60000,
  });
  const { data: reservasAPI } = useQuery({
    queryKey: ['reservas', 'mis'],
    queryFn: obtenerMisReservas,
    staleTime: 30000,
  });

  useEffect(() => { if (espaciosAPI) setEspacios(espaciosAPI); }, [espaciosAPI, setEspacios]);
  useEffect(() => { if (reservasAPI) setReservas(reservasAPI); }, [reservasAPI, setReservas]);

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
      <Card className="relative overflow-hidden rounded-[32px] border border-[#248277] bg-[#036666] text-white shadow-[0_24px_60px_rgba(3,102,102,0.18)]">
        <CardContent className="p-6 md:p-10">
        <div className="pointer-events-none absolute -right-20 -top-32 h-96 w-96 rounded-full bg-[#99E2B4]/20 blur-3xl" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3">
            <h1 className="text-2xl md:text-4xl font-extrabold tracking-tight font-heading leading-tight">
              Bienvenido, {usuario?.nombre || 'Estudiante'}
            </h1>
            <p className="text-xs md:text-sm text-[#D1D9D6] max-w-2xl leading-relaxed font-semibold">
              {contexto?.carrera?.nombre || 'Carrera'} &bull; {contexto?.nivel_pao ? `PAO ${contexto.nivel_pao}` : ''} &bull; Sede {contexto?.campus || 'Santo Domingo'}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <Button
              onPress={() => navigate('/espacios')}
              className="rounded-2xl bg-white px-6 font-extrabold text-[#036666]"
              startContent={<HiPlus className="h-4 w-4" />}
            >
              Nueva Reserva
            </Button>
            <Button
              variant="bordered"
              onPress={() => navigate('/objetos-perdidos')}
              className="rounded-2xl border-white/20 px-6 font-extrabold text-white"
              startContent={<HiMagnifyingGlass className="h-4 w-4 text-[#99E2B4]" />}
            >
              Objetos Perdidos
            </Button>
          </div>
        </div>
        </CardContent>
      </Card>

      {/* Stat Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s, idx) => {
          const Icon = s.icon;
          return (
            <Card
              key={idx}
              className="rounded-[24px] border border-[#D8EAE2] bg-white shadow-[0_10px_30px_rgba(3,102,102,0.05)] transition-shadow hover:shadow-[0_18px_40px_rgba(3,102,102,0.10)]"
            >
              <CardContent className="flex-row items-center justify-between p-6">
              <div>
                <p className="text-xs font-extrabold text-[#52716B]">{s.title}</p>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-3xl font-extrabold text-[#123B38] font-heading">
                    {s.value}
                  </span>
                  <span className="text-xs text-[#6A8881] font-bold">/ {s.total}</span>
                </div>
                <span className="text-[11px] text-[#358F80] font-extrabold mt-1 block">
                  {s.label}
                </span>
              </div>
              <div className="p-3.5 rounded-2xl bg-[#EAF6F0] text-[#358F80] border border-[#358F80]/20">
                <Icon className="w-6 h-6" />
              </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Quick Actions & Recent Reservations */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Academic Spaces Preview (8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-extrabold text-[#123B38] font-heading">
                Espacios Académicos Destacados
              </h2>
              <p className="text-xs text-[#52716B] font-semibold mt-0.5">
                Consulta y reserva laboratorios y auditorios disponibles hoy
              </p>
            </div>
            <button
              onClick={() => navigate('/espacios')}
              className="text-xs font-extrabold text-[#358F80] hover:text-[#14746F] flex items-center gap-1 transition-colors"
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
          <div className="bg-white rounded-[28px] p-6 border border-[#D8EAE2] shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-[#D8EAE2] pb-3">
              <h3 className="text-sm font-extrabold text-[#123B38] flex items-center gap-2 font-heading">
                <HiCalendar className="w-4 h-4 text-[#358F80]" />
                Mis Reservas Próximas
              </h3>
              <button
                onClick={() => navigate('/perfil?tab=reservas')}
                className="text-[11px] font-extrabold text-[#358F80] hover:underline"
              >
                Historial
              </button>
            </div>

            <div className="space-y-3">
              {reservas.slice(0, 3).map((r) => (
                <div
                  key={r.id}
                  className="p-4 rounded-2xl bg-[#F4FAF7] border border-[#D8EAE2] hover:border-[#358F80]/50 transition-colors"
                >
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-extrabold text-[#123B38] truncate">{r.espacioNombre}</span>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-[#EAF6F0] text-[#358F80]">
                      {r.estado}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-[11px] text-[#52716B] font-semibold mt-1">
                    <span className="flex items-center gap-1">
                      <HiCalendar className="w-3.5 h-3.5 text-[#358F80]" /> {r.fecha}
                    </span>
                    <span className="flex items-center gap-1">
                      <HiClock className="w-3.5 h-3.5 text-[#358F80]" /> {r.horario}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Access Card (Botanical Dark Teal) */}
          <div className="bg-[#036666] rounded-[28px] p-6 text-white space-y-4 border border-[#248277] shadow-md">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-[#358F80]/30 text-[#99E2B4] border border-[#358F80]/40">
                <HiUser className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-extrabold font-heading">
                  Perfil del {usuario?.rol === 'docente' ? 'Docente' : usuario?.rol === 'admin' ? 'Administrador' : 'Estudiante'}
                </h4>
                <p className="text-xs text-[#C8E8D7] font-semibold">Configuración y carnet digital</p>
              </div>
            </div>
            <button
              onClick={() => navigate('/perfil')}
              className="w-full py-3 rounded-full text-xs font-extrabold bg-[#358F80] hover:bg-[#14746F] text-white transition-all shadow-sm flex items-center justify-center gap-2"
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
