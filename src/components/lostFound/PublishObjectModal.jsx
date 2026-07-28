import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  HiXMark, 
  HiPhoto, 
  HiTag, 
  HiMapPin, 
  HiCalendar, 
  HiCheckCircle,
  HiArrowUpTray
} from 'react-icons/hi2';
import { toast } from 'sonner';
import { crearObjeto } from '../../services/objetos.services';
import { useAuthStore } from '../../store/authStore';

export const PublishObjectModal = ({ isOpen, onClose }) => {
  const usuario = useAuthStore((s) => s.usuario);
  const [imagePreview, setImagePreview] = useState('https://images.unsplash.com/photo-1584438784894-089d6a62b8fa?auto=format&fit=crop&w=800&q=80');

  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm({
    defaultValues: {
      tipo: 'perdido',
      nombre: '',
      categoria: 'Electrónica',
      lugar: '',
      fecha: new Date().toISOString().split('T')[0],
      descripcion: '',
      reportante_contacto: usuario?.correo || 'estudiante@espe.edu.ec'
    }
  });

  if (!isOpen) return null;

  const onSubmit = async (data) => {
    try {
      const result = await crearObjeto({
        ...data,
        imagen: imagePreview,
        reportante_nombre: usuario?.nombre || 'Estudiante ESPE'
      });
      toast.success(result.queued ? 'Reporte guardado sin conexión' : '¡Publicación creada exitosamente!', {
        description: result.queued
          ? 'Se publicará automáticamente cuando recuperes la conexión.'
          : `El objeto "${data.nombre}" ha sido publicado correctamente en el portal.`
      });
      reset();
      onClose();
    } catch (err) {
      toast.error('Error al publicar el objeto', {
        description: 'Verifique los campos e intente nuevamente.'
      });
    }
  };

  const sampleImages = [
    { label: 'Mochila / Bag', url: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80' },
    { label: 'Calculadora / Gadget', url: 'https://images.unsplash.com/photo-1632571401005-458e9d244591?auto=format&fit=crop&w=800&q=80' },
    { label: 'Documentos / Carnet', url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80' },
    { label: 'Audífonos / Gadget', url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80' }
  ];

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
          className="relative bg-white rounded-[32px] shadow-2xl border border-[#D8EAE2] w-full max-w-xl overflow-hidden z-10 max-h-[90vh] flex flex-col"
        >
          {/* Header */}
          <div className="bg-[#036666] p-6 text-white relative shrink-0">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
              aria-label="Cerrar modal"
            >
              <HiXMark className="w-5 h-5" />
            </button>
            <span className="inline-block px-3 py-1 rounded-full text-[10px] font-extrabold bg-[#358F80]/30 text-[#99E2B4] border border-[#358F80]/40 uppercase tracking-wider mb-2">
              Comunidad ESPEConnect
            </span>
            <h2 className="text-xl font-extrabold pr-6 leading-tight font-heading">Publicar Reporte de Objeto</h2>
            <p className="text-xs text-[#C8E8D7] font-semibold mt-1">
              Registra un objeto perdido o encontrado para ayudar a reunirlo con su dueño.
            </p>
          </div>

          {/* Form Scrollable Content */}
          <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4 overflow-y-auto flex-1">
            {/* Tipo (Radio Tabs) */}
            <div>
              <label className="block text-xs font-bold text-[#123B38] mb-1.5">
                Tipo de Reporte
              </label>
              <div className="grid grid-cols-2 gap-3">
                <label className="cursor-pointer">
                  <input
                    type="radio"
                    value="perdido"
                    {...register('tipo')}
                    className="peer sr-only"
                  />
                  <div className="p-3.5 text-center rounded-full border border-[#D8EAE2] peer-checked:border-rose-600 peer-checked:bg-rose-50 peer-checked:text-rose-700 font-extrabold text-xs transition-all">
                    He perdido un objeto
                  </div>
                </label>
                <label className="cursor-pointer">
                  <input
                    type="radio"
                    value="encontrado"
                    {...register('tipo')}
                    className="peer sr-only"
                  />
                  <div className="p-3.5 text-center rounded-full border border-[#D8EAE2] peer-checked:border-[#358F80] peer-checked:bg-[#EAF6F0] peer-checked:text-[#358F80] font-extrabold text-xs transition-all">
                    He encontrado un objeto
                  </div>
                </label>
              </div>
            </div>

            {/* Nombre del objeto */}
            <div>
              <label className="block text-xs font-bold text-[#123B38] mb-1.5">
                Nombre del Objeto
              </label>
              <input
                type="text"
                placeholder="Ejemplo: Calculadora Casio FX-991EX, Carnet de Estudiante..."
                {...register('nombre', { required: 'El nombre es obligatorio' })}
                className="w-full px-4 py-2.5 bg-[#F4FAF7] border border-[#D8EAE2] rounded-2xl text-xs font-semibold text-[#123B38] focus:outline-none focus:ring-2 focus:ring-[#358F80]/30 focus:border-[#358F80]"
              />
              {errors.nombre && (
                <p className="text-[11px] text-rose-500 mt-1 font-semibold">{errors.nombre.message}</p>
              )}
            </div>

            {/* Categoría & Fecha */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-[#123B38] mb-1.5 flex items-center gap-1">
                  <HiTag className="w-3.5 h-3.5 text-[#358F80]" /> Categoría
                </label>
                <select
                  {...register('categoria')}
                  className="w-full px-4 py-2.5 bg-[#F4FAF7] border border-[#D8EAE2] rounded-2xl text-xs font-bold text-[#123B38] focus:outline-none focus:ring-2 focus:ring-[#358F80]/30 focus:border-[#358F80]"
                >
                  <option value="Electrónica">Electrónica</option>
                  <option value="Documentos">Documentos</option>
                  <option value="Mochilas y Bolsos">Mochilas y Bolsos</option>
                  <option value="Accesorios">Accesorios</option>
                  <option value="Utiles">Útiles Académicos</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#123B38] mb-1.5 flex items-center gap-1">
                  <HiCalendar className="w-3.5 h-3.5 text-[#358F80]" /> Fecha del suceso
                </label>
                <input
                  type="date"
                  {...register('fecha', { required: 'Indique la fecha' })}
                  className="w-full px-4 py-2.5 bg-[#F4FAF7] border border-[#D8EAE2] rounded-2xl text-xs font-bold text-[#123B38] focus:outline-none focus:ring-2 focus:ring-[#358F80]/30 focus:border-[#358F80]"
                />
              </div>
            </div>

            {/* Lugar */}
            <div>
              <label className="block text-xs font-bold text-[#123B38] mb-1.5 flex items-center gap-1">
                <HiMapPin className="w-3.5 h-3.5 text-[#358F80]" /> Ubicación en el Campus
              </label>
              <input
                type="text"
                placeholder="Ej. Biblioteca 2do Piso, Edificio G Aula 101, Cafetería Central..."
                {...register('lugar', { required: 'Indique la ubicación aproximada' })}
                className="w-full px-4 py-2.5 bg-[#F4FAF7] border border-[#D8EAE2] rounded-2xl text-xs font-semibold text-[#123B38] focus:outline-none focus:ring-2 focus:ring-[#358F80]/30 focus:border-[#358F80]"
              />
              {errors.lugar && (
                <p className="text-[11px] text-rose-500 mt-1 font-semibold">{errors.lugar.message}</p>
              )}
            </div>

            {/* Image selection simulation */}
            <div>
              <label className="block text-xs font-bold text-[#123B38] mb-1.5 flex items-center gap-1">
                <HiPhoto className="w-3.5 h-3.5 text-[#358F80]" /> Imagen del Objeto
              </label>
              <div className="flex items-center gap-3">
                <img
                  src={imagePreview}
                  alt="Vista previa"
                  className="w-16 h-16 rounded-2xl object-cover border border-[#D8EAE2] shrink-0"
                />
                <div className="flex-1 space-y-1">
                  <p className="text-[11px] text-[#52716B] font-semibold">Selecciona una imagen de demostración:</p>
                  <div className="flex flex-wrap gap-1.5">
                    {sampleImages.map((img, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setImagePreview(img.url)}
                        className={`px-3 py-1 rounded-full text-[10px] font-bold border transition-all ${
                          imagePreview === img.url
                            ? 'bg-[#358F80] text-white border-[#358F80]'
                            : 'bg-[#F4FAF7] text-[#248277] border-[#D8EAE2] hover:bg-[#E1F1E9]'
                        }`}
                      >
                        {img.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Descripción */}
            <div>
              <label className="block text-xs font-bold text-[#123B38] mb-1.5">
                Descripción Detallada
              </label>
              <textarea
                rows={3}
                placeholder="Indica detalles particulares como marcas, color de funda, distintivos o contenidos para verificar propiedad..."
                {...register('descripcion', { required: 'Añada una breve descripción' })}
                className="w-full px-4 py-2.5 bg-[#F4FAF7] border border-[#D8EAE2] rounded-2xl text-xs font-semibold text-[#123B38] placeholder-[#6A8881] focus:outline-none focus:ring-2 focus:ring-[#358F80]/30 focus:border-[#358F80] resize-none"
              />
              {errors.descripcion && (
                <p className="text-[11px] text-rose-500 mt-1 font-semibold">{errors.descripcion.message}</p>
              )}
            </div>

            {/* Footer buttons */}
            <div className="pt-4 border-t border-[#D8EAE2] flex items-center justify-end gap-3 shrink-0">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 rounded-full text-xs font-extrabold text-[#52716B] hover:bg-[#F4FAF7] transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2.5 rounded-full text-xs font-extrabold bg-[#358F80] hover:bg-[#14746F] text-white shadow-md shadow-[#358F80]/20 flex items-center gap-2 transition-all"
              >
                <HiArrowUpTray className="w-4 h-4" />
                {isSubmitting ? 'Publicando...' : 'Publicar Objeto'}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
