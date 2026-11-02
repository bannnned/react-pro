import { useActionState } from 'react';
import styles from './React19Examples.module.css';

type SaveState = {
  status: 'idle' | 'success';
  message: string;
};

const initialState: SaveState = {
  status: 'idle',
  message: 'Форма готова к сохранению',
};

function wait(delay: number) {
  return new Promise((resolve) => setTimeout(resolve, delay));
}

async function saveNote(_: SaveState, formData: FormData): Promise<SaveState> {
  const note = String(formData.get('note') ?? '').trim();

  await wait(1000);

  return {
    status: 'success',
    message: `Сохранено: ${note}`,
  };
}

export function FormWithAsyncSave() {
  const [state, formAction, isPending] = useActionState(saveNote, initialState);

  const statusText = isPending
    ? 'Сохраняем...'
    : state.status === 'success'
      ? state.message
      : initialState.message;

  return (
    <article className={styles.card}>
      <div className={styles.heading}>
        <h2>Асинхронное сохранение</h2>
        <p>Форма показывает состояние запроса и очищается после успешного сохранения.</p>
      </div>

      <form className={styles.form} action={formAction}>
        <label className={styles.field}>
          Текст заметки
          <input name="note" placeholder="Например, подготовить презентацию" required />
        </label>
        <button className={styles.button} type="submit" disabled={isPending}>
          {isPending ? 'Сохраняем...' : 'Сохранить'}
        </button>
      </form>

      <p className={styles.status} aria-live="polite">
        {statusText}
      </p>
    </article>
  );
}
