import { useOptimistic, useState } from 'react';
import styles from './React19Examples.module.css';

type Todo = {
  id: string;
  text: string;
  pending?: boolean;
};

const initialTodos: Todo[] = [{ id: 'first', text: 'Разобраться с React 19' }];

function wait(delay: number) {
  return new Promise((resolve) => setTimeout(resolve, delay));
}

export function TodoListOptimistic() {
  const [todos, setTodos] = useState(initialTodos);
  const [optimisticTodos, addOptimisticTodo] = useOptimistic(
    todos,
    (currentTodos, newTodo: Todo) => {
      if (currentTodos.some((todo) => todo.id === newTodo.id)) {
        return currentTodos;
      }

      return [...currentTodos, { ...newTodo, pending: true }];
    },
  );

  async function addTodo(formData: FormData) {
    const text = String(formData.get('todo') ?? '').trim();

    if (!text) {
      return;
    }

    const newTodo: Todo = {
      id: crypto.randomUUID(),
      text,
    };

    addOptimisticTodo(newTodo);
    await wait(1000);
    setTodos((currentTodos) => [...currentTodos, newTodo]);
  }

  return (
    <article className={styles.card}>
      <h2>Оптимистичный список</h2>

      <form className={styles.todoForm} action={addTodo}>
        <input name="todo" aria-label="Новая задача" required />
        <button className={styles.button} type="submit">
          Добавить
        </button>
      </form>

      <ul className={styles.todoList} aria-live="polite">
        {optimisticTodos.map((todo) => (
          <li
            className={`${styles.todoItem} ${todo.pending ? styles.todoItemPending : ''}`}
            key={todo.id}
          >
            <span>{todo.text}</span>
            {todo.pending && <span>сохраняется...</span>}
          </li>
        ))}
      </ul>
    </article>
  );
}
