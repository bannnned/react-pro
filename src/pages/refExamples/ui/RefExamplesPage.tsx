import { Link } from 'react-router-dom';
import {
  ClickTimer,
  DebouncedLogger,
  FocusTracker,
  PreviousInput,
  WebSocketLogger,
} from 'features/refExamples';
import styles from './RefExamplesPage.module.css';

export function RefExamplesPage() {
  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <div>
          <p className={styles.eyebrow}>Домашнее задание 5</p>
          <h1>Работа с useRef</h1>
          <p className={styles.description}>
            Небольшие примеры хранения значений между рендерами и управления DOM.
            Результаты некоторых действий можно увидеть в консоли браузера.
          </p>
        </div>
        <nav className={styles.navigation} aria-label="Другие задания">
          <Link to="/tasks">Задачи</Link>
          <Link to="/registration">Регистрация</Link>
        </nav>
      </header>

      <section className={styles.grid} aria-label="Примеры useRef">
        <ClickTimer />
        <PreviousInput />
        <FocusTracker />
        <DebouncedLogger />
        <WebSocketLogger />
      </section>
    </main>
  );
}
