import { TaskCard, type Task } from 'entities/task';
import { FilterButton } from 'shared/ui';
import type { Filter } from 'widgets/taskList/model/useTasks';
import styles from './TaskList.module.css';

interface TaskListProps {
  tasks: Task[];
  filter: Filter;
  onFilterChange: (filter: Filter) => void;
  onRemove: (id: string) => void;
  onToggle: (id: string) => void;
}

const filters: Array<{ value: Filter; label: string }> = [
  { value: 'all', label: 'Все' },
  { value: 'incomplete', label: 'В работе' },
  { value: 'completed', label: 'Готово' },
];

export function TaskList({
  tasks,
  filter,
  onFilterChange,
  onRemove,
  onToggle,
}: TaskListProps) {
  return (
    <section aria-label="Список задач">
      <div className={styles.filters} aria-label="Фильтр задач">
        {filters.map((item) => (
          <FilterButton
            key={item.value}
            active={filter === item.value}
            onClick={() => onFilterChange(item.value)}
          >
            {item.label}
          </FilterButton>
        ))}
      </div>

      {tasks.length > 0 ? (
        <ul className={styles.list}>
          {tasks.map((task) => (
            <li className={styles.item} key={task.id}>
              <TaskCard task={task} onRemove={onRemove} onToggle={onToggle} />
            </li>
          ))}
        </ul>
      ) : (
        <p className={styles.empty}>Здесь пока нет задач.</p>
      )}
    </section>
  );
}
