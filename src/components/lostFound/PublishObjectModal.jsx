import { useState, useRef, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  HiXMark, 
  HiPhoto, 
  HiTag, 
  HiMapPin, 
  HiCalendar, 
  HiCheckCircle,
  HiArrowUpTray,
  HiLink
} from 'react-icons/hi2';
import { toast } from 'sonner';
import { crearObjeto } from '../../services/objetos.services';
import { useAuthStore } from '../../store/authStore';

export const PublishObjectModal = ({ isOpen, onClose }) => {
  const usuario = useAuthStore((s) => s.usuario);
  const fileInputRef = useRef(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [imageUrl, setImageUrl] = useState('');

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

  const [imageMode, setImageMode] = useState('upload');
  const [isDragOver, setIsDragOver] = useState(false);

  const processFile = (file) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      toast.error('Solo se permiten imágenes');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error('La imagen no debe superar los 5MB');
      return;
    }
    const reader = new FileReader();
    reader.onload = (ev) => {
      setImagePreview(ev.target.result);
      setImageUrl('');
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e) => processFile(e.target.files?.[0]);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragOver(false);
    processFile(e.dataTransfer?.files?.[0]);
  }, []);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback(() => setIsDragOver(false), []);

  const handleUrlSubmit = () => {
    if (!imageUrl.trim()) return;
    setImagePreview(imageUrl.trim());
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const removeImage = () => {
    setImagePreview(null);
    setImageUrl('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

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
      setImagePreview(null);
      setImageUrl('');
      if (fileInputRef.current) fileInputRef.current.value = '';
      onClose();
    } catch (err) {
      toast.error('Error al publicar el objeto', {
        description: 'Verifique los campos e intente nuevamente.'
      });
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-[#024E50]/70 backdrop-blur-xs"
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="relative bg-white rounded-[32px] shadow-2xl border border-[#D8EAE2] w-full max-w-xl overflow-hidden z-10 max-h-[90vh] flex flex-col"
        >
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

          <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4 overflow-y-auto flex-1">
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

            {/* Image upload */}
            <div>
              <label className="block text-xs font-bold text-[#123B38] mb-1.5 flex items-center gap-1">
                <HiPhoto className="w-3.5 h-3.5 text-[#358F80]" /> Imagen del Objeto
              </label>

              {imagePreview ? (
                <div className="relative group rounded-2xl overflow-hidden bg-[#F4FAF7] border border-[#D8EAE2]">
                  <img
                    src={imagePreview}
                    alt="Vista previa"
                    className="w-full h-44 object-cover"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all flex items-center justify-center">
                    <button
                      type="button"
                      onClick={removeImage}
                      className="opacity-0 group-hover:opacity-100 px-4 py-2 rounded-full bg-white/90 text-rose-600 text-xs font-extrabold shadow-lg hover:bg-white transition-all flex items-center gap-1.5"
                    >
                      <HiXMark className="w-4 h-4" />
                      Cambiar imagen
                    </button>
                  </div>
                </div>
              ) : (
                <div className="rounded-2xl border-2 border-dashed border-[#D8EAE2] bg-[#F4FAF7] overflow-hidden">
                  <div className="flex border-b border-[#D8EAE2]">
                    <button
                      type="button"
                      onClick={() => setImageMode('upload')}
                      className={`flex-1 py-2 text-[11px] font-extrabold text-center transition-all ${
                        imageMode === 'upload'
                          ? 'bg-white text-[#248277] border-b-2 border-[#248277]'
                          : 'bg-[#F4FAF7] text-[#6A8881] hover:bg-white'
                      }`}
                    >
                      <HiArrowUpTray className="w-3.5 h-3.5 inline mr-1" />
                      Subir imagen
                    </button>
                    <button
                      type="button"
                      onClick={() => setImageMode('url')}
                      className={`flex-1 py-2 text-[11px] font-extrabold text-center transition-all ${
                        imageMode === 'url'
                          ? 'bg-white text-[#248277] border-b-2 border-[#248277]'
                          : 'bg-[#F4FAF7] text-[#6A8881] hover:bg-white'
                      }`}
                    >
                      <HiLink className="w-3.5 h-3.5 inline mr-1" />
                      Pegar URL
                    </button>
                  </div>

                  {imageMode === 'upload' ? (
                    <div
                      onDrop={handleDrop}
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onClick={() => fileInputRef.current?.click()}
                      className={`p-8 flex flex-col items-center justify-center cursor-pointer transition-all ${
                        isDragOver
                          ? 'bg-[#E1F1E9] border-[#248277]'
                          : 'hover:bg-[#EAF6F0]'
                      }`}
                    >
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                      <div className="w-12 h-12 rounded-full bg-[#D8EAE2] flex items-center justify-center mb-3">
                        <HiArrowUpTray className="w-6 h-6 text-[#248277]" />
                      </div>
                      <p className="text-xs font-bold text-[#248277]">
                        {isDragOver ? 'Suelta la imagen aquí' : 'Haz clic o arrastra una imagen'}
                      </p>
                      <p className="text-[10px] text-[#6A8881] font-semibold mt-1">
                        PNG, JPG o WEBP &middot; Máx. 5MB
                      </p>
                    </div>
                  ) : (
                    <div className="p-4">
                      <div className="flex items-center gap-2">
                        <HiLink className="w-4 h-4 text-[#A0C4B8] shrink-0" />
                        <input
                          type="text"
                          placeholder="https://ejemplo.com/imagen.jpg"
                          value={imageUrl}
                          onChange={(e) => setImageUrl(e.target.value)}
                          onBlur={handleUrlSubmit}
                          onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleUrlSubmit())}
                          className="flex-1 px-3 py-2 bg-white border border-[#D8EAE2] rounded-xl text-xs font-semibold text-[#123B38] focus:outline-none focus:ring-2 focus:ring-[#358F80]/30 focus:border-[#358F80] placeholder-[#A0C4B8]"
                        />
                        <button
                          type="button"
                          onClick={handleUrlSubmit}
                          className="px-4 py-2 rounded-xl text-[11px] font-bold bg-[#248277] text-white hover:bg-[#14746F] transition-all"
                        >
                          Añadir
                        </button>
                      </div>
                      <p className="text-[10px] text-[#6A8881] font-semibold mt-2">
                        Pega la URL de una imagen alojada en Imgur, Google Drive, Unsplash, etc.
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>

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