import { useActionState, useState } from 'react';
import styles from './React19Examples.module.css';

type ProfileState = {
  message: string;
};

const initialState: ProfileState = {
  message: '',
};

function wait(delay: number) {
  return new Promise((resolve) => setTimeout(resolve, delay));
}

export function ActionStateWithReducer() {
  const [isDirty, setIsDirty] = useState(false);

  async function profileReducer(_: ProfileState, formData: FormData) {
    const name = String(formData.get('name') ?? '').trim();
    const email = String(formData.get('email') ?? '').trim();
    const message = String(formData.get('message') ?? '').trim();

    await wait(1000);
    setIsDirty(false);

    return {
      message: `${name}, ${email}: ${message}`,
    };
  }

  const [state, formAction, isPending] = useActionState(profileReducer, initialState);

  return (
    <article className={styles.card}>
      <h2>Форма с reducer</h2>

      <form className={styles.form} action={formAction} onChange={() => setIsDirty(true)}>
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

      <p className={styles.status} aria-live="polite">
        {isPending
          ? 'Отправка...'
          : isDirty
            ? 'Есть изменения'
            : state.message || 'Ожидание'}
      </p>
    </article>
  );
}
