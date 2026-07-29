import { Header } from './header';
import { Sidebar } from './sidebar';
import { NotificationDrawer } from '../common/NotificationDrawer';
import { AIAssistant } from '../assistant/AIAssistant';
import { useUIStore } from '../../store/uiStore';

export const Layout = ({ children }) => {
  const sidebarOpen = useUIStore((s) => s.sidebarOpen);

  return (
    <div className="app-surface min-h-screen flex flex-col font-sans">
      <Sidebar />
      <NotificationDrawer />
      <AIAssistant />

      <div
        className={`flex-1 flex flex-col transition-all duration-300 ${
          sidebarOpen ? 'md:ml-64' : 'md:ml-20'
        }`}
      >
        <Header />
        <main className="mx-auto w-full min-w-0 max-w-7xl flex-1 px-3 py-4 sm:px-5 md:p-8">
          {children}
        </main>
        <footer className="border-t border-[#D8EAE2] bg-white/70 px-4 py-5 text-center text-[11px] font-semibold text-[#52716B] sm:px-8 sm:text-xs">
          <p>© 2026 Universidad de las Fuerzas Armadas ESPE · ESPEConnect</p>
        </footer>
      </div>
    </div>
  );
};
