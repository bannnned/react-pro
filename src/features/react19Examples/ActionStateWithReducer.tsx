import { useActionState, useState } from 'react';
import styles from './React19Examples.module.css';

type ProfileState = {
  status: 'idle' | 'success';
  message: string;
  submissionId: number;
};

const initialState: ProfileState = {
  status: 'idle',
  message: '',
  submissionId: 0,
};

function wait(delay: number) {
  return new Promise((resolve) => setTimeout(resolve, delay));
}

async function profileReducer(
  previousState: ProfileState,
  formData: FormData,
): Promise<ProfileState> {
  const name = String(formData.get('name') ?? '').trim();
  const email = String(formData.get('email') ?? '').trim();
  const message = String(formData.get('message') ?? '').trim();

  await wait(1000);

  return {
    status: 'success',
    message: `Профиль ${name} сохранен. Сообщение из ${message.length} символов отправлено с адреса ${email}`,
    submissionId: previousState.submissionId + 1,
  };
}

export function ActionStateWithReducer() {
  const [state, formAction, isPending] = useActionState(profileReducer, initialState);
  const [dirtySubmissionId, setDirtySubmissionId] = useState<number | null>(null);
  const isDirty = dirtySubmissionId === state.submissionId;

  return (
    <article className={styles.card}>
      <div className={styles.heading}>
        <h2>Форма с reducer</h2>
        <p>Один action обрабатывает несколько полей и хранит результат отправки.</p>
      </div>

      <form
        className={styles.form}
        action={formAction}
        onChange={() => setDirtySubmissionId(state.submissionId)}
      >
        <label className={styles.field}>
          Имя
          <input name="name" autoComplete="name" required />
        </label>
        <label className={styles.field}>
          Email
          <input name="email" type="email" autoComplete="email" required />
        </label>
        <label className={styles.field}>
          Сообщение
          <textarea name="message" required />
        </label>
        <button className={styles.button} type="submit" disabled={isPending}>
          {isPending ? 'Отправляем...' : 'Отправить'}
        </button>
      </form>

      {isPending && (
        <p className={styles.status} aria-live="polite">
          Данные отправляются
        </p>
      )}
      {!isPending && isDirty && (
        <p className={styles.status} aria-live="polite">
          Есть несохраненные изменения
        </p>
      )}
      {!isPending && !isDirty && state.status === 'success' && (
        <div className={styles.successBox} role="status">
          {state.message}
        </div>
      )}
    </article>
  );
}
