import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { HiClock, HiPlusCircle } from 'react-icons/hi2';
import { useAuthStore } from '../../store/authStore';
import api from '../../api/axios';
import AgregarMateriaModal from '../../components/schedule/AgregarMateriaModal';

const DIAS = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'];
const BLOQUES = [
  { inicio: '07:00', fin: '09:00' },
  { inicio: '09:00', fin: '11:00' },
  { inicio: '11:00', fin: '13:00' },
  { inicio: '13:00', fin: '15:00' },
  { inicio: '15:00', fin: '17:00' },
];

const obtenerMiHorario = async () => (await api.get('/horarios/mi-horario')).data;

const SchedulePage = () => {
  const usuario = useAuthStore((s) => s.usuario);
  const contexto = useAuthStore((s) => s.contexto);
  const esEstudiante = usuario?.rol === 'estudiante';
  const esDocente = usuario?.rol === 'docente';
  const [showAgregar, setShowAgregar] = useState(false);
  const { data: horario = [], isLoading } = useQuery({
    queryKey: ['mi-horario'],
    queryFn: obtenerMiHorario,
    staleTime: 30000,
  });

  return (
    <div className="space-y-6">
      <div className="border-b border-[#D8EAE2] pb-5">
        <h1 className="text-2xl font-extrabold text-[#123B38] font-heading flex items-center gap-2">
          <HiClock className="w-6 h-6 text-[#358F80]" />
          {esDocente ? 'Mi Horario Docente' : 'Mi Horario'}
        </h1>
        <p className="text-xs text-[#52716B] font-semibold mt-1">
          {contexto?.carrera?.nombre || 'Tecnología de la Información'} &bull; {contexto?.periodo?.nombre || 'Periodo 202650'} &bull; Sede Santo Domingo
        </p>
        {(esEstudiante || esDocente) && (
          <button
            onClick={() => setShowAgregar(true)}
            className="mt-3 flex items-center gap-1.5 bg-[#358F80] text-white rounded-xl px-4 py-2 text-[11px] font-extrabold hover:bg-[#14746F] transition-colors"
          >
            <HiPlusCircle className="w-4 h-4" />
            {esDocente ? 'Colocar Materia' : 'Agregar Materia'}
          </button>
        )}
      </div>

      {isLoading ? (
        <div className="py-16 text-center text-sm text-[#52716B] font-semibold">Cargando horario...</div>
      ) : horario.length === 0 ? (
        <div className="py-16 text-center bg-white rounded-[32px] border border-[#D8EAE2] p-8">
          <HiClock className="w-12 h-12 text-[#6A8881] mx-auto" />
          <h3 className="text-base font-extrabold text-[#123B38] mt-3">No hay horario disponible</h3>
          <p className="text-xs text-[#52716B] font-semibold mt-1">
            {esDocente
              ? 'No tienes materias asignadas o un periodo académico activo.'
              : 'No tienes asignaturas matriculadas o un periodo activo asignado.'}
          </p>
        </div>
      ) : (<>
          <div className="hidden sm:block bg-white rounded-[32px] border border-[#D8EAE2] shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-[#123B38]">
              <thead className="bg-[#F4FAF7] border-b border-[#D8EAE2] font-extrabold uppercase tracking-wider text-[10px] text-[#52716B]">
                <tr>
                  <th className="px-4 py-3 w-20">Hora</th>
                  {DIAS.map(d => (
                    <th key={d} className="px-4 py-3 text-center">{d}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#D8EAE2]">
                {BLOQUES.map((bloque) => (
                  <tr key={bloque.inicio} className="hover:bg-[#F4FAF7]/40">
                    <td className="px-4 py-5 font-extrabold text-[#358F80] whitespace-nowrap text-center">
                      {bloque.inicio}<br /><span className="text-[#6A8881] font-medium">│</span><br />{bloque.fin}
                    </td>
                    {DIAS.map((_, diaIdx) => {
                      const diaNum = diaIdx + 1;
                      const clase = horario.find(h =>
                        h.dia_semana === diaNum &&
                        h.hora_inicio.slice(0, 5) === bloque.inicio &&
                        h.hora_fin.slice(0, 5) === bloque.fin
                      );
                      return (
                        <td key={diaIdx} className="px-2 py-2 text-center align-top">
                          {clase && (
                            <div className="bg-[#EAF6F0] rounded-xl p-3 border border-[#358F80]/20 h-full min-h-[72px] flex flex-col justify-center">
                              <p className="font-extrabold text-[11px] text-[#123B38] leading-tight">
                                {clase.asignatura_codigo}
                              </p>
                              <p className="text-[10px] text-[#52716B] font-semibold leading-tight mt-0.5">
                                {clase.asignatura}
                              </p>
                              <p className="text-[10px] text-[#358F80] font-bold mt-1">
                                {clase.codigo_espacio}
                              </p>
                              <p className="text-[8px] text-[#6A8881] font-medium mt-0.5">
                                {clase.docente}
                              </p>
                            </div>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="sm:hidden space-y-4">
          {DIAS.map((dia, diaIdx) => {
            const diaNum = diaIdx + 1;
            const clasesDelDia = horario.filter(h => h.dia_semana === diaNum);
            if (clasesDelDia.length === 0) return null;
            return (
              <div key={dia} className="bg-white rounded-3xl border border-[#D8EAE2] shadow-xs overflow-hidden">
                <div className="bg-[#036666] px-4 py-3">
                  <h3 className="text-sm font-extrabold text-white">{dia}</h3>
                </div>
                <div className="divide-y divide-[#D8EAE2]">
                  {clasesDelDia.map((clase, idx) => (
                    <div key={idx} className="p-4 space-y-1.5">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-extrabold text-[#123B38]">{clase.asignatura_codigo}</span>
                        <span className="text-[10px] font-bold text-[#358F80] whitespace-nowrap">
                          {clase.hora_inicio.slice(0, 5)} - {clase.hora_fin.slice(0, 5)}
                        </span>
                      </div>
                      <p className="text-[11px] text-[#52716B] font-semibold">{clase.asignatura}</p>
                      <div className="flex items-center gap-3 text-[10px] text-[#6A8881] font-medium">
                        <span>{clase.codigo_espacio}</span>
                        {clase.docente && <span>&middot; {clase.docente}</span>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
        </>
      )}
      {(esEstudiante || esDocente) && (
        <AgregarMateriaModal
          isOpen={showAgregar}
          onClose={() => setShowAgregar(false)}
          horarioActual={horario}
          rol={usuario?.rol}
        />
      )}
    </div>
  );
};

export default SchedulePage;
