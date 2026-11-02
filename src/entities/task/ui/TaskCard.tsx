import { memo } from 'react';
import type { Task } from 'entities/task/model/types';
import styles from './TaskCard.module.css';

interface TaskCardProps {
  task: Task;
  onRemove: (id: number) => void;
  onToggle: (id: number) => void;
}

export const TaskCard = memo(function TaskCard({
  task,
  onRemove,
  onToggle,
}: TaskCardProps) {
  const status = task.completed ? 'Выполнено' : 'В работе';

  return (
    <article className={`${styles.card} ${task.completed ? styles.completed : ''}`}>
      <button
        className={styles.mark}
        type="button"
        onClick={() => onToggle(task.id)}
        aria-label={
          task.completed ? 'Вернуть задачу в работу' : 'Отметить задачу выполненной'
        }
      >
        {task.completed ? '✓' : ''}
      </button>
      <div>
        <h2 className={styles.title}>{task.title}</h2>
        <p className={styles.status}>{status}</p>
      </div>
      <button
        className={styles.removeButton}
        type="button"
        onClick={() => onRemove(task.id)}
        aria-label={`Удалить задачу «${task.title}»`}
      >
        Удалить
      </button>
    </article>
  );
});
