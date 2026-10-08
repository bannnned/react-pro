import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useGetTasksQuery, type Task } from 'entities/task';

export type Filter = 'all' | 'completed' | 'incomplete';

export function useTasks(): {
  tasks: Task[];
  filter: Filter;
  setFilter: (filter: Filter) => void;
  removeTask: (id: number) => void;
  toggleTask: (id: number) => void;
  isLoading: boolean;
  isError: boolean;
} {
  const { data: remoteTasks, isLoading, isError } = useGetTasksQuery();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filter, setFilter] = useState<Filter>('all');
  const isInitialized = useRef(false);

  useEffect(() => {
    if (remoteTasks && !isInitialized.current) {
      setTasks(remoteTasks);
      isInitialized.current = true;
    }
  }, [remoteTasks]);

  const filteredTasks = useMemo(
    () =>
      tasks.filter((task) => {
        if (filter === 'completed') return task.completed;
        if (filter === 'incomplete') return !task.completed;
        return true;
      }),
    [filter, tasks],
  );

  const removeTask = useCallback((id: number) => {
    setTasks((currentTasks) => currentTasks.filter((task) => task.id !== id));
  }, []);

  const toggleTask = useCallback((id: number) => {
    setTasks((currentTasks) =>
      currentTasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task,
      ),
    );
  }, []);

  return {
    tasks: filteredTasks,
    filter,
    setFilter,
    removeTask,
    toggleTask,
    isLoading,
    isError,
  };
}
