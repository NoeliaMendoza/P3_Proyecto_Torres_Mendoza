import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  HiUser, 
  HiAcademicCap, 
  HiCalendar, 
  HiTag, 
  HiCog6Tooth, 
  HiEnvelope, 
  HiBuildingLibrary,
  HiCheckCircle,
  HiClock,
  HiShieldCheck
} from 'react-icons/hi2';
import { toast } from 'sonner';
import { useAuthStore } from '../../store/authStore';
import { useUIStore } from '../../store/uiStore';

export const ProfilePage = () => {
  const [searchParams] = useSearchParams();
  const initialTab = searchParams.get('tab') || 'info';

  const usuario = useAuthStore((s) => s.usuario);
  const setUsuario = useAuthStore((s) => s.setUsuario);
  const { reservas, objetos } = useUIStore();

  const [activeTab, setActiveTab] = useState(initialTab); // 'info' | 'reservas' | 'objetos' | 'config'

  // Form edit state
  const [editNombre, setEditNombre] = useState(usuario?.nombre || '');
  const [editTelefono, setEditTelefono] = useState(usuario?.telefono || '+593 99 876 5432');
  const [notifEmail, setNotifEmail] = useState(true);

  const handleSaveProfile = (e) => {
    e.preventDefault();
    setUsuario({
      ...usuario,
      nombre: editNombre,
      telefono: editTelefono
    });
    toast.success('Perfil actualizado correctamente', {
      description: 'Los cambios han sido guardados en tu cuenta institucional.'
    });
  };

  return (
    <div className="space-y-6">
      {/* Profile Header Card with Cover */}
      <div className="bg-white rounded-[32px] border border-[#E0E4DC] shadow-xs overflow-hidden">
        {/* Cover Banner */}
        <div className="h-44 w-full bg-[#162E2B] relative">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-[#008345]/30 via-transparent to-transparent" />
        </div>

        {/* User Avatar & Header Info */}
        <div className="px-8 pb-8 relative">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 -mt-16 sm:-mt-14 mb-4">
            <div className="flex flex-col sm:flex-row sm:items-end gap-4">
              <img
                src={usuario?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'}
                alt={usuario?.nombre}
                className="w-28 h-28 rounded-[28px] object-cover border-4 border-white shadow-xl ring-2 ring-[#008345]/40"
              />
              <div className="space-y-1">
                <h1 className="text-2xl font-extrabold text-[#0F1A19] font-heading flex items-center gap-2">
                  {usuario?.nombre}
                  <HiCheckCircle className="w-5 h-5 text-[#008345]" />
                </h1>
                <p className="text-xs font-extrabold text-[#008345] flex items-center gap-1.5">
                  <HiAcademicCap className="w-4 h-4" /> {usuario?.carrera} &bull; {usuario?.semestre}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <span className="px-4 py-1.5 rounded-full text-xs font-extrabold bg-[#E6F3EC] text-[#008345] border border-[#008345]/30">
                ID: {usuario?.idEspe || 'L00394857'}
              </span>
              <span className="px-4 py-1.5 rounded-full text-xs font-extrabold bg-[#162E2B] text-white">
                Promedio: {usuario?.promedio || '18.85'}
              </span>
            </div>
          </div>

          {/* Nav Tabs (Pill style) */}
          <div className="flex items-center gap-2 border-t border-[#E0E4DC] pt-5 overflow-x-auto">
            <button
              onClick={() => setActiveTab('info')}
              className={`px-5 py-2.5 rounded-full text-xs font-extrabold transition-all flex items-center gap-2 whitespace-nowrap ${
                activeTab === 'info'
                  ? 'bg-[#008345] text-white shadow-xs'
                  : 'bg-[#F2F4EF] text-[#586663] hover:bg-[#E2E6DF]'
              }`}
            >
              <HiUser className="w-4 h-4" /> Información Personal
            </button>
            <button
              onClick={() => setActiveTab('reservas')}
              className={`px-5 py-2.5 rounded-full text-xs font-extrabold transition-all flex items-center gap-2 whitespace-nowrap ${
                activeTab === 'reservas'
                  ? 'bg-[#008345] text-white shadow-xs'
                  : 'bg-[#F2F4EF] text-[#586663] hover:bg-[#E2E6DF]'
              }`}
            >
              <HiCalendar className="w-4 h-4" /> Historial de Reservas ({reservas.length})
            </button>
            <button
              onClick={() => setActiveTab('objetos')}
              className={`px-5 py-2.5 rounded-full text-xs font-extrabold transition-all flex items-center gap-2 whitespace-nowrap ${
                activeTab === 'objetos'
                  ? 'bg-[#008345] text-white shadow-xs'
                  : 'bg-[#F2F4EF] text-[#586663] hover:bg-[#E2E6DF]'
              }`}
            >
              <HiTag className="w-4 h-4" /> Mis Publicaciones ({objetos.length})
            </button>
            <button
              onClick={() => setActiveTab('config')}
              className={`px-5 py-2.5 rounded-full text-xs font-extrabold transition-all flex items-center gap-2 whitespace-nowrap ${
                activeTab === 'config'
                  ? 'bg-[#008345] text-white shadow-xs'
                  : 'bg-[#F2F4EF] text-[#586663] hover:bg-[#E2E6DF]'
              }`}
            >
              <HiCog6Tooth className="w-4 h-4" /> Configuración
            </button>
          </div>
        </div>
      </div>

      {/* Tab Content Panels */}
      {activeTab === 'info' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-[28px] p-6 border border-[#E0E4DC] shadow-xs space-y-4">
            <h3 className="text-base font-extrabold text-[#0F1A19] font-heading border-b border-[#E0E4DC] pb-3 flex items-center gap-2">
              <HiBuildingLibrary className="w-5 h-5 text-[#008345]" />
              Datos Académicos Institucionales
            </h3>
            <div className="space-y-3 text-xs">
              <div className="p-3.5 rounded-2xl bg-[#F2F4EF] border border-[#E0E4DC]">
                <span className="text-[#586663] font-bold block text-[10px] uppercase">Departamento</span>
                <span className="font-extrabold text-[#0F1A19]">{usuario?.departamento}</span>
              </div>
              <div className="p-3.5 rounded-2xl bg-[#F2F4EF] border border-[#E0E4DC]">
                <span className="text-[#586663] font-bold block text-[10px] uppercase">Campus Principal</span>
                <span className="font-extrabold text-[#0F1A19]">{usuario?.campus}</span>
              </div>
              <div className="p-3.5 rounded-2xl bg-[#F2F4EF] border border-[#E0E4DC]">
                <span className="text-[#586663] font-bold block text-[10px] uppercase">Fecha de Ingreso</span>
                <span className="font-extrabold text-[#0F1A19]">{usuario?.fechaIngreso || 'Octubre 2022'}</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-[28px] p-6 border border-[#E0E4DC] shadow-xs space-y-4">
            <h3 className="text-base font-extrabold text-[#0F1A19] font-heading border-b border-[#E0E4DC] pb-3 flex items-center gap-2">
              <HiEnvelope className="w-5 h-5 text-[#008345]" />
              Información de Contacto
            </h3>
            <div className="space-y-3 text-xs">
              <div className="p-3.5 rounded-2xl bg-[#F2F4EF] border border-[#E0E4DC]">
                <span className="text-[#586663] font-bold block text-[10px] uppercase">Correo Institucional</span>
                <span className="font-extrabold text-[#0F1A19]">{usuario?.correo}</span>
              </div>
              <div className="p-3.5 rounded-2xl bg-[#F2F4EF] border border-[#E0E4DC]">
                <span className="text-[#586663] font-bold block text-[10px] uppercase">Teléfono Móvil</span>
                <span className="font-extrabold text-[#0F1A19]">{usuario?.telefono || '+593 99 876 5432'}</span>
              </div>
              <div className="p-3.5 rounded-2xl bg-[#F2F4EF] border border-[#E0E4DC]">
                <span className="text-[#586663] font-bold block text-[10px] uppercase">Estado de Cuenta</span>
                <span className="inline-flex items-center gap-1 font-extrabold text-[#008345]">
                  <HiShieldCheck className="w-4 h-4" /> Alumno Regular Activo
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'reservas' && (
        <div className="bg-white rounded-[28px] p-6 border border-[#E0E4DC] shadow-xs space-y-4">
          <h3 className="text-base font-extrabold text-[#0F1A19] font-heading border-b border-[#E0E4DC] pb-3">
            Historial de Reservas de Espacios Académicos
          </h3>
          <div className="space-y-3">
            {reservas.map((r) => (
              <div
                key={r.id}
                className="p-4 rounded-2xl bg-[#F2F4EF] border border-[#E0E4DC] flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-0.5 rounded-full text-[10px] font-extrabold bg-[#162E2B] text-white">
                      {r.id}
                    </span>
                    <h4 className="text-sm font-extrabold text-[#0F1A19]">{r.espacioNombre}</h4>
                  </div>
                  <p className="text-xs text-[#586663] font-semibold">{r.motivo}</p>
                </div>
                <div className="flex items-center gap-4 text-xs shrink-0 font-semibold">
                  <span className="flex items-center gap-1 text-[#0F1A19]">
                    <HiCalendar className="w-4 h-4 text-[#008345]" /> {r.fecha}
                  </span>
                  <span className="flex items-center gap-1 text-[#0F1A19]">
                    <HiClock className="w-4 h-4 text-[#008345]" /> {r.horario}
                  </span>
                  <span className="px-3.5 py-1 rounded-full text-xs font-extrabold bg-[#E6F3EC] text-[#008345]">
                    {r.estado}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'objetos' && (
        <div className="bg-white rounded-[28px] p-6 border border-[#E0E4DC] shadow-xs space-y-4">
          <h3 className="text-base font-extrabold text-[#0F1A19] font-heading border-b border-[#E0E4DC] pb-3">
            Publicaciones en Objetos Perdidos y Encontrados
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {objetos.map((o) => (
              <div
                key={o.id}
                className="p-4 rounded-2xl bg-[#F2F4EF] border border-[#E0E4DC] flex items-center gap-4"
              >
                <img
                  src={o.imagen}
                  alt={o.nombre}
                  className="w-16 h-16 rounded-2xl object-cover border border-[#E0E4DC] shrink-0"
                />
                <div className="min-w-0 flex-1 space-y-1">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-[#008345] text-white uppercase">
                    {o.tipo}
                  </span>
                  <h4 className="text-xs font-extrabold text-[#0F1A19] truncate">{o.nombre}</h4>
                  <p className="text-[11px] text-[#586663] font-semibold truncate">{o.lugar} &bull; {o.fecha}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'config' && (
        <div className="bg-white rounded-[28px] p-6 border border-[#E0E4DC] shadow-xs max-w-2xl space-y-6">
          <h3 className="text-base font-extrabold text-[#0F1A19] font-heading border-b border-[#E0E4DC] pb-3">
            Configuración de Perfil y Notificaciones
          </h3>
          <form onSubmit={handleSaveProfile} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-[#0F1A19] mb-1.5">
                Nombre Completo
              </label>
              <input
                type="text"
                value={editNombre}
                onChange={(e) => setEditNombre(e.target.value)}
                className="w-full px-4 py-2.5 bg-[#F2F4EF] border border-[#E0E4DC] rounded-2xl text-xs font-semibold text-[#0F1A19] focus:ring-2 focus:ring-[#008345]/30"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#0F1A19] mb-1.5">
                Teléfono de Contacto
              </label>
              <input
                type="text"
                value={editTelefono}
                onChange={(e) => setEditTelefono(e.target.value)}
                className="w-full px-4 py-2.5 bg-[#F2F4EF] border border-[#E0E4DC] rounded-2xl text-xs font-semibold text-[#0F1A19] focus:ring-2 focus:ring-[#008345]/30"
              />
            </div>

            <div className="pt-2">
              <label className="flex items-center gap-3 cursor-pointer text-xs font-semibold text-[#0F1A19]">
                <input
                  type="checkbox"
                  checked={notifEmail}
                  onChange={(e) => setNotifEmail(e.target.checked)}
                  className="w-4 h-4 text-[#008345] rounded border-[#E0E4DC] focus:ring-[#008345]"
                />
                Recibir alertas de reservas y avisos institucionales al correo
              </label>
            </div>

            <button
              type="submit"
              className="px-6 py-2.5 bg-[#008345] hover:bg-[#006636] text-white font-extrabold text-xs rounded-full shadow-md transition-all"
            >
              Guardar Cambios
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
