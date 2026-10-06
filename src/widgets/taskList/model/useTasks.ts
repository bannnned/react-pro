import { useCallback, useMemo, useState } from 'react';
import type { Task } from 'entities/task';

export type Filter = 'all' | 'completed' | 'incomplete';

export function useTasks(initial?: Task[]): {
  tasks: Task[];
  filter: Filter;
  setFilter: (filter: Filter) => void;
  removeTask: (id: string) => void;
  toggleTask: (id: string) => void;
} {
  const [tasks, setTasks] = useState<Task[]>(
    () =>
      initial ?? [
        { id: '1', title: 'Настроить структуру проекта', completed: true },
        { id: '2', title: 'Добавить маршрутизацию', completed: true },
        { id: '3', title: 'Собрать список задач', completed: false },
        { id: '4', title: 'Проверить линтер и сборку', completed: false },
      ],
  );
  const [filter, setFilter] = useState<Filter>('all');

  const filteredTasks = useMemo(
    () =>
      tasks.filter((task) => {
        if (filter === 'completed') return task.completed;
        if (filter === 'incomplete') return !task.completed;
        return true;
      }),
    [filter, tasks],
  );

  const removeTask = useCallback((id: string) => {
    setTasks((currentTasks) => currentTasks.filter((task) => task.id !== id));
  }, []);

  const toggleTask = useCallback((id: string) => {
    setTasks((currentTasks) =>
      currentTasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task,
      ),
    );
  }, []);

  return { tasks: filteredTasks, filter, setFilter, removeTask, toggleTask };
}
