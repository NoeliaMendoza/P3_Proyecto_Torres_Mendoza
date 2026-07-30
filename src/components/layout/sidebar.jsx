import { useEffect, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Avatar, Button, Chip, Drawer } from '@heroui/react';
import {
  HiAcademicCap,
  HiArrowRightOnRectangle,
  HiBuildingOffice2,
  HiCalendarDays,
  HiChevronLeft,
  HiClock,
  HiMagnifyingGlass,
  HiShieldCheck,
  HiSquares2X2,
  HiUser,
  HiXMark,
} from 'react-icons/hi2';
import { useAuthStore } from '../../store/authStore';
import { useUIStore } from '../../store/uiStore';
import { getAvatarUrl } from '../../constants/ui';

const BASE_LINKS = [
  { to: '/dashboard', label: 'Resumen', icon: HiSquares2X2 },
  { to: '/horarios', label: 'Mi horario', icon: HiClock },
  { to: '/espacios', label: 'Espacios académicos', icon: HiBuildingOffice2 },
  { to: '/objetos-perdidos', label: 'Objetos perdidos', icon: HiMagnifyingGlass },
  { to: '/perfil', label: 'Mi perfil', icon: HiUser },
];

const Brand = ({ compact = false }) => (
  <div className="flex min-w-0 items-center gap-3">
    <div className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-[#99E2B4] text-[#036666] shadow-lg shadow-black/10">
      <HiAcademicCap className="h-6 w-6" />
    </div>
    {!compact && (
      <div className="min-w-0 leading-none">
        <span className="block truncate font-heading text-base font-extrabold tracking-tight">
          ESPE<span className="text-[#99E2B4]">Connect</span>
        </span>
        <span className="text-[10px] font-medium tracking-wide text-[#C8E8D7]">
          Campus digital universitario
        </span>
      </div>
    )}
  </div>
);

const UserSummary = ({ usuario }) => (
  <div className="mx-3 mt-4 flex items-center gap-3 rounded-2xl border border-white/10 bg-white/10 p-3">
    <Avatar className="h-11 w-11 shrink-0 bg-[#78C6A3] text-[#036666]">
      <Avatar.Image
        src={usuario.avatar || getAvatarUrl(usuario.nombre)}
        alt={`Foto de ${usuario.nombre}`}
        className="object-cover"
      />
      <Avatar.Fallback className="text-xs font-extrabold">
        {usuario.nombre?.split(' ').map((part) => part[0]).slice(0, 2).join('') || 'EC'}
      </Avatar.Fallback>
    </Avatar>
    <div className="min-w-0 flex-1">
      <p className="truncate text-xs font-bold text-white">{usuario.nombre}</p>
      <Chip
        size="sm"
        className="mt-1 h-5 bg-[#99E2B4] px-2 text-[9px] font-extrabold uppercase text-[#036666]"
      >
        {usuario.rol || 'Estudiante'}
      </Chip>
    </div>
  </div>
);

const Navigation = ({ links, expanded, onNavigate }) => (
  <nav className="flex-1 space-y-1 overflow-y-auto overscroll-contain px-3 py-4">
    {links.map(({ to, label, icon: Icon }) => (
      <NavLink
        key={to}
        to={to}
        onClick={onNavigate}
        title={!expanded ? label : undefined}
        className={({ isActive }) =>
          `flex min-h-11 items-center rounded-2xl text-xs font-bold transition-colors ${
            expanded ? 'gap-3.5 px-4' : 'justify-center px-2'
          } ${
            isActive
              ? 'bg-white text-[#036666] shadow-lg shadow-black/10'
              : 'text-[#C8E8D7] hover:bg-white/10 hover:text-white'
          }`
        }
      >
        <Icon className="h-5 w-5 shrink-0" />
        {expanded && <span className="truncate">{label}</span>}
      </NavLink>
    ))}
  </nav>
);

const LogoutButton = ({ expanded, logout }) => (
  <div className="border-t border-white/10 p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
    <Button
      variant="light"
      onPress={logout}
      isIconOnly={!expanded}
      aria-label="Cerrar sesión"
      className={`min-h-11 rounded-2xl text-xs font-bold text-[#C8E8D7] hover:bg-white/10 hover:text-white ${
        expanded ? 'w-full justify-start px-4' : 'w-full'
      }`}
      startContent={expanded ? <HiArrowRightOnRectangle className="h-5 w-5 shrink-0" /> : null}
    >
      {expanded ? 'Cerrar sesión' : <HiArrowRightOnRectangle className="h-5 w-5" />}
    </Button>
  </div>
);

export const Sidebar = () => {
  const { usuario, logout } = useAuthStore();
  const { sidebarOpen, toggleSidebar, setSidebarOpen } = useUIStore();
  const [isMobile, setIsMobile] = useState(false);
  const location = useLocation();
  const links = usuario?.rol === 'admin'
    ? [
        ...BASE_LINKS,
        { to: '/admin/reservas', label: 'Gestión de reservas', icon: HiCalendarDays },
        { to: '/admin/espacios', label: 'Administrar espacios', icon: HiShieldCheck },
      ]
    : BASE_LINKS;

  useEffect(() => {
    const mobile = window.matchMedia('(max-width: 767px)');
    const syncViewport = (event) => {
      setIsMobile(event.matches);
      if (event.matches) setSidebarOpen(false);
    };
    syncViewport(mobile);
    mobile.addEventListener('change', syncViewport);
    return () => mobile.removeEventListener('change', syncViewport);
  }, [setSidebarOpen]);

  useEffect(() => {
    if (isMobile) setSidebarOpen(false);
  }, [isMobile, location.pathname, setSidebarOpen]);

  return (
    <>
      <Drawer
        isOpen={isMobile && sidebarOpen}
        onOpenChange={(open) => {
          if (isMobile) setSidebarOpen(open);
        }}
      >
        <Drawer.Backdrop
          isDismissable
          className="z-50 bg-[#024E50]/50 backdrop-blur-sm md:hidden"
        >
          <Drawer.Content
            placement="left"
            className="z-50 my-2 ml-2 h-[calc(100dvh-1rem)] w-[min(20rem,calc(100vw-1rem))] rounded-[28px] !bg-[#036666] text-white shadow-2xl md:hidden"
          >
            <Drawer.Dialog className="flex h-full min-h-0 flex-col overflow-hidden !bg-[#036666] text-white outline-none">
              <Drawer.Header className="flex h-20 shrink-0 items-center justify-between border-b border-white/10 px-4">
                <Drawer.Heading className="min-w-0">
                  <Brand />
                </Drawer.Heading>
                <Drawer.CloseTrigger
                  aria-label="Cerrar menú"
                  className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-white/10 text-[#C8E8D7] transition hover:bg-white/20 hover:text-white"
                >
                  <HiXMark className="h-5 w-5" />
                </Drawer.CloseTrigger>
              </Drawer.Header>
              {usuario && <UserSummary usuario={usuario} />}
              <Drawer.Body className="flex min-h-0 flex-1 flex-col overflow-hidden p-0">
                <Navigation
                  links={links}
                  expanded
                  onNavigate={() => setSidebarOpen(false)}
                />
              </Drawer.Body>
              <Drawer.Footer className="block shrink-0 p-0">
                <LogoutButton expanded logout={logout} />
              </Drawer.Footer>
            </Drawer.Dialog>
          </Drawer.Content>
        </Drawer.Backdrop>
      </Drawer>

      <aside
        className={`fixed inset-y-0 left-0 z-40 hidden flex-col border-r border-white/10 bg-[#036666] text-white shadow-[16px_0_40px_rgba(3,102,102,0.18)] transition-[width] duration-300 md:flex ${
          sidebarOpen ? 'w-64' : 'w-20'
        }`}
      >
        <div className={`flex h-20 shrink-0 items-center border-b border-white/10 ${sidebarOpen ? 'justify-between px-4' : 'justify-center px-2'}`}>
          <Brand compact={!sidebarOpen} />
          {sidebarOpen && (
            <Button
              isIconOnly
              variant="light"
              onPress={toggleSidebar}
              aria-label="Contraer menú lateral"
              className="rounded-xl text-[#C8E8D7] hover:bg-white/10 hover:text-white"
            >
              <HiChevronLeft className="h-5 w-5" />
            </Button>
          )}
        </div>
        {!sidebarOpen && (
          <Button
            isIconOnly
            variant="light"
            onPress={toggleSidebar}
            aria-label="Expandir menú lateral"
            className="mx-auto mt-3 rounded-xl text-[#C8E8D7] hover:bg-white/10 hover:text-white"
          >
            <HiChevronLeft className="h-5 w-5 rotate-180" />
          </Button>
        )}
        {sidebarOpen && usuario && <UserSummary usuario={usuario} />}
        <Navigation links={links} expanded={sidebarOpen} />
        <LogoutButton expanded={sidebarOpen} logout={logout} />
      </aside>
    </>
  );
};
