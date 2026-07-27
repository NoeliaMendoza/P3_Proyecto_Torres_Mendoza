import { useNavigate } from 'react-router-dom';
import { useAuthStore, useUIStore } from '../../store';
import styles from './header.module.css';

export const Header = () => {
  const { usuario, logout } = useAuthStore();
  const { toggleSidebar } = useUIStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className={styles.header}>
      <button className={styles.menuBtn} onClick={toggleSidebar} aria-label="Menú">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>
      <div className={styles.spacer} />
      <div className={styles.userArea}>
        <span className={styles.userName}>{usuario?.nombre || 'Usuario'}</span>
        <div className={styles.avatar}>{usuario?.nombre?.charAt(0)?.toUpperCase() || 'U'}</div>
        <button className={styles.logoutBtn} onClick={handleLogout} title="Cerrar sesión">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" y1="12" x2="9" y2="12" />
          </svg>
        </button>
      </div>
    </header>
  );
};
