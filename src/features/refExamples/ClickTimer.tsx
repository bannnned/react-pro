import { useRef } from 'react';
import styles from './RefExamples.module.css';

interface ClickData {
  startTime: number | null;
  clickCount: number;
}

export function ClickTimer() {
  const clickDataRef = useRef<ClickData>({
    startTime: null,
    clickCount: 0,
  });

  const handleClick = () => {
    const now = Date.now();

    if (clickDataRef.current.startTime === null) {
      clickDataRef.current.startTime = now;
    }

    clickDataRef.current.clickCount += 1;

    const elapsedTime = now - clickDataRef.current.startTime;

    console.log(`Клик ${clickDataRef.current.clickCount}. Прошло ${elapsedTime} мс`);
  };

  return (
    <article className={styles.card}>
      <p className={styles.number}>01</p>
      <h2>Таймер кликов</h2>
      <p className={styles.description}>
        Нажмите несколько раз и посмотрите время и количество кликов в консоли.
      </p>
      <button className={styles.button} type="button" onClick={handleClick}>
        Засечь клик
      </button>
    </article>
  );
}
