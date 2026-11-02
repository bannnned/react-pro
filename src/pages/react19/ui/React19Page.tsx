import { Link } from 'react-router-dom';
import {
  ActionStateWithReducer,
  FormWithAsyncSave,
  TodoListOptimistic,
} from 'features/react19Examples';
import styles from './React19Page.module.css';

export function React19Page() {
  return (
    <main className={styles.page}>
      <div className={styles.container}>
        <Link className={styles.backLink} to="/public">
          Назад на главную
        </Link>

        <header className={styles.intro}>
          <p className={styles.eyebrow}>React 19</p>
          <h1>Actions на практике</h1>
          <p className={styles.description}>
            Три небольших примера с асинхронными формами, состоянием отправки и быстрым
            обновлением интерфейса.
          </p>
        </header>

        <section className={styles.grid}>
          <FormWithAsyncSave />
          <TodoListOptimistic />
          <ActionStateWithReducer />
        </section>
      </div>
    </main>
  );
}
