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
import { useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '../../store/authStore';
import { marcarComoEncontrado, reclamarObjeto } from '../../services/objetos.services';

export const ObjectDetailModal = ({ objeto, isOpen, onClose }) => {
  if (!isOpen || !objeto) return null;
  const queryClient = useQueryClient();

  const isEncontrado = objeto.tipo === 'encontrado';
  const usuario = useAuthStore((s) => s.usuario);
  const esMiPublicacion = usuario?.id === objeto.id_reportante;
  const puedeMarcarEncontrado = esMiPublicacion && objeto.estado === 'abierto';

  const handleMarcarEncontrado = async () => {
    try {
      await marcarComoEncontrado(objeto.id);
      toast.success('Objeto marcado como encontrado');
      queryClient.invalidateQueries({ queryKey: ['objetos'] });
      onClose();
    } catch (error) {
      toast.error(error.response?.data?.mensaje || 'No se pudo marcar como encontrado');
    }
  };

  const handleContact = async () => {
    if (isEncontrado) {
      try {
        await reclamarObjeto(objeto.id);
        toast.success('Objeto reclamado correctamente');
        queryClient.invalidateQueries({ queryKey: ['objetos'] });
        onClose();
      } catch (error) {
        toast.error(error.response?.data?.mensaje || 'No se pudo reclamar el objeto');
      }
    } else {
      toast.success('Notificación enviada al reportante', {
        description: `Se ha enviado un mensaje interno a ${objeto.reportante_contacto} con tus datos de contacto.`
      });
      onClose();
    }
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
          className="fixed inset-0 bg-[#024E50]/70 backdrop-blur-xs"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="relative bg-white rounded-[32px] shadow-2xl border border-[#D8EAE2] w-full max-w-lg overflow-hidden z-10"
        >
          {/* Top Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-20 p-2 rounded-full bg-[#036666]/60 hover:bg-[#036666] text-white transition-colors backdrop-blur-xs"
            aria-label="Cerrar modal"
          >
            <HiXMark className="w-5 h-5" />
          </button>

          {/* Full Image Preview */}
          <div className="relative h-48 sm:h-64 w-full bg-[#036666]">
            <img
              src={objeto.imagen}
              alt={objeto.nombre}
              className="w-full h-full object-cover opacity-90"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#024E50] via-[#024E50]/30 to-transparent" />
            <div className="absolute bottom-4 left-6 right-6">
              <span
                className={`inline-flex items-center gap-1 px-3.5 py-1 rounded-full text-xs font-extrabold text-white mb-2 shadow-xs ${
                  isEncontrado ? 'bg-[#358F80]' : 'bg-rose-600'
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
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3.5 rounded-2xl bg-[#F4FAF7] border border-[#D8EAE2] text-xs">
              <div className="space-y-1">
                <span className="text-[#52716B] font-bold text-[10px] uppercase tracking-wider block">Categoría</span>
                <span className="font-extrabold text-[#123B38] flex items-center gap-1">
                  <HiTag className="w-3.5 h-3.5 text-[#358F80]" /> {objeto.categoria}
                </span>
              </div>
              <div className="space-y-1">
                <span className="text-[#52716B] font-bold text-[10px] uppercase tracking-wider block">Fecha</span>
                <span className="font-extrabold text-[#123B38] flex items-center gap-1">
                  <HiCalendar className="w-3.5 h-3.5 text-[#358F80]" /> {objeto.fecha}
                </span>
              </div>
            </div>

            <div>
              <h4 className="text-xs font-extrabold text-[#123B38] mb-1 flex items-center gap-1.5">
                <HiMapPin className="w-4 h-4 text-[#358F80]" /> Lugar del suceso
              </h4>
              <p className="text-xs text-[#52716B] font-semibold">{objeto.lugar}</p>
            </div>

            <div>
              <h4 className="text-xs font-extrabold text-[#123B38] mb-1">Descripción</h4>
              <p className="text-xs text-[#52716B] leading-relaxed bg-[#F4FAF7] p-3.5 rounded-2xl border border-[#D8EAE2]">
                {objeto.descripcion}
              </p>
            </div>

            {/* Reporter Contact Info */}
            <div className="p-4 rounded-2xl bg-[#EAF6F0] border border-[#358F80]/30 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-[#358F80] text-white flex items-center justify-center font-extrabold text-sm">
                  <HiUser className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-extrabold text-[#123B38]">{objeto.reportante_nombre}</p>
                  <p className="text-[11px] text-[#52716B] font-semibold flex items-center gap-1">
                    <HiEnvelope className="w-3 h-3 text-[#358F80]" /> {objeto.reportante_contacto}
                  </p>
                </div>
              </div>
            </div>

            {/* Action buttons */}
            <div className="pt-4 border-t border-[#D8EAE2] flex items-center justify-end gap-3 flex-wrap">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 rounded-full text-xs font-extrabold text-[#52716B] hover:bg-[#F4FAF7] transition-colors"
              >
                Cerrar
              </button>
              {puedeMarcarEncontrado && (
                <button
                  type="button"
                  onClick={handleMarcarEncontrado}
                  className="px-6 py-2.5 rounded-full text-xs font-extrabold bg-amber-600 hover:bg-amber-700 text-white shadow-md shadow-amber-600/20 flex items-center gap-2 transition-all"
                >
                  <HiCheckBadge className="w-4 h-4" />
                  Marcar como encontrado
                </button>
              )}
              <button
                type="button"
                onClick={handleContact}
                className="px-6 py-2.5 rounded-full text-xs font-extrabold bg-[#358F80] hover:bg-[#14746F] text-white shadow-md shadow-[#358F80]/20 flex items-center gap-2 transition-all"
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
