import { motion, AnimatePresence } from 'framer-motion';
import { 
  HiXMark, 
  HiBell, 
  HiCheckCircle, 
  HiTag, 
  HiInformationCircle, 
  HiCheckBadge,
  HiTrash
} from 'react-icons/hi2';
import { useUIStore } from '../../store/uiStore';

export const NotificationDrawer = () => {
  const { 
    notificationDrawerOpen, 
    toggleNotificationDrawer, 
    notificaciones, 
    marcarNotificacionLeida, 
    marcarTodasLeidas 
  } = useUIStore();

  const unreadCount = notificaciones.filter(n => !n.leido).length;

  const getCategoryIcon = (categoria) => {
    switch (categoria) {
      case 'reserva':
        return <HiCheckCircle className="w-5 h-5 text-emerald-600" />;
      case 'objeto':
        return <HiTag className="w-5 h-5 text-amber-500" />;
      default:
        return <HiInformationCircle className="w-5 h-5 text-blue-500" />;
    }
  };

  return (
    <AnimatePresence>
      {notificationDrawerOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={toggleNotificationDrawer}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 transition-opacity"
          />

          {/* Drawer Panel */}
          <motion.aside
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-white shadow-2xl z-50 flex flex-col border-l border-slate-200"
          >
            {/* Header */}
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-emerald-100/80 rounded-xl text-emerald-700">
                  <HiBell className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                    Notificaciones
                    {unreadCount > 0 && (
                      <span className="px-2 py-0.5 text-xs font-semibold bg-emerald-600 text-white rounded-full">
                        {unreadCount} nuevas
                      </span>
                    )}
                  </h2>
                  <p className="text-xs text-slate-500">Centro de novedades institucionales</p>
                </div>
              </div>
              <button
                onClick={toggleNotificationDrawer}
                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 rounded-xl transition-colors"
                aria-label="Cerrar notificaciones"
              >
                <HiXMark className="w-5 h-5" />
              </button>
            </div>

            {/* Actions Bar */}
            {notificaciones.length > 0 && (
              <div className="px-5 py-2.5 bg-slate-100/60 border-b border-slate-200/60 flex items-center justify-between text-xs text-slate-600">
                <span>{notificaciones.length} notificaciones totales</span>
                {unreadCount > 0 && (
                  <button
                    onClick={marcarTodasLeidas}
                    className="flex items-center gap-1 font-medium text-emerald-700 hover:text-emerald-800 transition-colors"
                  >
                    <HiCheckBadge className="w-4 h-4" />
                    Marcar todas como leídas
                  </button>
                )}
              </div>
            )}

            {/* Notifications List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {notificaciones.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-400">
                  <HiBell className="w-12 h-12 stroke-1 text-slate-300 mb-3" />
                  <p className="font-semibold text-slate-600">Sin notificaciones pendientes</p>
                  <p className="text-xs text-slate-400 mt-1">
                    Te avisaremos cuando haya actualizaciones sobre tus reservas u objetos reportados.
                  </p>
                </div>
              ) : (
                notificaciones.map((n) => (
                  <motion.div
                    key={n.id}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    onClick={() => marcarNotificacionLeida(n.id)}
                    className={`p-4 rounded-xl border transition-all cursor-pointer ${
                      n.leido
                        ? 'bg-white border-slate-200/80 opacity-75'
                        : 'bg-emerald-50/40 border-emerald-200/70 shadow-xs'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5 p-1.5 rounded-lg bg-white shadow-xs border border-slate-100">
                        {getCategoryIcon(n.categoria)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h4 className="text-sm font-semibold text-slate-900 truncate">
                            {n.titulo}
                          </h4>
                          <span className="text-[11px] text-slate-400 font-medium ml-2 whitespace-nowrap">
                            {n.fecha}
                          </span>
                        </div>
                        <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                          {n.mensaje}
                        </p>
                      </div>
                      {!n.leido && (
                        <span className="w-2 h-2 rounded-full bg-emerald-600 shrink-0 mt-1.5" />
                      )}
                    </div>
                  </motion.div>
                ))
              )}
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-slate-100 bg-slate-50/50 text-center">
              <p className="text-xs text-slate-400 font-medium">
                Universidad de las Fuerzas Armadas ESPE &bull; ESPEConnect 2026
              </p>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
};
