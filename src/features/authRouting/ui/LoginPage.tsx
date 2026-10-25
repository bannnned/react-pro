import { useState } from 'react';
import type { FormEvent } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../model/useAuth';
import styles from './AuthRouting.module.css';

export function LoginPage() {
  const { isAuthenticated, isLoading, login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  if (isAuthenticated) {
    return <Navigate to="/profile" replace />;
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');

    try {
      await login(email, password);
      navigate('/profile', { replace: true });
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : 'Не удалось войти в аккаунт',
      );
    }
  };

  return (
    <main className={styles.page}>
      <section className={styles.loginLayout}>
        <div className={styles.intro}>
          <p className={styles.eyebrow}>Домашнее задание 6</p>
          <h1>Вход в аккаунт</h1>
          <p>
            После входа откроется личный профиль. Без авторизации эта страница недоступна.
          </p>
          <Link className={styles.textLink} to="/public">
            Перейти на открытую страницу
          </Link>
        </div>

        <form className={styles.form} onSubmit={handleSubmit}>
          <h2>Введите данные</h2>
          <p className={styles.hint}>Для проверки: john@mail.com и пароль changeme</p>

          <label className={styles.field}>
            Email
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              autoComplete="email"
              placeholder="name@example.com"
              required
            />
          </label>

          <label className={styles.field}>
            Пароль
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete="current-password"
              placeholder="Введите пароль"
              required
            />
          </label>

          {error && <p className={styles.error}>{error}</p>}

          <button className={styles.primaryButton} type="submit" disabled={isLoading}>
            {isLoading ? 'Входим...' : 'Войти'}
          </button>
        </form>
      </section>
    </main>
  );
}
