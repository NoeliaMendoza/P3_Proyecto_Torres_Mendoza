import { motion } from 'framer-motion';
import { 
  HiMapPin, 
  HiCalendar, 
  HiTag, 
  HiUser, 
  HiEye, 
  HiCheckBadge,
  HiExclamationTriangle
} from 'react-icons/hi2';

export const LostFoundCard = ({ objeto, onVerDetalle }) => {
  const isEncontrado = objeto.tipo === 'encontrado';

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className="bg-white rounded-[28px] border border-[#E0E4DC] overflow-hidden shadow-xs hover:shadow-xl transition-all flex flex-col group"
    >
      {/* Image container */}
      <div className="relative h-52 w-full overflow-hidden bg-[#162E2B]">
        <img
          src={objeto.imagen}
          alt={objeto.nombre}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0E1E1C] via-transparent to-transparent" />

        {/* Top Chips */}
        <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
          <span className="px-3 py-1 rounded-full text-[11px] font-extrabold bg-[#162E2B]/90 text-white backdrop-blur-md border border-white/20 uppercase tracking-wider flex items-center gap-1">
            <HiTag className="w-3.5 h-3.5 text-[#36D080]" />
            {objeto.categoria}
          </span>
          <span
            className={`px-3.5 py-1 rounded-full text-xs font-extrabold text-white shadow-xs flex items-center gap-1 ${
              isEncontrado ? 'bg-[#008345]' : 'bg-rose-600'
            }`}
          >
            {isEncontrado ? (
              <>
                <HiCheckBadge className="w-3.5 h-3.5" /> Encontrado
              </>
            ) : (
              <>
                <HiExclamationTriangle className="w-3.5 h-3.5" /> Perdido
              </>
            )}
          </span>
        </div>

        {/* Bottom Title overlay */}
        <div className="absolute bottom-4 left-4 right-4">
          <h3 className="text-lg font-extrabold text-white leading-tight truncate font-heading drop-shadow-xs">
            {objeto.nombre}
          </h3>
        </div>
      </div>

      {/* Card Info Body */}
      <div className="p-6 flex-1 flex flex-col justify-between space-y-3">
        <div className="space-y-2 text-xs text-[#586663]">
          <div className="flex items-center gap-2 font-semibold text-[#0F1A19]">
            <HiMapPin className="w-4 h-4 text-[#008345] shrink-0" />
            <span className="truncate">{objeto.lugar}</span>
          </div>

          <div className="flex items-center gap-2 font-semibold">
            <HiCalendar className="w-4 h-4 text-[#008345] shrink-0" />
            <span>Reportado: {objeto.fecha}</span>
          </div>

          <p className="text-xs text-[#586663] line-clamp-2 pt-1 leading-relaxed">
            {objeto.descripcion}
          </p>
        </div>

        {/* Action button */}
        <div className="pt-4 border-t border-[#E0E4DC] flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-[11px] text-[#586663] font-semibold">
            <HiUser className="w-3.5 h-3.5 text-[#264743]" />
            <span className="truncate max-w-[120px]">{objeto.reportante_nombre}</span>
          </div>

          <button
            onClick={() => onVerDetalle(objeto)}
            className="px-4 py-2 rounded-full text-xs font-extrabold text-[#162E2B] bg-[#F2F4EF] hover:bg-[#008345] hover:text-white transition-all flex items-center gap-1.5 border border-[#E0E4DC]"
          >
            <HiEye className="w-4 h-4" />
            <span>Ver Detalle</span>
          </button>
        </div>
      </div>
    </motion.div>
  );
};
