import { useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  HiCalendarDays,
  HiCheckBadge,
  HiClock,
  HiInformationCircle,
  HiMagnifyingGlass,
} from 'react-icons/hi2';
import { toast } from 'sonner';
import { AdminReservationTable } from '../../components/reservations/AdminReservationTable';
import {
  actualizarEstadoReserva,
  obtenerReservasAdmin,
} from '../../services/reservas.services';

const FILTERS = [
  ['todas', 'Todas'],
  ['pendiente', 'Pendientes'],
  ['aprobada', 'Aprobadas'],
  ['finalizada', 'Finalizadas'],
  ['rechazada', 'Rechazadas'],
  ['cancelada', 'Canceladas'],
];

export const AdminReservationsPage = () => {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('todas');
  const [updatingId, setUpdatingId] = useState(null);
  const queryClient = useQueryClient();

  const { data: reservations = [], isLoading, isError } = useQuery({
    queryKey: ['reservas', 'admin'],
    queryFn: obtenerReservasAdmin,
  });

  const updateStatus = useMutation({
    mutationFn: ({ id, status }) => actualizarEstadoReserva(id, status),
    onMutate: ({ id }) => setUpdatingId(id),
    onSuccess: (data) => {
      toast.success(data.mensaje);
      queryClient.invalidateQueries({ queryKey: ['reservas', 'admin'] });
    },
    onError: (error) => {
      toast.error('No se pudo actualizar la reserva', {
        description: error.response?.data?.mensaje || 'Inténtalo nuevamente.',
      });
    },
    onSettled: () => setUpdatingId(null),
  });

  const filteredReservations = useMemo(() => {
    const term = search.trim().toLowerCase();
    return reservations.filter((reservation) => {
      const visualStatus = reservation.estado_visual || reservation.estado;
      const matchesStatus = statusFilter === 'todas' || visualStatus === statusFilter;
      const matchesSearch =
        !term ||
        reservation.estudiante_nombre.toLowerCase().includes(term) ||
        reservation.estudiante_email.toLowerCase().includes(term) ||
        reservation.espacio_nombre.toLowerCase().includes(term) ||
        reservation.espacio_codigo.toLowerCase().includes(term);
      return matchesStatus && matchesSearch;
    });
  }, [reservations, search, statusFilter]);

  const pendingCount = reservations.filter((item) => item.estado === 'pendiente').length;
  const approvedCount = reservations.filter(
    (item) => item.estado === 'aprobada' && item.estado_visual !== 'finalizada'
  ).length;

  return (
    <div className="space-y-6">
      <section className="flex flex-col gap-4 border-b border-[#D8EAE2] pb-5 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-[#469D89]">
            Control administrativo
          </p>
          <h1 className="mt-1 flex items-center gap-2 font-heading text-2xl font-extrabold text-[#123B38]">
            <HiCalendarDays className="h-6 w-6 text-[#358F80]" />
            Gestión de reservas
          </h1>
          <p className="mt-1 text-xs font-semibold text-[#52716B]">
            Consulta quién reservó cada espacio y administra las solicitudes.
          </p>
        </div>
        <div className="flex gap-2">
          <div className="rounded-2xl border border-[#D8EAE2] bg-white px-4 py-3">
            <p className="text-[10px] font-bold uppercase text-[#6A8881]">Pendientes</p>
            <p className="mt-1 text-xl font-extrabold text-amber-700">{pendingCount}</p>
          </div>
          <div className="rounded-2xl border border-[#D8EAE2] bg-white px-4 py-3">
            <p className="text-[10px] font-bold uppercase text-[#6A8881]">Aprobadas activas</p>
            <p className="mt-1 text-xl font-extrabold text-[#14746F]">{approvedCount}</p>
          </div>
        </div>
      </section>

      <section className="grid gap-3 rounded-[28px] border border-[#D8EAE2] bg-white p-4 md:grid-cols-[1fr_auto]">
        <label className="relative">
          <HiMagnifyingGlass className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#469D89]" />
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Buscar estudiante, correo, espacio o código…"
            className="h-11 w-full rounded-full border border-[#D8EAE2] bg-[#F4FAF7] pl-11 pr-4 text-xs font-semibold text-[#123B38] outline-none focus:border-[#358F80] focus:ring-4 focus:ring-[#99E2B4]/20"
          />
        </label>
        <select
          value={statusFilter}
          onChange={(event) => setStatusFilter(event.target.value)}
          className="h-11 rounded-full border border-[#D8EAE2] bg-[#F4FAF7] px-4 text-xs font-extrabold text-[#123B38] outline-none focus:border-[#358F80]"
        >
          {FILTERS.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
        </select>
      </section>

      <aside className="flex gap-3 rounded-2xl border border-[#99E2B4] bg-[#EAF6F0] p-4 text-xs text-[#123B38]">
        <HiInformationCircle className="h-5 w-5 shrink-0 text-[#248277]" />
        <div>
          <p className="font-extrabold">Disponibilidad automática por horario</p>
          <p className="mt-1 leading-5 text-[#52716B]">
            Una reserva bloquea únicamente su fecha y franja horaria. Al llegar su hora final se muestra como
            finalizada y el espacio vuelve a estar disponible automáticamente. El estado mantenimiento o cerrado
            sí bloquea todas las reservas hasta que un administrador lo cambie.
          </p>
        </div>
      </aside>

      <section className="overflow-hidden rounded-[28px] border border-[#D8EAE2] bg-white shadow-xs">
        {isLoading && (
          <div className="flex items-center justify-center gap-2 py-16 text-xs font-bold text-[#52716B]">
            <HiClock className="h-5 w-5 animate-spin" /> Cargando reservas…
          </div>
        )}
        {isError && (
          <div className="py-16 text-center">
            <HiCheckBadge className="mx-auto h-9 w-9 text-rose-500" />
            <p className="mt-2 text-sm font-extrabold text-[#123B38]">No se pudieron cargar las reservas</p>
          </div>
        )}
        {!isLoading && !isError && (
          <AdminReservationTable
            reservations={filteredReservations}
            updatingId={updatingId}
            onChangeStatus={(id, status) => updateStatus.mutate({ id, status })}
          />
        )}
      </section>
    </div>
  );
};
