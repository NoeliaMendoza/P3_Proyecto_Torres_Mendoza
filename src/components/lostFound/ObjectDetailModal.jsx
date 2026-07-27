import { motion, AnimatePresence } from 'framer-motion';
import { 
  HiXMark, 
  HiMapPin, 
  HiCalendar, 
  HiTag, 
  HiUser, 
  HiEnvelope,
  HiCheckBadge,
  HiExclamationTriangle,
  HiChatBubbleLeftEllipsis
} from 'react-icons/hi2';
import { toast } from 'sonner';

export const ObjectDetailModal = ({ objeto, isOpen, onClose }) => {
  if (!isOpen || !objeto) return null;

  const isEncontrado = objeto.tipo === 'encontrado';

  const handleContact = () => {
    toast.success('Notificación enviada al reportante', {
      description: `Se ha enviado un mensaje interno a ${objeto.reportante_contacto} con tus datos de contacto.`
    });
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-[#0E1E1C]/70 backdrop-blur-xs"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="relative bg-white rounded-[32px] shadow-2xl border border-[#E0E4DC] w-full max-w-lg overflow-hidden z-10"
        >
          {/* Top Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-20 p-2 rounded-full bg-[#162E2B]/60 hover:bg-[#162E2B] text-white transition-colors backdrop-blur-xs"
            aria-label="Cerrar modal"
          >
            <HiXMark className="w-5 h-5" />
          </button>

          {/* Full Image Preview */}
          <div className="relative h-64 w-full bg-[#162E2B]">
            <img
              src={objeto.imagen}
              alt={objeto.nombre}
              className="w-full h-full object-cover opacity-90"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0E1E1C] via-[#0E1E1C]/30 to-transparent" />
            <div className="absolute bottom-4 left-6 right-6">
              <span
                className={`inline-flex items-center gap-1 px-3.5 py-1 rounded-full text-xs font-extrabold text-white mb-2 shadow-xs ${
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
              <h2 className="text-xl font-extrabold text-white leading-tight font-heading">{objeto.nombre}</h2>
            </div>
          </div>

          {/* Content Body */}
          <div className="p-6 space-y-4">
            <div className="grid grid-cols-2 gap-3 p-3.5 rounded-2xl bg-[#F2F4EF] border border-[#E0E4DC] text-xs">
              <div className="space-y-1">
                <span className="text-[#586663] font-bold text-[10px] uppercase tracking-wider block">Categoría</span>
                <span className="font-extrabold text-[#0F1A19] flex items-center gap-1">
                  <HiTag className="w-3.5 h-3.5 text-[#008345]" /> {objeto.categoria}
                </span>
              </div>
              <div className="space-y-1">
                <span className="text-[#586663] font-bold text-[10px] uppercase tracking-wider block">Fecha</span>
                <span className="font-extrabold text-[#0F1A19] flex items-center gap-1">
                  <HiCalendar className="w-3.5 h-3.5 text-[#008345]" /> {objeto.fecha}
                </span>
              </div>
            </div>

            <div>
              <h4 className="text-xs font-extrabold text-[#0F1A19] mb-1 flex items-center gap-1.5">
                <HiMapPin className="w-4 h-4 text-[#008345]" /> Lugar del suceso
              </h4>
              <p className="text-xs text-[#586663] font-semibold">{objeto.lugar}</p>
            </div>

            <div>
              <h4 className="text-xs font-extrabold text-[#0F1A19] mb-1">Descripción</h4>
              <p className="text-xs text-[#586663] leading-relaxed bg-[#F2F4EF] p-3.5 rounded-2xl border border-[#E0E4DC]">
                {objeto.descripcion}
              </p>
            </div>

            {/* Reporter Contact Info */}
            <div className="p-4 rounded-2xl bg-[#E6F3EC] border border-[#008345]/30 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-[#008345] text-white flex items-center justify-center font-extrabold text-sm">
                  <HiUser className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-extrabold text-[#0F1A19]">{objeto.reportante_nombre}</p>
                  <p className="text-[11px] text-[#586663] font-semibold flex items-center gap-1">
                    <HiEnvelope className="w-3 h-3 text-[#008345]" /> {objeto.reportante_contacto}
                  </p>
                </div>
              </div>
            </div>

            {/* Action buttons */}
            <div className="pt-4 border-t border-[#E0E4DC] flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 rounded-full text-xs font-extrabold text-[#586663] hover:bg-[#F2F4EF] transition-colors"
              >
                Cerrar
              </button>
              <button
                type="button"
                onClick={handleContact}
                className="px-6 py-2.5 rounded-full text-xs font-extrabold bg-[#008345] hover:bg-[#006636] text-white shadow-md shadow-[#008345]/20 flex items-center gap-2 transition-all"
              >
                <HiChatBubbleLeftEllipsis className="w-4 h-4" />
                {isEncontrado ? 'Reclamar Objeto' : 'Contactar Dueño'}
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
