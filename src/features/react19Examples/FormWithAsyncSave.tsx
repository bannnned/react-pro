import { useActionState } from 'react';
import styles from './React19Examples.module.css';

type SaveState = {
  message: string;
};

const initialState: SaveState = {
  message: 'Ожидание',
};

function wait(delay: number) {
  return new Promise((resolve) => setTimeout(resolve, delay));
}

async function saveNote(_: SaveState, formData: FormData): Promise<SaveState> {
  const note = String(formData.get('note') ?? '').trim();

  await wait(1000);

  return {
    message: `Сохранено: ${note}`,
  };
}

export function FormWithAsyncSave() {
  const [state, formAction, isPending] = useActionState(saveNote, initialState);

  return (
    <article className={styles.card}>
      <h2>Асинхронное сохранение</h2>

      <form className={styles.form} action={formAction}>
        <label className={styles.field}>
          Заметка
          <input name="note" required />
        </label>
        <button className={styles.button} type="submit" disabled={isPending}>
          {isPending ? 'Сохраняем...' : 'Сохранить'}
        </button>
      </form>

      <p className={styles.status} aria-live="polite">
        {isPending ? 'Сохранение...' : state.message}
      </p>
    </article>
  );
}
