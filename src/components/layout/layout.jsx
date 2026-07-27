import { Header } from './header';
import { Sidebar } from './sidebar';
import { NotificationDrawer } from '../common/NotificationDrawer';
import { useUIStore } from '../../store/uiStore';

export const Layout = ({ children }) => {
  const sidebarOpen = useUIStore((s) => s.sidebarOpen);

  return (
    <div className="min-h-screen bg-[#F2F4EF] flex flex-col font-sans">
      <Sidebar />
      <NotificationDrawer />

      <div
        className={`flex-1 flex flex-col transition-all duration-300 ${
          sidebarOpen ? 'md:ml-64' : 'md:ml-20'
        }`}
      >
        <Header />
        <main className="flex-1 p-4 md:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
        <footer className="py-5 px-8 bg-white border-t border-[#E0E4DC] text-center text-xs text-[#586663] font-semibold">
          <p>© 2026 Universidad de las Fuerzas Armadas ESPE &bull; ESPEConnect Platform</p>
        </footer>
      </div>
    </div>
  );
};
