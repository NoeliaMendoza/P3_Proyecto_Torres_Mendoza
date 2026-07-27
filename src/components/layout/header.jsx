import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  HiBars3, 
  HiBell, 
  HiMagnifyingGlass, 
  HiUser, 
  HiArrowRightOnRectangle,
  HiChevronDown,
  HiAcademicCap
} from 'react-icons/hi2';
import { useAuthStore } from '../../store/authStore';
import { useUIStore } from '../../store/uiStore';

export const Header = () => {
  const { usuario, logout } = useAuthStore();
  const { toggleSidebar, notificaciones, toggleNotificationDrawer } = useUIStore();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  const unreadCount = notificaciones.filter((n) => !n.leido).length;

  const getPageTitle = () => {
    switch (location.pathname) {
      case '/dashboard':
        return 'Dashboard Campus';
      case '/espacios':
        return 'Reserva de Espacios';
      case '/objetos-perdidos':
        return 'Objetos Perdidos';
      case '/perfil':
        return 'Perfil Estudiantil';
      case '/admin/espacios':
        return 'Administración';
      default:
        return 'ESPEConnect';
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;
    navigate(`/espacios?search=${encodeURIComponent(searchTerm)}`);
  };

  return (
    <header className="h-20 bg-[#F2F4EF]/90 backdrop-blur-md border-b border-[#E0E4DC] sticky top-0 z-30 px-4 md:px-8 flex items-center justify-between">
      {/* Left: Mobile Toggle & Page Breadcrumb Title */}
      <div className="flex items-center gap-3">
        <button
          onClick={toggleSidebar}
          className="p-2.5 rounded-full text-[#162E2B] hover:bg-[#E2E6DF] transition-colors"
          aria-label="Abrir menú"
        >
          <HiBars3 className="w-6 h-6" />
        </button>
        <div className="hidden sm:block">
          <div className="flex items-center gap-2 text-xs text-[#586663] font-semibold">
            <span>ESPEConnect</span>
            <span>/</span>
            <span className="text-[#008345] font-extrabold">{getPageTitle()}</span>
          </div>
        </div>
      </div>

      {/* Center: Search Input Bar (Pill style like reference design) */}
      <form onSubmit={handleSearchSubmit} className="flex-1 max-w-md mx-4 hidden md:block">
        <div className="relative">
          <HiMagnifyingGlass className="w-4 h-4 text-[#586663] absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar espacios, auditorios u objetos..."
            className="w-full pl-11 pr-4 py-2.5 text-xs bg-white border border-[#E0E4DC] rounded-full text-[#0F1A19] placeholder-[#8A9693] focus:outline-none focus:ring-2 focus:ring-[#008345]/30 focus:border-[#008345] shadow-xs transition-all"
          />
        </div>
      </form>

      {/* Right: Notifications & User Avatar Dropdown */}
      <div className="flex items-center gap-3">
        {/* Notification Bell Pill Button */}
        <button
          onClick={toggleNotificationDrawer}
          className="relative p-3 rounded-full bg-white border border-[#E0E4DC] text-[#162E2B] hover:bg-[#E7EBE2] transition-colors shadow-xs"
          aria-label="Ver notificaciones"
        >
          <HiBell className="w-5 h-5 text-[#162E2B]" />
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 w-4 h-4 bg-[#008345] text-white font-extrabold text-[10px] rounded-full flex items-center justify-center border-2 border-white shadow-xs">
              {unreadCount}
            </span>
          )}
        </button>

        {/* User Pill Button & Dropdown */}
        <div className="relative">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2.5 p-1.5 pr-3.5 bg-white border border-[#E0E4DC] rounded-full hover:bg-[#E7EBE2] transition-colors text-left shadow-xs"
          >
            <img
              src={usuario?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80'}
              alt={usuario?.nombre}
              className="w-8 h-8 rounded-full object-cover border border-[#008345]"
            />
            <div className="hidden lg:block">
              <p className="text-xs font-bold text-[#0F1A19] leading-tight">
                {usuario?.nombre?.split(' ')[0]} {usuario?.nombre?.split(' ')[1]}
              </p>
              <p className="text-[10px] text-[#586663] font-semibold">{usuario?.carrera || 'Estudiante ESPE'}</p>
            </div>
            <HiChevronDown className="w-4 h-4 text-[#586663] hidden lg:block" />
          </button>

          {/* Dropdown Menu */}
          {dropdownOpen && (
            <>
              <div
                onClick={() => setDropdownOpen(false)}
                className="fixed inset-0 z-40"
              />
              <div className="absolute right-0 mt-2 w-60 bg-white rounded-3xl shadow-xl border border-[#E0E4DC] py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="px-5 py-3 border-b border-[#E0E4DC]">
                  <p className="text-xs font-extrabold text-[#0F1A19]">{usuario?.nombre}</p>
                  <p className="text-[11px] text-[#586663] truncate">{usuario?.correo}</p>
                </div>
                <button
                  onClick={() => {
                    setDropdownOpen(false);
                    navigate('/perfil');
                  }}
                  className="w-full px-5 py-2.5 text-xs font-bold text-[#0F1A19] hover:bg-[#F2F4EF] flex items-center gap-3 transition-colors"
                >
                  <HiUser className="w-4 h-4 text-[#008345]" />
                  Ver Mi Perfil
                </button>
                <button
                  onClick={() => {
                    setDropdownOpen(false);
                    navigate('/perfil?tab=reservas');
                  }}
                  className="w-full px-5 py-2.5 text-xs font-bold text-[#0F1A19] hover:bg-[#F2F4EF] flex items-center gap-3 transition-colors"
                >
                  <HiAcademicCap className="w-4 h-4 text-[#008345]" />
                  Mis Reservas
                </button>
                <div className="my-1 border-t border-[#E0E4DC]" />
                <button
                  onClick={() => {
                    setDropdownOpen(false);
                    logout();
                  }}
                  className="w-full px-5 py-2.5 text-xs font-extrabold text-rose-600 hover:bg-rose-50 flex items-center gap-3 transition-colors"
                >
                  <HiArrowRightOnRectangle className="w-4 h-4 text-rose-500" />
                  Cerrar Sesión
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
};
