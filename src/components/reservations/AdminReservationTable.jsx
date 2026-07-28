import {
  HiCheck,
  HiNoSymbol,
  HiXMark,
} from 'react-icons/hi2';
import { ReservationStatusBadge } from './ReservationStatusBadge';

const formatDate = (value) =>
  new Intl.DateTimeFormat('es-EC', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(value));

const formatTime = (value = '') => value.slice(0, 5);

const ActionButton = ({ label, icon: Icon, onClick, disabled, className }) => (
  <button
    type="button"
    onClick={onClick}
    disabled={disabled}
    className={`inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-[10px] font-extrabold transition disabled:cursor-not-allowed disabled:opacity-45 ${className}`}
  >
    <Icon className="h-3.5 w-3.5" />
    {label}
  </button>
);

export const AdminReservationTable = ({ reservations, updatingId, onChangeStatus }) => {
  if (!reservations.length) {
    return (
      <div className="py-14 text-center">
        <p className="font-heading text-base font-extrabold text-[#123B38]">No hay reservas para mostrar</p>
        <p className="mt-1 text-xs text-[#52716B]">Ajusta los filtros o espera una nueva solicitud.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[980px] text-left text-xs">
        <thead className="border-b border-[#D8EAE2] bg-[#F4FAF7] text-[10px] uppercase tracking-wider text-[#52716B]">
          <tr>
            <th className="px-5 py-4">Estudiante</th>
            <th className="px-5 py-4">Espacio</th>
            <th className="px-5 py-4">Fecha y horario</th>
            <th className="px-5 py-4">Motivo</th>
            <th className="px-5 py-4">Estado</th>
            <th className="px-5 py-4 text-right">Acciones</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[#D8EAE2]">
          {reservations.map((reservation) => {
            const status = reservation.estado_visual || reservation.estado;
            const finished = status === 'finalizada';
            const busy = updatingId === reservation.id;
            return (
              <tr key={reservation.id} className="align-top transition hover:bg-[#F4FAF7]/70">
                <td className="px-5 py-4">
                  <p className="font-extrabold text-[#123B38]">{reservation.estudiante_nombre}</p>
                  <p className="mt-1 text-[11px] text-[#52716B]">{reservation.estudiante_email}</p>
                </td>
                <td className="px-5 py-4">
                  <p className="font-extrabold text-[#123B38]">{reservation.espacio_nombre}</p>
                  <p className="mt-1 text-[11px] text-[#52716B]">
                    {reservation.espacio_codigo} · {reservation.espacio_edificio || 'Sin edificio'}
                  </p>
                </td>
                <td className="whitespace-nowrap px-5 py-4 font-semibold text-[#123B38]">
                  <p>{formatDate(reservation.fecha)}</p>
                  <p className="mt-1 text-[11px] text-[#52716B]">
                    {formatTime(reservation.hora_inicio)}–{formatTime(reservation.hora_fin)}
                  </p>
                </td>
                <td className="max-w-56 px-5 py-4 text-[#52716B]">
                  <p className="line-clamp-3">{reservation.motivo || 'Sin motivo registrado'}</p>
                </td>
                <td className="px-5 py-4">
                  <ReservationStatusBadge status={status} />
                </td>
                <td className="px-5 py-4">
                  <div className="flex justify-end gap-1.5">
                    {reservation.estado === 'pendiente' && !finished && (
                      <>
                        <ActionButton
                          label="Aprobar"
                          icon={HiCheck}
                          disabled={busy}
                          onClick={() => onChangeStatus(reservation.id, 'aprobada')}
                          className="bg-[#358F80] text-white hover:bg-[#14746F]"
                        />
                        <ActionButton
                          label="Rechazar"
                          icon={HiXMark}
                          disabled={busy}
                          onClick={() => onChangeStatus(reservation.id, 'rechazada')}
                          className="bg-rose-100 text-rose-700 hover:bg-rose-200"
                        />
                      </>
                    )}
                    {reservation.estado === 'aprobada' && !finished && (
                      <ActionButton
                        label="Cancelar"
                        icon={HiNoSymbol}
                        disabled={busy}
                        onClick={() => onChangeStatus(reservation.id, 'cancelada')}
                        className="bg-slate-100 text-slate-700 hover:bg-slate-200"
                      />
                    )}
                    {(finished || ['rechazada', 'cancelada'].includes(reservation.estado)) && (
                      <span className="text-[10px] font-semibold text-[#6A8881]">Sin acciones pendientes</span>
                    )}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
