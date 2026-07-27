import styles from './footer.module.css';

export const Footer = () => (
  <footer className={styles.footer}>
    <p>&copy; {new Date().getFullYear()} ESPEConnect. Todos los derechos reservados.</p>
    <p>Universidad de las Fuerzas Armadas ESPE - Santo Domingo</p>
  </footer>
);
