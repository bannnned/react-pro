import { Link } from 'react-router-dom';
import { useAuth } from '../model/useAuth';
import styles from './AuthRouting.module.css';

export function PublicPage() {
  const { isAuthenticated } = useAuth();

  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <Link className={styles.logo} to="/public">
          Открытая зона
        </Link>
        <nav className={styles.navigation} aria-label="Навигация">
          <Link to="/refs">Примеры useRef</Link>
          <Link to={isAuthenticated ? '/profile' : '/login'}>
            {isAuthenticated ? 'Профиль' : 'Войти'}
          </Link>
        </nav>
      </header>

      <section className={styles.publicCard}>
        <p className={styles.eyebrow}>Публичный маршрут</p>
        <h1>Эта страница доступна всем</h1>
        <p>
          Ее можно открыть без токена. Для личного профиля потребуется войти в аккаунт.
        </p>
        <Link className={styles.primaryLink} to={isAuthenticated ? '/profile' : '/login'}>
          {isAuthenticated ? 'Открыть профиль' : 'Перейти ко входу'}
        </Link>
      </section>
    </main>
  );
}
