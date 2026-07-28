import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
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
import { obtenerEspacios } from '../../services/espacios.services';
import api from '../../api/axios';

export const AdminSpacesPages = () => {
  const queryClient = useQueryClient();
  const { setEspacios } = useUIStore();
  const { data: espacios = [], isLoading } = useQuery({
    queryKey: ['espacios'],
    queryFn: obtenerEspacios,
    staleTime: 30000,
  });
  useEffect(() => { if (espacios.length > 0) setEspacios(espacios); }, [espacios, setEspacios]);

  const mutation = useMutation({
    mutationFn: async ({ id, estado }) => {
      const r = await api.patch(`/espacios/${id}/estado`, { estado });
      return r.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['espacios'] });
      toast.success('Estado actualizado correctamente');
    },
    onError: (err) => {
      toast.error('Error al actualizar estado', {
        description: err.response?.data?.mensaje || 'Intenta nuevamente.',
      });
    },
  });

  const toggleEstado = (id, currentEstado) => {
    const nextEstado = currentEstado === 'disponible' ? 'mantenimiento' : 'disponible';
    mutation.mutate({ id, estado: nextEstado });
  };

  return (
    <div className="space-y-6">
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
      </div>

      {isLoading ? (
        <div className="py-16 text-center">
          <p className="text-sm text-[#52716B] font-semibold">Cargando espacios...</p>
        </div>
      ) : (
        <div className="bg-white rounded-[32px] border border-[#D8EAE2] shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-[#123B38]">
              <thead className="bg-[#F4FAF7] border-b border-[#D8EAE2] font-extrabold uppercase tracking-wider text-[10px] text-[#52716B]">
                <tr>
                  <th className="px-6 py-4">Código / Nombre del Espacio</th>
                  <th className="px-6 py-4">Ubicación</th>
                  <th className="px-6 py-4">Capacidad</th>
                  <th className="px-6 py-4">Estado Actual</th>
                  <th className="px-6 py-4 text-right">Acción Administrativa</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#D8EAE2]">
                {espacios.map((e) => (
                  <tr key={e.id} className="hover:bg-[#F4FAF7]/60 transition-colors">
                    <td className="px-6 py-4 font-bold text-[#123B38]">
                      <div className="flex items-center gap-3">
                        <span className="px-3 py-1 rounded-full text-[10px] font-extrabold bg-[#F4FAF7] text-[#248277] border border-[#D8EAE2]">
                          {e.codigo}
                        </span>
                        <span className="font-extrabold text-[#123B38]">{e.nombre}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-[#52716B] font-semibold">{e.edificio} {e.piso ? `- Piso ${e.piso}` : ''}</td>
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
                        onClick={() => toggleEstado(e.id, e.estado)}
                        disabled={mutation.isPending}
                        className="px-4 py-2 rounded-full text-xs font-extrabold bg-[#F4FAF7] hover:bg-[#358F80] hover:text-white transition-all inline-flex items-center gap-1.5 border border-[#D8EAE2] disabled:opacity-50"
                      >
                        <HiPencilSquare className="w-4 h-4" />
                        {e.estado === 'disponible' ? 'Enviar a Mantenimiento' : 'Habilitar'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};