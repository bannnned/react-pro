import { useState } from 'react';
import type { Task } from 'entities/task';

export type Filter = 'all' | 'completed' | 'incomplete';

const initialTasks: Task[] = [
  { id: '1', title: 'Настроить структуру проекта', completed: true },
  { id: '2', title: 'Добавить маршрутизацию', completed: true },
  { id: '3', title: 'Собрать список задач', completed: false },
  { id: '4', title: 'Проверить линтер и сборку', completed: false },
];

export function useTasks(initial: Task[] = initialTasks): {
  tasks: Task[];
  filter: Filter;
  setFilter: (filter: Filter) => void;
  removeTask: (id: string) => void;
} {
  const [tasks, setTasks] = useState(initial);
  const [filter, setFilter] = useState<Filter>('all');

  const filteredTasks = tasks.filter((task) => {
    if (filter === 'completed') return task.completed;
    if (filter === 'incomplete') return !task.completed;
    return true;
  });

  const removeTask = (id: string) => {
    setTasks((currentTasks) => currentTasks.filter((task) => task.id !== id));
  };

  return { tasks: filteredTasks, filter, setFilter, removeTask };
}
