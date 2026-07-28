import { useState, useMemo, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { 
  HiMagnifyingGlass, 
  HiPlus, 
  HiTag, 
  HiFunnel, 
  HiCheckBadge, 
  HiExclamationTriangle,
  HiInboxStack
} from 'react-icons/hi2';
import { useUIStore } from '../../store/uiStore';
import { obtenerObjetos } from '../../services/objetos.services';
import { LostFoundCard } from '../../components/lostFound/LostFoundCard';
import { PublishObjectModal } from '../../components/lostFound/PublishObjectModal';
import { ObjectDetailModal } from '../../components/lostFound/ObjectDetailModal';

const mapearObjeto = (api) => ({
  id: api.id,
  nombre: api.titulo,
  descripcion: api.descripcion,
  tipo: api.tipo,
  lugar: api.ubicacion || 'No especificada',
  fecha: api.fecha_evento || 'Sin fecha',
  categoria: api.categoria_nombre || 'Sin categoría',
  imagen: Array.isArray(api.imagenes_url) && api.imagenes_url.length > 0 ? api.imagenes_url[0] : 'https://placehold.co/600x400/036666/99E2B4?text=ESPEConnect',
  estado: api.estado,
  reportante_nombre: api.reportante_nombre || 'Anónimo',
  reportante_contacto: api.informacion_contacto || 'No disponible',
  es_reclamado: api.es_reclamado,
  id_categoria: api.id_categoria,
});

export const LostObjectsPages = () => {
  const { objetos, setObjetos } = useUIStore();

  const { data: objetosAPI } = useQuery({
    queryKey: ['objetos'],
    queryFn: obtenerObjetos,
    staleTime: 30000,
  });

  useEffect(() => {
    if (objetosAPI) setObjetos(objetosAPI.map(mapearObjeto));
  }, [objetosAPI, setObjetos]);

  const [activeTab, setActiveTab] = useState('todos'); // 'todos' | 'perdidos' | 'encontrados'
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategoria, setSelectedCategoria] = useState('todas');

  const [modalPublishOpen, setModalPublishOpen] = useState(false);
  const [selectedObject, setSelectedObject] = useState(null);
  const [modalDetailOpen, setModalDetailOpen] = useState(false);

  const filteredObjetos = useMemo(() => {
    return objetos.filter((o) => {
      const matchSearch =
        o.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        o.lugar.toLowerCase().includes(searchTerm.toLowerCase()) ||
        o.descripcion.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchTab =
        activeTab === 'todos' ||
        (activeTab === 'perdidos' && o.tipo === 'perdido') ||
        (activeTab === 'encontrados' && o.tipo === 'encontrado');

      const matchCat = selectedCategoria === 'todas' || o.categoria === selectedCategoria;

      return matchSearch && matchTab && matchCat;
    });
  }, [objetos, searchTerm, activeTab, selectedCategoria]);

  const handleVerDetalle = (objeto) => {
    setSelectedObject(objeto);
    setModalDetailOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner & Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#D8EAE2] pb-5">
        <div>
          <h1 className="text-2xl font-extrabold text-[#123B38] font-heading">
            Objetos Perdidos y Encontrados
          </h1>
          <p className="text-xs text-[#52716B] font-semibold mt-1">
            Red de apoyo universitario para la publicación y recuperación de bienes en el campus ESPE.
          </p>
        </div>

        <button
          onClick={() => setModalPublishOpen(true)}
          className="px-6 py-3 rounded-full bg-[#358F80] hover:bg-[#14746F] text-white font-extrabold text-xs shadow-md shadow-[#358F80]/20 flex items-center gap-2 transition-all shrink-0 self-start md:self-auto"
        >
          <HiPlus className="w-4 h-4" />
          Publicar Objeto
        </button>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="space-y-4">
        {/* Tabs Bar (Pill style) */}
        <div className="flex items-center gap-2 border-b border-[#D8EAE2]">
          <button
            onClick={() => setActiveTab('todos')}
            className={`px-5 py-3 text-xs font-extrabold border-b-2 transition-all flex items-center gap-2 ${
              activeTab === 'todos'
                ? 'border-[#358F80] text-[#358F80]'
                : 'border-transparent text-[#52716B] hover:text-[#123B38]'
            }`}
          >
            <HiInboxStack className="w-4 h-4" /> Todos ({objetos.length})
          </button>
          <button
            onClick={() => setActiveTab('perdidos')}
            className={`px-5 py-3 text-xs font-extrabold border-b-2 transition-all flex items-center gap-2 ${
              activeTab === 'perdidos'
                ? 'border-rose-600 text-rose-600'
                : 'border-transparent text-[#52716B] hover:text-[#123B38]'
            }`}
          >
            <HiExclamationTriangle className="w-4 h-4" /> Objetos Perdidos (
            {objetos.filter((o) => o.tipo === 'perdido').length})
          </button>
          <button
            onClick={() => setActiveTab('encontrados')}
            className={`px-5 py-3 text-xs font-extrabold border-b-2 transition-all flex items-center gap-2 ${
              activeTab === 'encontrados'
                ? 'border-[#358F80] text-[#358F80]'
                : 'border-transparent text-[#52716B] hover:text-[#123B38]'
            }`}
          >
            <HiCheckBadge className="w-4 h-4" /> Objetos Encontrados (
            {objetos.filter((o) => o.tipo === 'encontrado').length})
          </button>
        </div>

        {/* Inputs & Category Filters */}
        <div className="p-4 rounded-[28px] bg-white border border-[#D8EAE2] shadow-xs grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
          <div className="md:col-span-8 relative">
            <HiMagnifyingGlass className="w-4 h-4 text-[#52716B] absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar por objeto, ubicación o palabras clave..."
              className="w-full pl-11 pr-4 py-2.5 bg-[#F4FAF7] border border-[#D8EAE2] rounded-full text-xs font-semibold text-[#123B38] focus:ring-2 focus:ring-[#358F80]/30 focus:border-[#358F80]"
            />
          </div>

          <div className="md:col-span-4 flex items-center gap-2">
            <HiFunnel className="w-4 h-4 text-[#52716B] shrink-0" />
            <select
              value={selectedCategoria}
              onChange={(e) => setSelectedCategoria(e.target.value)}
              className="w-full px-4 py-2.5 bg-[#F4FAF7] border border-[#D8EAE2] rounded-full text-xs font-bold text-[#123B38] focus:ring-2 focus:ring-[#358F80]/30 focus:border-[#358F80]"
            >
              <option value="todas">Todas las Categorías</option>
              <option value="Electrónica">Electrónica</option>
              <option value="Documentos">Documentos</option>
              <option value="Mochilas y Bolsos">Mochilas y Bolsos</option>
              <option value="Accesorios">Accesorios</option>
              <option value="Utiles">Útiles Académicos</option>
            </select>
          </div>
        </div>
      </div>

      {/* Grid Display */}
      {filteredObjetos.length === 0 ? (
        <div className="py-16 text-center bg-white rounded-[32px] border border-[#D8EAE2] p-8 space-y-3">
          <HiInboxStack className="w-12 h-12 text-[#6A8881] mx-auto" />
          <h3 className="text-base font-extrabold text-[#123B38]">No hay publicaciones registradas</h3>
          <p className="text-xs text-[#52716B] max-w-sm mx-auto font-semibold">
            No se encontraron objetos con los filtros especificados. ¿Deseas publicar uno nuevo?
          </p>
          <button
            onClick={() => setModalPublishOpen(true)}
            className="px-5 py-2.5 rounded-full text-xs font-extrabold bg-[#358F80] text-white shadow-xs"
          >
            Publicar Objeto Ahora
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredObjetos.map((o) => (
            <LostFoundCard key={o.id} objeto={o} onVerDetalle={handleVerDetalle} />
          ))}
        </div>
      )}

      {/* Publish Modal */}
      <PublishObjectModal
        isOpen={modalPublishOpen}
        onClose={() => setModalPublishOpen(false)}
      />

      {/* Detail Modal */}
      <ObjectDetailModal
        objeto={selectedObject}
        isOpen={modalDetailOpen}
        onClose={() => setModalDetailOpen(false)}
      />
    </div>
  );
};
