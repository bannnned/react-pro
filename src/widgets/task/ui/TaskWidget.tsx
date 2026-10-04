import { TaskList, useTasks } from 'widgets/taskList';
import styles from './TaskWidget.module.css';

export function TaskWidget() {
  const { tasks, filter, setFilter, removeTask } = useTasks();

  return (
    <div className={styles.widget}>
      <div className={styles.summary}>
        <span>Текущие задачи</span>
        <span>{tasks.length}</span>
      </div>
      <TaskList
        tasks={tasks}
        filter={filter}
        onFilterChange={setFilter}
        onRemove={removeTask}
      />
    </div>
  );
}
