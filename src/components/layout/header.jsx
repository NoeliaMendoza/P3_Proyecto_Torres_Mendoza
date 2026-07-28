import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Avatar, Button, Input } from '@heroui/react';
import {
  HiAcademicCap,
  HiArrowRightOnRectangle,
  HiBars3,
  HiBell,
  HiChevronDown,
  HiMagnifyingGlass,
  HiUser,
} from 'react-icons/hi2';
import { useAuthStore } from '../../store/authStore';
import { useUIStore } from '../../store/uiStore';
import { DEFAULT_PROFILE_AVATAR } from '../../constants/ui';

const PAGE_TITLES = {
  '/dashboard': ['Resumen', 'Tu actividad universitaria'],
  '/espacios': ['Espacios', 'Encuentra y reserva'],
  '/horarios': ['Horarios', 'Organiza tu jornada'],
  '/objetos-perdidos': ['Objetos perdidos', 'Comunidad y soporte'],
  '/perfil': ['Mi perfil', 'Datos y preferencias'],
  '/admin/espacios': ['Administración', 'Gestión de espacios'],
  '/admin/reservas': ['Reservas', 'Gestión administrativa'],
};

export const Header = () => {
  const { usuario, logout } = useAuthStore();
  const { toggleSidebar, notificaciones, toggleNotificationDrawer } = useUIStore();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const [title, eyebrow] = PAGE_TITLES[location.pathname] || ['ESPEConnect', 'Campus digital'];
  const unreadCount = notificaciones.filter((notification) => !notification.leido).length;

  const handleSearch = (event) => {
    event.preventDefault();
    if (searchTerm.trim()) navigate(`/espacios?search=${encodeURIComponent(searchTerm.trim())}`);
  };

  const closeAndNavigate = (path) => {
    setDropdownOpen(false);
    navigate(path);
  };

  return (
    <header className="sticky top-0 z-30 border-b border-[#D8EAE2] bg-white/88 px-4 py-3 backdrop-blur-xl md:px-8">
      <div className="mx-auto flex max-w-7xl items-center gap-4">
        <Button
          isIconOnly
          variant="light"
          onPress={toggleSidebar}
          aria-label="Alternar menú lateral"
          className="shrink-0 rounded-2xl text-[#036666]"
        >
          <HiBars3 className="h-5 w-5" />
        </Button>

        <div className="min-w-0">
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#469D89]">{eyebrow}</p>
          <h1 className="truncate font-heading text-lg font-extrabold text-[#123B38]">{title}</h1>
        </div>

        <form onSubmit={handleSearch} className="mx-auto hidden w-full max-w-md md:block">
          <Input
            aria-label="Buscar en ESPEConnect"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="Buscar espacios o servicios"
            startContent={<HiMagnifyingGlass className="h-4 w-4 text-[#469D89]" />}
            className="w-full"
            classNames={{
              inputWrapper: 'h-11 rounded-2xl border border-[#D8EAE2] bg-[#F4FAF7] shadow-none',
              input: 'text-sm text-[#123B38] placeholder:text-[#6A8881]',
            }}
          />
        </form>

        <div className="ml-auto flex items-center gap-2">
          <Button
            isIconOnly
            variant="flat"
            onPress={toggleNotificationDrawer}
            aria-label="Ver notificaciones"
            className="relative rounded-2xl bg-[#EAF6F0] text-[#036666]"
          >
            <HiBell className="h-5 w-5" />
            {unreadCount > 0 && (
              <span className="absolute right-1.5 top-1.5 grid h-4 min-w-4 place-items-center rounded-full bg-[#14746F] px-1 text-[9px] font-extrabold text-white">
                {unreadCount}
              </span>
            )}
          </Button>

          <div className="relative">
            <Button
              variant="bordered"
              onPress={() => setDropdownOpen((open) => !open)}
              className="h-11 gap-2 rounded-2xl border-[#D8EAE2] bg-white px-2.5 text-[#123B38]"
            >
              <Avatar
                size="sm"
                className="h-7 w-7 bg-[#78C6A3] text-[#036666]"
              >
                <Avatar.Image
                  src={usuario?.avatar || DEFAULT_PROFILE_AVATAR}
                  alt={`Foto de ${usuario?.nombre || 'usuario ESPE'}`}
                  className="object-cover"
                />
                <Avatar.Fallback className="text-[10px] font-extrabold">
                  {usuario?.nombre?.split(' ').map((part) => part[0]).slice(0, 2).join('') || 'EC'}
                </Avatar.Fallback>
              </Avatar>
              <span className="hidden max-w-28 truncate text-xs font-bold lg:block">
                {usuario?.nombre?.split(' ').slice(0, 2).join(' ')}
              </span>
              <HiChevronDown className="hidden h-4 w-4 text-[#52716B] lg:block" />
            </Button>

            {dropdownOpen && (
              <>
                <button
                  aria-label="Cerrar menú de usuario"
                  onClick={() => setDropdownOpen(false)}
                  className="fixed inset-0 z-40 cursor-default"
                />
                <div className="surface-card absolute right-0 z-50 mt-2 w-64 overflow-hidden p-2">
                  <div className="border-b border-[#D8EAE2] px-3 py-3">
                    <p className="truncate text-sm font-extrabold text-[#123B38]">{usuario?.nombre}</p>
                    <p className="truncate text-xs text-[#52716B]">{usuario?.correo}</p>
                  </div>
                  <Button
                    variant="light"
                    onPress={() => closeAndNavigate('/perfil')}
                    className="mt-1 w-full justify-start rounded-xl text-[#123B38]"
                    startContent={<HiUser className="h-4 w-4 text-[#358F80]" />}
                  >
                    Mi perfil
                  </Button>
                  <Button
                    variant="light"
                    onPress={() => closeAndNavigate('/perfil?tab=reservas')}
                    className="w-full justify-start rounded-xl text-[#123B38]"
                    startContent={<HiAcademicCap className="h-4 w-4 text-[#358F80]" />}
                  >
                    Mis reservas
                  </Button>
                  <Button
                    variant="light"
                    color="danger"
                    onPress={logout}
                    className="w-full justify-start rounded-xl"
                    startContent={<HiArrowRightOnRectangle className="h-4 w-4" />}
                  >
                    Cerrar sesión
                  </Button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
