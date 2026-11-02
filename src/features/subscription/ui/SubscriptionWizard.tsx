import { useActionState } from 'react';
import { z } from 'zod';
import styles from './SubscriptionWizard.module.css';

interface SubscriptionState {
  step: 1 | 2 | 3;
  email: string;
  error: string | null;
}

const initialState: SubscriptionState = {
  step: 1,
  email: '',
  error: null,
};

const emailSchema = z.string().trim().email();

async function subscriptionAction(
  state: SubscriptionState,
  formData: FormData,
): Promise<SubscriptionState> {
  await new Promise((resolve) => setTimeout(resolve, 500));

  if (state.step === 1) {
    const email = String(formData.get('email') ?? '').trim();

    if (!emailSchema.safeParse(email).success) {
      return { ...state, error: 'Введите корректный email' };
    }

    return { step: 2, email, error: null };
  }

  return { step: 3, email: state.email, error: null };
}

export function SubscriptionWizard() {
  const [state, formAction, isPending] = useActionState(subscriptionAction, initialState);

  if (state.step === 3) {
    return (
      <div className={styles.success} role="status">
        <span>Готово</span>
        <strong>Подписка подтверждена</strong>
        <p>Письма будут приходить на {state.email}.</p>
      </div>
    );
  }

  return (
    <form className={styles.form} action={formAction}>
      <div className={styles.step}>Шаг {state.step} из 2</div>

      {state.step === 1 ? (
        <div className={styles.field}>
          <label htmlFor="subscription-email">Email для подписки</label>
          <input
            id="subscription-email"
            name="email"
            type="email"
            placeholder="mail@example.com"
            aria-invalid={Boolean(state.error)}
          />
        </div>
      ) : (
        <div className={styles.confirmation}>
          <span>Подтвердите адрес</span>
          <strong>{state.email}</strong>
        </div>
      )}

      {state.error && <p className={styles.error}>{state.error}</p>}
      {isPending && <p className={styles.pending}>Отправляем...</p>}

      <button type="submit" disabled={isPending}>
        {state.step === 1 ? 'Продолжить' : 'Подтвердить подписку'}
      </button>
    </form>
  );
}
