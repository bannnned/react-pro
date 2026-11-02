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
          Назад
        </Link>

        <h1>React 19</h1>

        <section className={styles.grid}>
          <FormWithAsyncSave />
          <TodoListOptimistic />
          <ActionStateWithReducer />
        </section>
      </div>
    </main>
  );
}
