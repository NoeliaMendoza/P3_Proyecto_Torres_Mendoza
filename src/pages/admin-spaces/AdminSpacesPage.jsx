import { useState } from 'react';
import { 
  HiShieldCheck, 
  HiPlus, 
  HiCheckCircle, 
  HiXCircle, 
  HiWrenchScrewdriver,
  HiPencilSquare
} from 'react-icons/hi2';
import { toast } from 'sonner';
import { useUIStore } from '../../store/uiStore';

export const AdminSpacesPages = () => {
  const { espacios } = useUIStore();
  const [spacesList, setSpacesList] = useState(espacios);

  const toggleEstado = (id) => {
    setSpacesList((prev) =>
      prev.map((e) => {
        if (e.id === id) {
          const nextEstado =
            e.estado === 'disponible'
              ? 'ocupado'
              : e.estado === 'ocupado'
              ? 'mantenimiento'
              : 'disponible';
          toast.info(`Estado actualizado para ${e.nombre}`, {
            description: `Nuevo estado: ${nextEstado.toUpperCase()}`
          });
          return { ...e, estado: nextEstado };
        }
        return e;
      })
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#D8EAE2] pb-5">
        <div>
          <h1 className="text-2xl font-extrabold text-[#123B38] font-heading flex items-center gap-2">
            <HiShieldCheck className="w-6 h-6 text-[#358F80]" />
            Administración de Espacios Académicos
          </h1>
          <p className="text-xs text-[#52716B] font-semibold mt-1">
            Panel de control administrativo para habilitar, inhabilitar o enviar a mantenimiento espacios del campus.
          </p>
        </div>

        <button
          onClick={() =>
            toast.info('Modo creación', {
              description: 'Formulario de alta de nuevo espacio institucional.'
            })
          }
          className="px-6 py-3 rounded-full bg-[#036666] hover:bg-[#358F80] text-white font-extrabold text-xs shadow-md flex items-center gap-2 transition-all shrink-0 self-start md:self-auto"
        >
          <HiPlus className="w-4 h-4 text-[#99E2B4]" />
          Añadir Nuevo Espacio
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-[32px] border border-[#D8EAE2] shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-[#123B38]">
            <thead className="bg-[#F4FAF7] border-b border-[#D8EAE2] font-extrabold uppercase tracking-wider text-[10px] text-[#52716B]">
              <tr>
                <th className="px-6 py-4">ID / Nombre del Espacio</th>
                <th className="px-6 py-4">Ubicación</th>
                <th className="px-6 py-4">Capacidad</th>
                <th className="px-6 py-4">Estado Actual</th>
                <th className="px-6 py-4 text-right">Acción Administrativa</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#D8EAE2]">
              {spacesList.map((e) => (
                <tr key={e.id} className="hover:bg-[#F4FAF7]/60 transition-colors">
                  <td className="px-6 py-4 font-bold text-[#123B38]">
                    <div className="flex items-center gap-3">
                      <span className="px-3 py-1 rounded-full text-[10px] font-extrabold bg-[#F4FAF7] text-[#248277] border border-[#D8EAE2]">
                        #{e.id}
                      </span>
                      <span className="font-extrabold text-[#123B38]">{e.nombre}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-[#52716B] font-semibold">{e.edificio}</td>
                  <td className="px-6 py-4 font-semibold">{e.capacidad} pers.</td>
                  <td className="px-6 py-4">
                    {e.estado === 'disponible' ? (
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[11px] font-extrabold bg-[#EAF6F0] text-[#358F80]">
                        <HiCheckCircle className="w-3.5 h-3.5" /> Disponible
                      </span>
                    ) : e.estado === 'ocupado' ? (
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[11px] font-extrabold bg-rose-100 text-rose-800">
                        <HiXCircle className="w-3.5 h-3.5" /> Reservado
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[11px] font-extrabold bg-amber-100 text-amber-800">
                        <HiWrenchScrewdriver className="w-3.5 h-3.5" /> Mantenimiento
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => toggleEstado(e.id)}
                      className="px-4 py-2 rounded-full text-xs font-extrabold bg-[#F4FAF7] hover:bg-[#358F80] hover:text-white transition-all inline-flex items-center gap-1.5 border border-[#D8EAE2]"
                    >
                      <HiPencilSquare className="w-4 h-4" />
                      Cambiar Estado
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
