import { useRef } from 'react';
import styles from './RefExamples.module.css';

export function FocusTracker() {
  const firstInputRef = useRef<HTMLInputElement>(null);
  const secondInputRef = useRef<HTMLInputElement>(null);
  const transitionCountRef = useRef(0);

  const handleFocus = (event: React.FocusEvent<HTMLInputElement>) => {
    const previousElement = event.relatedTarget;
    const cameFromAnotherInput =
      previousElement === firstInputRef.current ||
      previousElement === secondInputRef.current;

    if (cameFromAnotherInput) {
      transitionCountRef.current += 1;
      console.log(`Переходов между полями: ${transitionCountRef.current}`);
    }
  };

  return (
    <article className={styles.card}>
      <p className={styles.number}>03</p>
      <h2>Управление фокусом</h2>
      <p className={styles.description}>
        Переключайтесь между полями. Число переходов появится в консоли.
      </p>
      <div className={styles.fields}>
        <label className={styles.field}>
          Первое поле
          <input ref={firstInputRef} onFocus={handleFocus} />
        </label>
        <label className={styles.field}>
          Второе поле
          <input ref={secondInputRef} onFocus={handleFocus} />
        </label>
      </div>
      <button
        className={styles.secondaryButton}
        type="button"
        onClick={() => firstInputRef.current?.focus()}
      >
        Сфокусировать на первом
      </button>
    </article>
  );
}
