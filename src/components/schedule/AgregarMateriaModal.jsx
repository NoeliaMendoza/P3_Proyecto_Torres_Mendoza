import { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { HiXMark, HiMagnifyingGlass, HiAcademicCap, HiExclamationTriangle, HiCheckCircle } from 'react-icons/hi2';
import {
  asignarNrcDocente,
  inscribirNrc,
  obtenerNrcsDisponibles,
  obtenerNrcsDisponiblesDocente,
} from '../../services/matriculas.services';

const DIAS = { 1: 'Lun', 2: 'Mar', 3: 'Mié', 4: 'Jue', 5: 'Vie' };

function hayChoque(horariosNuevos, horarioActual) {
  for (const n of Array.isArray(horariosNuevos) ? horariosNuevos : []) {
    if (!n?.dia_semana || !n?.hora_inicio || !n?.hora_fin) continue;
    for (const a of Array.isArray(horarioActual) ? horarioActual : []) {
      if (!a?.dia_semana || !a?.hora_inicio || !a?.hora_fin) continue;
      if (n.dia_semana === a.dia_semana &&
          n.hora_inicio < a.hora_fin &&
          n.hora_fin > a.hora_inicio) {
        return true;
      }
    }
  }
  return false;
}

const AgregarMateriaModal = ({ isOpen, onClose, horarioActual = [], rol = 'estudiante' }) => {
  const esDocente = rol === 'docente';
  const qc = useQueryClient();
  const [search, setSearch] = useState('');
  const [selectedNrc, setSelectedNrc] = useState(null);
  const [successMsg, setSuccessMsg] = useState('');

  const { data: disponibles = [], isLoading } = useQuery({
    queryKey: ['nrcs-disponibles', rol],
    queryFn: esDocente ? obtenerNrcsDisponiblesDocente : obtenerNrcsDisponibles,
    enabled: isOpen,
  });

  const mutation = useMutation({
    mutationFn: esDocente ? asignarNrcDocente : inscribirNrc,
    onSuccess: (data) => {
      setSuccessMsg(esDocente ? `Materia NRC ${data.nrc} asignada` : `Inscrito en NRC ${data.nrc}`);
      setSelectedNrc(null);
      qc.invalidateQueries({ queryKey: ['mi-horario'] });
      qc.invalidateQueries({ queryKey: ['nrcs-disponibles'] });
      setTimeout(() => { setSuccessMsg(''); onClose(); }, 1500);
    },
    onError: (err) => {
      const msg = err?.response?.data?.mensaje || 'Error al inscribir';
      setSuccessMsg(msg);
      setTimeout(() => setSuccessMsg(''), 3000);
    },
  });

  const filtrados = useMemo(() => {
    if (!search) return disponibles;
    const q = search.toLowerCase();
    return (Array.isArray(disponibles) ? disponibles : []).filter((n) =>
      n.asignatura?.toLowerCase().includes(q) ||
      n.codigo_asignatura?.toLowerCase().includes(q) ||
      n.nrc?.toString().includes(q) ||
      n.nivel_pao?.toString().toLowerCase().includes(q)
    );
  }, [disponibles, search]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-[32px] w-full max-w-lg max-h-[80vh] flex flex-col border border-[#D8EAE2] shadow-xl"
          >
            <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-[#D8EAE2]">
              <h2 className="text-base font-extrabold text-[#123B38] font-heading flex items-center gap-2">
                <HiAcademicCap className="w-5 h-5 text-[#358F80]" />
                {esDocente ? 'Colocar Materia' : 'Agregar Materia'}
              </h2>
              <button onClick={onClose} className="text-[#6A8881] hover:text-[#123B38] p-1">
                <HiXMark className="w-5 h-5" />
              </button>
            </div>

            {successMsg && (
              <div className={`px-6 py-3 text-xs font-bold flex items-center gap-2 ${
                successMsg.includes('choque') || successMsg.includes('Error')
                  ? 'bg-rose-50 text-rose-700'
                  : 'bg-[#EAF6F0] text-[#14746F]'
              }`}>
                <HiCheckCircle className="w-4 h-4 flex-shrink-0" />
                {successMsg}
              </div>
            )}

            <div className="px-6 py-3">
              <div className="relative">
                <HiMagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6A8881]" />
                <input
                  type="text"
                  placeholder="Buscar por materia, código o NRC..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs border border-[#D8EAE2] rounded-xl bg-[#F4FAF7] focus:outline-none focus:ring-2 focus:ring-[#358F80]/30 text-[#123B38] placeholder:text-[#6A8881]"
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto px-6 pb-6 space-y-2">
              {isLoading ? (
                <p className="text-xs text-[#52716B] text-center py-8 font-semibold">Cargando...</p>
              ) : filtrados.length === 0 ? (
                <p className="text-xs text-[#52716B] text-center py-8 font-semibold">
                  {search
                    ? 'Sin resultados'
                    : esDocente
                      ? 'No hay materias sin docente disponibles.'
                      : 'No hay materias disponibles para agregar.'}
                </p>
              ) : filtrados.map((n) => {
                const horarios = (Array.isArray(n.horarios) ? n.horarios : [])
                  .filter((h) => h?.dia_semana && h?.hora_inicio && h?.hora_fin);
                const choque = hayChoque(horarios, horarioActual);
                return (
                  <div
                    key={n.id}
                    className={`border rounded-xl p-3 transition-colors ${
                      choque ? 'border-rose-200 bg-rose-50/50' :
                      selectedNrc === n.id ? 'border-[#358F80] bg-[#EAF6F0]' : 'border-[#D8EAE2] hover:bg-[#F4FAF7]'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0 flex-1">
                        <p className="font-extrabold text-[11px] text-[#123B38] leading-tight">
                          {n.codigo_asignatura} — {n.asignatura}
                        </p>
                        <p className="text-[10px] text-[#52716B] font-semibold mt-0.5">
                          NRC {n.nrc} &bull; {n.nivel_pao} &bull; Paralelo {n.paralelo}
                        </p>
                        <p className="text-[10px] text-[#358F80] font-medium mt-0.5">
                          {n.docente || 'Sin docente'} &bull; {n.creditos} créditos
                        </p>
                        {horarios.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-1">
                            {horarios.map((h, i) => (
                              <span key={i} className="text-[9px] bg-white border border-[#D8EAE2] rounded-full px-2 py-0.5 font-semibold text-[#52716B]">
                                {DIAS[h.dia_semana]} {h.hora_inicio.slice(0,5)}-{h.hora_fin.slice(0,5)} {h.espacio || ''}
                              </span>
                            ))}
                          </div>
                        )}
                        {horarios.length === 0 && (
                          <p className="mt-1 text-[9px] font-semibold text-amber-700">
                            Horario todavía no definido
                          </p>
                        )}
                      </div>
                      <button
                        onClick={(e) => { e.stopPropagation(); mutation.mutate(n.id); }}
                        disabled={mutation.isPending || choque}
                        className={`flex-shrink-0 rounded-lg px-3 py-1.5 text-[10px] font-extrabold transition-colors disabled:opacity-50 ${
                          choque
                            ? 'bg-rose-100 text-rose-500 cursor-not-allowed'
                            : 'bg-[#358F80] text-white hover:bg-[#14746F]'
                        }`}
                        title={choque ? 'Choque de horarios con tu horario actual' : esDocente ? 'Colocar materia' : 'Agregar materia'}
                      >
                        {mutation.isPending ? '...' : choque ? 'Choque' : esDocente ? 'Colocar' : 'Agregar'}
                      </button>
                    </div>
                    {choque && (
                      <p className="flex items-center gap-1 mt-2 text-[10px] text-rose-600 font-bold">
                        <HiExclamationTriangle className="w-3.5 h-3.5" />
                        Esta materia choca con tu horario actual
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AgregarMateriaModal;
