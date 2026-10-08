import { TaskList, useTasks } from 'widgets/taskList';
import styles from './TaskWidget.module.css';

export function TaskWidget() {
  const { tasks, filter, setFilter, removeTask, toggleTask, isLoading, isError } =
    useTasks();

  return (
    <div className={styles.widget}>
      <div className={styles.summary}>
        <span>Текущие задачи</span>
        <span>{tasks.length}</span>
      </div>
      {isLoading && <p className={styles.message}>Загружаем задачи...</p>}
      {isError && <p className={styles.error}>Не получилось загрузить задачи.</p>}
      {!isLoading && !isError && (
        <TaskList
          tasks={tasks}
          filter={filter}
          onFilterChange={setFilter}
          onRemove={removeTask}
          onToggle={toggleTask}
        />
      )}
    </div>
  );
}
