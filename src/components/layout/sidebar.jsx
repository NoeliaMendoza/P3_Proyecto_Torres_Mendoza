import { NavLink } from 'react-router-dom';
import { 
  HiSquares2X2, 
  HiBuildingOffice2, 
  HiMagnifyingGlass, 
  HiUser, 
  HiShieldCheck, 
  HiArrowRightOnRectangle,
  HiChevronLeft,
  HiAcademicCap
} from 'react-icons/hi2';
import { useAuthStore } from '../../store/authStore';
import { useUIStore } from '../../store/uiStore';

export const Sidebar = () => {
  const { usuario, logout } = useAuthStore();
  const { sidebarOpen, toggleSidebar } = useUIStore();

  const links = [
    { to: '/dashboard', label: 'Dashboard', icon: HiSquares2X2 },
    { to: '/espacios', label: 'Espacios Académicos', icon: HiBuildingOffice2 },
    { to: '/objetos-perdidos', label: 'Objetos Perdidos', icon: HiMagnifyingGlass },
    { to: '/perfil', label: 'Mi Perfil', icon: HiUser },
  ];

  if (usuario?.rol === 'admin') {
    links.push({ to: '/admin/espacios', label: 'Gestión de Espacios', icon: HiShieldCheck });
  }

  return (
    <aside
      className={`fixed top-0 left-0 bottom-0 z-40 bg-[#122422] text-[#D1D9D6] flex flex-col transition-all duration-300 border-r border-[#1D3633] ${
        sidebarOpen ? 'w-64' : 'w-20'
      }`}
    >
      {/* Brand Header */}
      <div className="h-20 px-4 flex items-center justify-between border-b border-[#1D3633] bg-[#0E1B19]">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="w-11 h-11 rounded-2xl bg-[#008345] flex items-center justify-center text-white font-extrabold text-xl shadow-md shrink-0 border border-emerald-400/30">
            <HiAcademicCap className="w-6 h-6 text-white" />
          </div>
          {sidebarOpen && (
            <div className="leading-none">
              <span className="text-base font-extrabold tracking-tight text-white block font-heading">
                ESPE<span className="text-[#36D080]">Connect</span>
              </span>
              <span className="text-[10px] text-[#8EA09A] font-medium tracking-wide">
                Univ. Fuerzas Armadas
              </span>
            </div>
          )}
        </div>
        <button
          onClick={toggleSidebar}
          className="hidden md:flex p-2 rounded-full text-[#8EA09A] hover:text-white hover:bg-[#1D3633] transition-colors"
          aria-label="Alternar menú lateral"
        >
          <HiChevronLeft className={`w-5 h-5 transition-transform ${sidebarOpen ? '' : 'rotate-180'}`} />
        </button>
      </div>

      {/* User Quick Info */}
      {sidebarOpen && usuario && (
        <div className="mx-3 mt-4 p-3.5 rounded-2xl bg-[#1A322F] border border-[#264743] flex items-center gap-3">
          <img
            src={usuario.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80'}
            alt={usuario.nombre}
            className="w-10 h-10 rounded-full object-cover border-2 border-[#008345] shrink-0"
          />
          <div className="min-w-0 flex-1">
            <p className="text-xs font-bold text-white truncate">{usuario.nombre}</p>
            <span className="inline-block mt-0.5 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-full bg-[#0D1D1B] text-[#36D080] border border-[#008345]/40">
              {usuario.rol || 'Estudiante'}
            </span>
          </div>
        </div>
      )}

      {/* Navigation Links */}
      <nav className="flex-1 px-3 py-5 space-y-2 overflow-y-auto">
        {links.map((link) => {
          const Icon = link.icon;
          return (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `flex items-center gap-3.5 px-4 py-3 rounded-full font-bold text-xs transition-all ${
                  isActive
                    ? 'bg-[#008345] text-white shadow-lg shadow-[#008345]/20 font-extrabold'
                    : 'text-[#9EB0AA] hover:text-white hover:bg-[#1A322F]'
                }`
              }
            >
              <Icon className="w-5 h-5 shrink-0" />
              {sidebarOpen && <span className="truncate">{link.label}</span>}
            </NavLink>
          );
        })}
      </nav>

      {/* Logout Footer */}
      <div className="p-4 border-t border-[#1D3633] bg-[#0E1B19]">
        <button
          onClick={logout}
          className="w-full flex items-center gap-3.5 px-4 py-3 rounded-full font-bold text-xs text-rose-400 hover:text-rose-300 hover:bg-rose-950/40 transition-colors"
        >
          <HiArrowRightOnRectangle className="w-5 h-5 shrink-0" />
          {sidebarOpen && <span>Cerrar Sesión</span>}
        </button>
      </div>
    </aside>
  );
};
