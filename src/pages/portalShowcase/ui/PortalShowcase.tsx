import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ThemeProvider, useTheme } from 'shared/model/theme';
import { ConfirmDialog, Tooltip, TooltipPosition, useConfirmDialog } from 'shared/ui';
import styles from './PortalShowcase.module.css';

function ShowcaseContent() {
  const { theme, toggleTheme } = useTheme();
  const [parentClicks, setParentClicks] = useState(0);
  const [result, setResult] = useState('');
  const { dialogOptions, showConfirmDialog, closeConfirmDialog } = useConfirmDialog();

  const openDialog = async () => {
    const confirmed = await showConfirmDialog({
      title: 'Удалить элемент?',
      description: 'Это действие нельзя отменить.',
    });

    setResult(confirmed ? 'Подтверждено' : 'Отменено');
  };

  return (
    <main className={`${styles.page} ${theme === 'dark' ? styles.dark : ''}`}>
      <header className={styles.header}>
        <h1>React Portal</h1>
        <div className={styles.actions}>
          <Link to="/public">Назад</Link>
          <button type="button" onClick={toggleTheme}>
            Сменить тему
          </button>
        </div>
      </header>

      <section className={styles.content}>
        <article
          className={styles.card}
          onClick={() => setParentClicks((clicks) => clicks + 1)}
        >
          <h2>Tooltip</h2>
          <Tooltip content={`Текущая тема: ${theme}`} position={TooltipPosition.Bottom}>
            <button type="button">Наведи на меня</button>
          </Tooltip>
          <p>Кликов по карточке: {parentClicks}</p>
        </article>

        <article className={styles.card}>
          <h2>ConfirmDialog</h2>
          <button type="button" onClick={openDialog}>
            Открыть диалог
          </button>
          {result && <p>{result}</p>}
        </article>
      </section>

      {dialogOptions && <ConfirmDialog {...dialogOptions} onClose={closeConfirmDialog} />}
    </main>
  );
}

export function PortalShowcase() {
  return (
    <ThemeProvider>
      <ShowcaseContent />
    </ThemeProvider>
  );
}
