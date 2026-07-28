import { useState, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  HiXMark, 
  HiCalendar, 
  HiClock, 
  HiAcademicCap, 
  HiBuildingOffice2, 
  HiCheckCircle,
  HiUsers,
  HiExclamationTriangle
} from 'react-icons/hi2';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import { reservarEspacio } from '../../services/espacios.services';
import api from '../../api/axios';

const DIAS_MAP = { 0: null, 1: 1, 2: 2, 3: 3, 4: 4, 5: 5, 6: null };

const obtenerDisponibilidad = async (id) => (await api.get(`/espacios/${id}/disponibilidad`)).data;

export const ReservationModal = ({ espacio, isOpen, onClose }) => {
  const [fechaSel, setFechaSel] = useState(new Date().toISOString().split('T')[0]);
  const { register, handleSubmit, formState: { errors, isSubmitting }, reset, watch } = useForm({
    defaultValues: {
      fecha: new Date().toISOString().split('T')[0],
      horario: '14:00 - 16:00',
      motivo: ''
    }
  });

  const { data: disponibilidad } = useQuery({
    queryKey: ['disponibilidad', espacio?.id],
    queryFn: () => obtenerDisponibilidad(espacio.id),
    enabled: isOpen && !!espacio?.id,
  });

  const fechaWatch = watch('fecha');
  const horarioWatch = watch('horario');

  const diaSemana = useMemo(() => {
    if (!fechaWatch) return null;
    const d = new Date(fechaWatch + 'T12:00:00').getDay();
    return DIAS_MAP[d];
  }, [fechaWatch]);

  const [horaInicio, horaFin] = horarioWatch ? horarioWatch.split(' - ') : ['', ''];

  const ocupado = useMemo(() => {
    if (!diaSemana || !disponibilidad?.horarios) return false;
    return disponibilidad.horarios.some((h) =>
      h.dia_semana === diaSemana &&
      h.hora_inicio.slice(0, 5) === horaInicio &&
      h.hora_fin.slice(0, 5) === horaFin
    );
  }, [diaSemana, horaInicio, horaFin, disponibilidad]);

  const clasesEnFranja = useMemo(() => {
    if (!diaSemana || !disponibilidad?.horarios) return [];
    return disponibilidad.horarios.filter((h) =>
      h.dia_semana === diaSemana &&
      h.hora_inicio.slice(0, 5) === horaInicio &&
      h.hora_fin.slice(0, 5) === horaFin
    );
  }, [diaSemana, horaInicio, horaFin, disponibilidad]);

  if (!isOpen || !espacio) return null;

  const onSubmit = async (data) => {
    try {
      const result = await reservarEspacio({
        espacioId: espacio.id,
        espacioNombre: espacio.nombre,
        ...data
      });
      toast.success(result.queued ? 'Reserva guardada sin conexión' : '¡Reserva solicitada con éxito!', {
        description: result.queued
          ? 'Se enviará automáticamente cuando recuperes la conexión.'
          : `Tu espacio ${espacio.nombre} ha sido solicitado para el ${data.fecha} (${data.horario}). Pendiente de aprobación.`
      });
      reset();
      onClose();
    } catch (err) {
      toast.error('Error al procesar la reserva', {
        description: err.response?.data?.mensaje || 'Por favor intenta nuevamente.'
      });
    }
  };

  const horariosDisponibles = [
    '07:00 - 09:00',
    '09:00 - 11:00',
    '11:00 - 13:00',
    '13:00 - 15:00',
    '15:00 - 17:00'
  ];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-[#024E50]/70 backdrop-blur-xs"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="relative bg-white rounded-[32px] shadow-2xl border border-[#D8EAE2] w-full max-w-lg overflow-hidden z-10"
        >
          {/* Header Banner */}
          <div className="bg-[#036666] p-6 text-white relative">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
              aria-label="Cerrar modal"
            >
              <HiXMark className="w-5 h-5" />
            </button>
            <span className="inline-block px-3 py-1 rounded-full text-[10px] font-extrabold bg-[#358F80]/30 text-[#99E2B4] border border-[#358F80]/40 uppercase tracking-wider mb-2">
              Confirmar Reserva de Espacio
            </span>
            <h2 className="text-xl font-extrabold pr-6 leading-tight font-heading">{espacio.nombre}</h2>
            <div className="flex items-center gap-4 text-xs text-[#C8E8D7] font-semibold mt-2">
              <span className="flex items-center gap-1">
                <HiBuildingOffice2 className="w-4 h-4 text-[#99E2B4]" /> {espacio.edificio}
              </span>
              <span className="flex items-center gap-1">
                <HiUsers className="w-4 h-4 text-[#99E2B4]" /> {espacio.capacidad} personas
              </span>
            </div>
          </div>

          {/* Form Content */}
          <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
            {/* Date Field */}
            <div>
              <label className="block text-xs font-bold text-[#123B38] mb-1.5 flex items-center gap-1.5">
                <HiCalendar className="w-4 h-4 text-[#358F80]" />
                Fecha de Reserva
              </label>
              <input
                type="date"
                min={new Date().toISOString().split('T')[0]}
                {...register('fecha', { required: 'La fecha es obligatoria' })}
                onChange={(e) => setFechaSel(e.target.value)}
                className="w-full px-4 py-2.5 bg-[#F4FAF7] border border-[#D8EAE2] rounded-2xl text-xs font-bold text-[#123B38] focus:outline-none focus:ring-2 focus:ring-[#358F80]/30 focus:border-[#358F80]"
              />
              {errors.fecha && (
                <p className="text-[11px] text-rose-500 mt-1 font-semibold">{errors.fecha.message}</p>
              )}
            </div>

            {/* Time Slot Select */}
            <div>
              <label className="block text-xs font-bold text-[#123B38] mb-1.5 flex items-center gap-1.5">
                <HiClock className="w-4 h-4 text-[#358F80]" />
                Franja Horaria
              </label>
              <div className="space-y-1.5">
                {horariosDisponibles.map((h) => {
                  const [hi, hf] = h.split(' - ');
                  const ocup = disponibilidad?.horarios?.some((h2) =>
                    h2.dia_semana === diaSemana &&
                    h2.hora_inicio.slice(0, 5) === hi &&
                    h2.hora_fin.slice(0, 5) === hf
                  );
                  return (
                    <label
                      key={h}
                      className={`flex items-center gap-3 px-4 py-2.5 rounded-2xl border text-xs font-bold cursor-pointer transition-colors ${
                        horarioWatch === h
                          ? ocup
                            ? 'border-rose-300 bg-rose-50 text-rose-700'
                            : 'border-[#358F80] bg-[#EAF6F0] text-[#123B38]'
                          : ocup
                            ? 'border-[#E8D8D8] bg-[#FDF5F5] text-[#6A8881] line-through'
                            : 'border-[#D8EAE2] bg-[#F4FAF7] text-[#123B38] hover:bg-[#EAF6F0]'
                      }`}
                    >
                      <input
                        type="radio"
                        value={h}
                        disabled={ocup}
                        {...register('horario', { required: 'Seleccione un horario' })}
                        className="accent-[#358F80]"
                      />
                      <span className="flex-1">{h}</span>
                      {ocup && (
                        <span className="flex items-center gap-1 text-[10px] text-rose-500 font-extrabold">
                          <HiExclamationTriangle className="w-3.5 h-3.5" />
                          Ocupado
                        </span>
                      )}
                    </label>
                  );
                })}
              </div>
            </div>

            {ocupado && (
              <div className="bg-rose-50 border border-rose-200 rounded-2xl p-3">
                <p className="text-[11px] font-bold text-rose-700 flex items-center gap-1.5">
                  <HiExclamationTriangle className="w-4 h-4" />
                  Este espacio tiene clases en este horario
                </p>
                <div className="mt-1.5 space-y-1">
                  {clasesEnFranja.map((c, i) => (
                    <p key={i} className="text-[10px] text-rose-600 font-semibold">
                      {c.asignatura} — {c.docente}
                    </p>
                  ))}
                </div>
                <Link
                  to={`/horarios`}
                  className="mt-2 inline-flex items-center gap-1 text-[10px] font-extrabold text-[#14746F] hover:underline"
                >
                  <HiClock className="w-3 h-3" />
                  Ver horario general
                </Link>
              </div>
            )}

            {/* Motivo Area */}
            <div>
              <label className="block text-xs font-bold text-[#123B38] mb-1.5 flex items-center gap-1.5">
                <HiAcademicCap className="w-4 h-4 text-[#358F80]" />
                Propósito de Uso Académico
              </label>
              <textarea
                rows={3}
                placeholder="Ejemplo: Preparación de proyecto final de software web, estudio grupal..."
                {...register('motivo', { 
                  required: 'Indique el propósito académico', 
                  minLength: { value: 10, message: 'Describa al menos 10 caracteres' } 
                })}
                className="w-full px-4 py-2.5 bg-[#F4FAF7] border border-[#D8EAE2] rounded-2xl text-xs font-semibold text-[#123B38] placeholder-[#6A8881] focus:outline-none focus:ring-2 focus:ring-[#358F80]/30 focus:border-[#358F80] resize-none"
              />
              {errors.motivo && (
                <p className="text-[11px] text-rose-500 mt-1 font-semibold">{errors.motivo.message}</p>
              )}
            </div>

            {/* Footer buttons */}
            <div className="pt-4 border-t border-[#D8EAE2] flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 rounded-full text-xs font-extrabold text-[#52716B] hover:bg-[#F4FAF7] transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2.5 rounded-full text-xs font-extrabold bg-[#358F80] hover:bg-[#14746F] text-white shadow-md shadow-[#358F80]/20 flex items-center gap-2 transition-all"
              >
                <HiCheckCircle className="w-4 h-4" />
                {isSubmitting ? 'Confirmando...' : 'Confirmar Reserva'}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
