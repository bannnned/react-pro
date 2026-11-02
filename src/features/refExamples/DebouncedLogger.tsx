import { useEffect, useRef } from 'react';
import styles from './RefExamples.module.css';

export function DebouncedLogger() {
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current !== null) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (timeoutRef.current !== null) {
      clearTimeout(timeoutRef.current);
    }

    const value = event.target.value;

    timeoutRef.current = setTimeout(() => {
      console.log(`Текст после паузы: ${value}`);
    }, 1000);
  };

  return (
    <article className={styles.card}>
      <p className={styles.number}>04</p>
      <h2>Отложенный вывод</h2>
      <p className={styles.description}>
        После остановки ввода текст попадет в консоль через одну секунду.
      </p>
      <label className={styles.field}>
        Сообщение
        <input onChange={handleChange} placeholder="Начните печатать" />
      </label>
    </article>
  );
}
