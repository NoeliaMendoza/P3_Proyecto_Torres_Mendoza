import { NavLink } from 'react-router-dom';
import { Avatar, Button, Chip } from '@heroui/react';
import {
  HiAcademicCap,
  HiArrowRightOnRectangle,
  HiBuildingOffice2,
  HiCalendarDays,
  HiChevronLeft,
  HiMagnifyingGlass,
  HiShieldCheck,
  HiSquares2X2,
  HiUser,
} from 'react-icons/hi2';
import { useAuthStore } from '../../store/authStore';
import { useUIStore } from '../../store/uiStore';
import { DEFAULT_PROFILE_AVATAR } from '../../constants/ui';

const BASE_LINKS = [
  { to: '/dashboard', label: 'Resumen', icon: HiSquares2X2 },
  { to: '/espacios', label: 'Espacios académicos', icon: HiBuildingOffice2 },
  { to: '/objetos-perdidos', label: 'Objetos perdidos', icon: HiMagnifyingGlass },
  { to: '/perfil', label: 'Mi perfil', icon: HiUser },
];

export const Sidebar = () => {
  const { usuario, logout } = useAuthStore();
  const { sidebarOpen, toggleSidebar } = useUIStore();
  const links = usuario?.rol === 'admin'
    ? [
        ...BASE_LINKS,
        { to: '/admin/reservas', label: 'Gestión de reservas', icon: HiCalendarDays },
        { to: '/admin/espacios', label: 'Administrar espacios', icon: HiShieldCheck },
      ]
    : BASE_LINKS;

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-40 flex flex-col border-r border-white/10 bg-[#036666] text-white shadow-[16px_0_40px_rgba(3,102,102,0.10)] transition-all duration-300 ${
        sidebarOpen ? 'w-64' : 'w-20'
      }`}
    >
      <div className="flex h-20 items-center justify-between border-b border-white/10 px-4">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-[#99E2B4] text-[#036666] shadow-lg shadow-black/10">
            <HiAcademicCap className="h-6 w-6" />
          </div>
          {sidebarOpen && (
            <div className="leading-none">
              <span className="block font-heading text-base font-extrabold tracking-tight">
                ESPE<span className="text-[#99E2B4]">Connect</span>
              </span>
              <span className="text-[10px] font-medium tracking-wide text-[#C8E8D7]">Campus digital</span>
            </div>
          )}
        </div>
        <Button
          isIconOnly
          variant="light"
          onPress={toggleSidebar}
          aria-label="Alternar menú lateral"
          className="hidden rounded-xl text-[#C8E8D7] hover:bg-white/10 hover:text-white md:flex"
        >
          <HiChevronLeft className={`h-5 w-5 transition-transform ${sidebarOpen ? '' : 'rotate-180'}`} />
        </Button>
      </div>

      {sidebarOpen && usuario && (
        <div className="mx-3 mt-4 flex items-center gap-3 rounded-2xl border border-white/10 bg-white/8 p-3">
          <Avatar
            className="h-10 w-10 shrink-0 bg-[#78C6A3] text-[#036666]"
          >
            <Avatar.Image
              src={usuario.avatar || DEFAULT_PROFILE_AVATAR}
              alt={`Foto de ${usuario.nombre}`}
              className="object-cover"
            />
            <Avatar.Fallback className="text-xs font-extrabold">
              {usuario.nombre?.split(' ').map((part) => part[0]).slice(0, 2).join('') || 'EC'}
            </Avatar.Fallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <p className="truncate text-xs font-bold text-white">{usuario.nombre}</p>
            <Chip size="sm" className="mt-1 h-5 bg-[#99E2B4] px-2 text-[9px] font-extrabold uppercase text-[#036666]">
              {usuario.rol || 'Estudiante'}
            </Chip>
          </div>
        </div>
      )}

      <nav className="flex-1 space-y-1.5 overflow-y-auto px-3 py-5">
        {links.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            title={!sidebarOpen ? label : undefined}
            className={({ isActive }) =>
              `flex items-center gap-3.5 rounded-2xl px-4 py-3 text-xs font-bold transition-all ${
                isActive
                  ? 'bg-white text-[#036666] shadow-lg shadow-black/10'
                  : 'text-[#C8E8D7] hover:bg-white/10 hover:text-white'
              }`
            }
          >
            <Icon className="h-5 w-5 shrink-0" />
            {sidebarOpen && <span className="truncate">{label}</span>}
          </NavLink>
        ))}
      </nav>

      <div className="border-t border-white/10 p-4">
        <Button
          variant="light"
          onPress={logout}
          className="w-full justify-start rounded-2xl px-4 text-xs font-bold text-[#C8E8D7] hover:bg-white/10 hover:text-white"
          startContent={<HiArrowRightOnRectangle className="h-5 w-5 shrink-0" />}
        >
          {sidebarOpen && 'Cerrar sesión'}
        </Button>
      </div>
    </aside>
  );
};
