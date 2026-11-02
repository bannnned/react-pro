import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../model/useAuth';
import styles from './AuthRouting.module.css';

export function ProtectedRoute() {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <main className={styles.centeredPage}>
        <p className={styles.loader}>Проверяем авторизацию...</p>
      </main>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
}
