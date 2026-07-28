import { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { 
  HiBuildingOffice2, 
  HiMagnifyingGlass, 
  HiSquares2X2, 
  HiListBullet, 
  HiFunnel, 
  HiCheckCircle,
  HiXCircle,
  HiWrenchScrewdriver
} from 'react-icons/hi2';
import { useUIStore } from '../../store/uiStore';
import { obtenerEspacios } from '../../services/espacios.services';
import { SpaceCard } from '../../components/spaces/SpaceCard';
import { ReservationModal } from '../../components/spaces/ReservationModal';

export const AcademicSpacesPages = () => {
  const [searchParams] = useSearchParams();
  const initialSearch = searchParams.get('search') || '';

  const { espacios, setEspacios } = useUIStore();
  const { data: espaciosAPI, isLoading } = useQuery({
    queryKey: ['espacios'],
    queryFn: obtenerEspacios,
    staleTime: 60000,
  });
  useEffect(() => { if (espaciosAPI) setEspacios(espaciosAPI); }, [espaciosAPI, setEspacios]);

  const [viewMode, setViewMode] = useState('grid');
  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [selectedTipo, setSelectedTipo] = useState('todos');
  const [selectedEstado, setSelectedEstado] = useState('todos');

  const [selectedSpace, setSelectedSpace] = useState(null);
  const [modalReservationOpen, setModalReservationOpen] = useState(false);

  const filteredEspacios = useMemo(() => {
    return espacios.filter((e) => {
      const matchSearch =
        (e.nombre || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (e.codigo || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (e.edificio || '').toLowerCase().includes(searchTerm.toLowerCase());
      const matchTipo = selectedTipo === 'todos' || (e.tipo_espacio || '') === selectedTipo;
      const matchEstado = selectedEstado === 'todos' || e.estado === selectedEstado;
      return matchSearch && matchTipo && matchEstado;
    });
  }, [espacios, searchTerm, selectedTipo, selectedEstado]);

  const handleReservar = (espacio) => {
    setSelectedSpace(espacio);
    setModalReservationOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Header Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#D8EAE2] pb-5">
        <div>
          <h1 className="text-2xl font-extrabold text-[#123B38] font-heading">
            Espacios Académicos
          </h1>
          <p className="text-xs text-[#52716B] font-semibold mt-1">
            Consulta disponibilidad y reserva laboratorios, auditorios y salas de estudio del campus.
          </p>
        </div>

        {/* View mode pill toggle */}
        <div className="flex items-center gap-1.5 p-1 bg-[#E1F1E9] rounded-full shrink-0 self-start md:self-auto border border-[#D8EAE2]">
          <button
            onClick={() => setViewMode('grid')}
            className={`px-4 py-1.5 rounded-full text-xs font-extrabold flex items-center gap-1.5 transition-all ${
              viewMode === 'grid'
                ? 'bg-[#036666] text-white shadow-xs'
                : 'text-[#52716B] hover:text-[#123B38]'
            }`}
          >
            <HiSquares2X2 className="w-4 h-4" /> Cuadrícula
          </button>
          <button
            onClick={() => setViewMode('table')}
            className={`px-4 py-1.5 rounded-full text-xs font-extrabold flex items-center gap-1.5 transition-all ${
              viewMode === 'table'
                ? 'bg-[#036666] text-white shadow-xs'
                : 'text-[#52716B] hover:text-[#123B38]'
            }`}
          >
            <HiListBullet className="w-4 h-4" /> Tabla
          </button>
        </div>
      </div>

      {/* Search & Filters Bar */}
      <div className="p-4 rounded-[28px] bg-white border border-[#D8EAE2] shadow-xs grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
        {/* Search */}
        <div className="md:col-span-5 relative">
          <HiMagnifyingGlass className="w-4 h-4 text-[#52716B] absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por nombre, edificio o equipamiento..."
            className="w-full pl-11 pr-4 py-2.5 bg-[#F4FAF7] border border-[#D8EAE2] rounded-full text-xs font-semibold text-[#123B38] focus:ring-2 focus:ring-[#358F80]/30 focus:border-[#358F80]"
          />
        </div>

        {/* Filter Tipo */}
        <div className="md:col-span-4 flex items-center gap-2">
          <HiFunnel className="w-4 h-4 text-[#52716B] shrink-0" />
          <select
            value={selectedTipo}
            onChange={(e) => setSelectedTipo(e.target.value)}
            className="w-full px-4 py-2.5 bg-[#F4FAF7] border border-[#D8EAE2] rounded-full text-xs font-bold text-[#123B38] focus:ring-2 focus:ring-[#358F80]/30 focus:border-[#358F80]"
          >
            <option value="todos">Todos los Tipos</option>
            <option value="Aula">Aulas</option>
            <option value="Laboratorio">Laboratorios</option>
            <option value="Virtual">Virtual</option>
          </select>
        </div>

        {/* Filter Estado */}
        <div className="md:col-span-3">
          <select
            value={selectedEstado}
            onChange={(e) => setSelectedEstado(e.target.value)}
            className="w-full px-4 py-2.5 bg-[#F4FAF7] border border-[#D8EAE2] rounded-full text-xs font-bold text-[#123B38] focus:ring-2 focus:ring-[#358F80]/30 focus:border-[#358F80]"
          >
            <option value="todos">Todos los Estados</option>
            <option value="disponible">Solo Disponibles</option>
            <option value="ocupado">Reservados</option>
            <option value="mantenimiento">En Mantenimiento</option>
          </select>
        </div>
      </div>

      {/* Grid or Table Display */}
      {filteredEspacios.length === 0 ? (
        <div className="py-16 text-center bg-white rounded-[32px] border border-[#D8EAE2] p-8 space-y-3">
          <HiBuildingOffice2 className="w-12 h-12 text-[#6A8881] mx-auto" />
          <h3 className="text-base font-extrabold text-[#123B38]">No se encontraron espacios académicos</h3>
          <p className="text-xs text-[#52716B] max-w-sm mx-auto font-semibold">
            Intenta ajustar los criterios de búsqueda o limpia los filtros seleccionados.
          </p>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEspacios.map((e) => (
            <SpaceCard key={e.id} espacio={e} onReservar={handleReservar} />
          ))}
        </div>
      ) : (
        /* Table View */
        <div className="bg-white rounded-[32px] border border-[#D8EAE2] shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-[#123B38]">
              <thead className="bg-[#F4FAF7] border-b border-[#D8EAE2] font-extrabold uppercase tracking-wider text-[10px] text-[#52716B]">
                <tr>
                  <th className="px-6 py-4">Código / Espacio</th>
                  <th className="px-6 py-4">Tipo</th>
                  <th className="px-6 py-4">Ubicación</th>
                  <th className="px-6 py-4">Capacidad</th>
                  <th className="px-6 py-4">Estado</th>
                  <th className="px-6 py-4 text-right">Acción</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#D8EAE2]">
                {filteredEspacios.map((e) => (
                  <tr key={e.id} className="hover:bg-[#F4FAF7]/60 transition-colors">
                    <td className="px-6 py-4 font-bold text-[#123B38]">
                      <div className="flex items-center gap-3">
                        <span className="px-3 py-1 rounded-full text-[10px] font-extrabold bg-[#F4FAF7] text-[#248277] border border-[#D8EAE2]">
                          {e.codigo}
                        </span>
                        <span className="font-extrabold">{e.nombre}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 rounded-full text-[11px] font-extrabold bg-[#F4FAF7] text-[#248277] border border-[#D8EAE2]">
                        {e.tipo_espacio}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-[#52716B] font-semibold">{e.edificio} {e.piso ? `Piso ${e.piso}` : ''}</td>
                    <td className="px-6 py-4 font-semibold">{e.capacidad} pers.</td>
                    <td className="px-6 py-4">
                      {e.estado === 'disponible' ? (
                        <span className="inline-flex items-center gap-1 text-[#358F80] font-extrabold">
                          <HiCheckCircle className="w-4 h-4" /> Disponible
                        </span>
                      ) : e.estado === 'ocupado' ? (
                        <span className="inline-flex items-center gap-1 text-rose-600 font-extrabold">
                          <HiXCircle className="w-4 h-4" /> Reservado
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-amber-600 font-extrabold">
                          <HiWrenchScrewdriver className="w-4 h-4" /> Mantenimiento
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleReservar(e)}
                        disabled={e.estado !== 'disponible'}
                        className={`px-5 py-2 rounded-full text-xs font-extrabold transition-all ${
                          e.estado === 'disponible'
                            ? 'bg-[#036666] hover:bg-[#358F80] text-white shadow-xs'
                            : 'bg-[#D8EAE2] text-[#6A8881] cursor-not-allowed'
                        }`}
                      >
                        Reservar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Reservation Modal */}
      <ReservationModal
        espacio={selectedSpace}
        isOpen={modalReservationOpen}
        onClose={() => setModalReservationOpen(false)}
      />
    </div>
  );
};
