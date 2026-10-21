import { useEffect, useRef, useState } from 'react';
import styles from './RefExamples.module.css';

export function PreviousInput() {
  const [value, setValue] = useState('');
  const previousValueRef = useRef('');
  const previousTextRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (previousTextRef.current !== null) {
      previousTextRef.current.textContent = previousValueRef.current || 'пока пусто';
    }

    previousValueRef.current = value;
  }, [value]);

  return (
    <article className={styles.card}>
      <p className={styles.number}>02</p>
      <h2>Предыдущее значение</h2>
      <p className={styles.description}>
        Введите текст. Под полем останется его значение до последнего изменения.
      </p>
      <label className={styles.field}>
        Текст
        <input
          value={value}
          onChange={(event) => setValue(event.target.value)}
          placeholder="Например, привет"
        />
      </label>
      <p className={styles.result}>
        Предыдущее значение: <span ref={previousTextRef}>пока пусто</span>
      </p>
    </article>
  );
}
