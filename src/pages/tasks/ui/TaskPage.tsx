import { TaskWidget } from 'widgets/task';
import styles from './TaskPage.module.css';

export function TaskPage() {
  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <p className={styles.eyebrow}>Рабочий список</p>
        <h1>Мои задачи</h1>
        <p className={styles.description}>
          Небольшой список, чтобы держать в поле зрения текущую работу.
        </p>
      </header>
      <TaskWidget />
    </main>
  );
}
