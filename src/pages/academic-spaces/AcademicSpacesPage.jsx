import { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
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
import { SpaceCard } from '../../components/spaces/SpaceCard';
import { ReservationModal } from '../../components/spaces/ReservationModal';

export const AcademicSpacesPages = () => {
  const [searchParams] = useSearchParams();
  const initialSearch = searchParams.get('search') || '';

  const { espacios } = useUIStore();
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'table'
  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [selectedTipo, setSelectedTipo] = useState('todos');
  const [selectedEstado, setSelectedEstado] = useState('todos');

  const [selectedSpace, setSelectedSpace] = useState(null);
  const [modalReservationOpen, setModalReservationOpen] = useState(false);

  const filteredEspacios = useMemo(() => {
    return espacios.filter((e) => {
      const matchSearch =
        e.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        e.edificio.toLowerCase().includes(searchTerm.toLowerCase()) ||
        e.descripcion.toLowerCase().includes(searchTerm.toLowerCase());
      const matchTipo = selectedTipo === 'todos' || e.tipo === selectedTipo;
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
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#E0E4DC] pb-5">
        <div>
          <h1 className="text-2xl font-extrabold text-[#0F1A19] font-heading">
            Espacios Académicos
          </h1>
          <p className="text-xs text-[#586663] font-semibold mt-1">
            Consulta disponibilidad y reserva laboratorios, auditorios y salas de estudio del campus.
          </p>
        </div>

        {/* View mode pill toggle */}
        <div className="flex items-center gap-1.5 p-1 bg-[#E2E6DF] rounded-full shrink-0 self-start md:self-auto border border-[#E0E4DC]">
          <button
            onClick={() => setViewMode('grid')}
            className={`px-4 py-1.5 rounded-full text-xs font-extrabold flex items-center gap-1.5 transition-all ${
              viewMode === 'grid'
                ? 'bg-[#162E2B] text-white shadow-xs'
                : 'text-[#586663] hover:text-[#0F1A19]'
            }`}
          >
            <HiSquares2X2 className="w-4 h-4" /> Cuadrícula
          </button>
          <button
            onClick={() => setViewMode('table')}
            className={`px-4 py-1.5 rounded-full text-xs font-extrabold flex items-center gap-1.5 transition-all ${
              viewMode === 'table'
                ? 'bg-[#162E2B] text-white shadow-xs'
                : 'text-[#586663] hover:text-[#0F1A19]'
            }`}
          >
            <HiListBullet className="w-4 h-4" /> Tabla
          </button>
        </div>
      </div>

      {/* Search & Filters Bar */}
      <div className="p-4 rounded-[28px] bg-white border border-[#E0E4DC] shadow-xs grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
        {/* Search */}
        <div className="md:col-span-5 relative">
          <HiMagnifyingGlass className="w-4 h-4 text-[#586663] absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por nombre, edificio o equipamiento..."
            className="w-full pl-11 pr-4 py-2.5 bg-[#F2F4EF] border border-[#E0E4DC] rounded-full text-xs font-semibold text-[#0F1A19] focus:ring-2 focus:ring-[#008345]/30 focus:border-[#008345]"
          />
        </div>

        {/* Filter Tipo */}
        <div className="md:col-span-4 flex items-center gap-2">
          <HiFunnel className="w-4 h-4 text-[#586663] shrink-0" />
          <select
            value={selectedTipo}
            onChange={(e) => setSelectedTipo(e.target.value)}
            className="w-full px-4 py-2.5 bg-[#F2F4EF] border border-[#E0E4DC] rounded-full text-xs font-bold text-[#0F1A19] focus:ring-2 focus:ring-[#008345]/30 focus:border-[#008345]"
          >
            <option value="todos">Todos los Tipos</option>
            <option value="Laboratorio">Laboratorios</option>
            <option value="Auditorio">Auditorios</option>
            <option value="Aula">Aulas Inteligentes</option>
            <option value="Sala de Estudio">Salas de Estudio</option>
            <option value="Sala de Reuniones">Salas de Reuniones</option>
          </select>
        </div>

        {/* Filter Estado */}
        <div className="md:col-span-3">
          <select
            value={selectedEstado}
            onChange={(e) => setSelectedEstado(e.target.value)}
            className="w-full px-4 py-2.5 bg-[#F2F4EF] border border-[#E0E4DC] rounded-full text-xs font-bold text-[#0F1A19] focus:ring-2 focus:ring-[#008345]/30 focus:border-[#008345]"
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
        <div className="py-16 text-center bg-white rounded-[32px] border border-[#E0E4DC] p-8 space-y-3">
          <HiBuildingOffice2 className="w-12 h-12 text-[#8A9693] mx-auto" />
          <h3 className="text-base font-extrabold text-[#0F1A19]">No se encontraron espacios académicos</h3>
          <p className="text-xs text-[#586663] max-w-sm mx-auto font-semibold">
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
        <div className="bg-white rounded-[32px] border border-[#E0E4DC] shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-[#0F1A19]">
              <thead className="bg-[#F2F4EF] border-b border-[#E0E4DC] font-extrabold uppercase tracking-wider text-[10px] text-[#586663]">
                <tr>
                  <th className="px-6 py-4">Espacio / Ubicación</th>
                  <th className="px-6 py-4">Tipo</th>
                  <th className="px-6 py-4">Capacidad</th>
                  <th className="px-6 py-4">Horario</th>
                  <th className="px-6 py-4">Estado</th>
                  <th className="px-6 py-4 text-right">Acción</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E0E4DC]">
                {filteredEspacios.map((e) => (
                  <tr key={e.id} className="hover:bg-[#F2F4EF]/60 transition-colors">
                    <td className="px-6 py-4 font-bold text-[#0F1A19]">
                      <div className="flex items-center gap-3">
                        <img
                          src={e.imagen}
                          alt={e.nombre}
                          className="w-10 h-10 rounded-2xl object-cover border border-[#E0E4DC] shrink-0"
                        />
                        <div>
                          <p className="font-extrabold text-[#0F1A19] leading-tight">{e.nombre}</p>
                          <p className="text-[11px] text-[#586663] font-semibold">{e.edificio}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 rounded-full text-[11px] font-extrabold bg-[#F2F4EF] text-[#264743] border border-[#E0E4DC]">
                        {e.tipo}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-semibold">{e.capacidad} personas</td>
                    <td className="px-6 py-4 text-[#586663] font-semibold">{e.horario}</td>
                    <td className="px-6 py-4">
                      {e.estado === 'disponible' ? (
                        <span className="inline-flex items-center gap-1 text-[#008345] font-extrabold">
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
                            ? 'bg-[#162E2B] hover:bg-[#008345] text-white shadow-xs'
                            : 'bg-[#E0E4DC] text-[#8A9693] cursor-not-allowed'
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
