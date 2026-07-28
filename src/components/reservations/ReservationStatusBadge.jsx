const STATUS_STYLES = {
  pendiente: 'bg-amber-100 text-amber-800',
  aprobada: 'bg-[#EAF6F0] text-[#14746F]',
  rechazada: 'bg-rose-100 text-rose-700',
  cancelada: 'bg-slate-100 text-slate-600',
  finalizada: 'bg-blue-100 text-blue-700',
};

const STATUS_LABELS = {
  pendiente: 'Pendiente',
  aprobada: 'Aprobada',
  rechazada: 'Rechazada',
  cancelada: 'Cancelada',
  finalizada: 'Finalizada',
};

export const ReservationStatusBadge = ({ status }) => (
  <span
    className={`inline-flex rounded-full px-3 py-1 text-[10px] font-extrabold ${
      STATUS_STYLES[status] || STATUS_STYLES.pendiente
    }`}
  >
    {STATUS_LABELS[status] || status}
  </span>
);
