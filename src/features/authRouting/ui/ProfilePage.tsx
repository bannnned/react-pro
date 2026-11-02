import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../model/useAuth';
import styles from './AuthRouting.module.css';

export function ProfilePage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <Link className={styles.logo} to="/profile">
          Личный кабинет
        </Link>
        <nav className={styles.navigation} aria-label="Навигация профиля">
          <Link to="/public">Открытая страница</Link>
          <button type="button" onClick={handleLogout}>
            Выйти
          </button>
        </nav>
      </header>

      <section className={styles.profileCard}>
        <p className={styles.eyebrow}>Защищенный маршрут</p>
        <div className={styles.avatar} aria-hidden="true">
          {user?.name.charAt(0).toUpperCase() || '?'}
        </div>
        <h1>{user?.name || 'Пользователь'}</h1>
        <p className={styles.profileEmail}>{user?.email}</p>
        <dl className={styles.details}>
          <div>
            <dt>Роль</dt>
            <dd>{user?.role || 'customer'}</dd>
          </div>
          <div>
            <dt>Статус</dt>
            <dd>Авторизован</dd>
          </div>
        </dl>
      </section>
    </main>
  );
}
