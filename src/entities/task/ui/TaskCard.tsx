import type { Task } from 'entities/task/model/types';
import styles from './TaskCard.module.css';

interface TaskCardProps {
  task: Task;
}

export function TaskCard({ task }: TaskCardProps) {
  const status = task.completed ? 'Выполнено' : 'В работе';

  return (
    <article className={`${styles.card} ${task.completed ? styles.completed : ''}`}>
      <span className={styles.mark} aria-hidden="true">
        {task.completed ? '✓' : ''}
      </span>
      <div>
        <h2 className={styles.title}>{task.title}</h2>
        <p className={styles.status}>{status}</p>
      </div>
    </article>
  );
}
