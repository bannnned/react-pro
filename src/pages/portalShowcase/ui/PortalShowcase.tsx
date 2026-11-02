import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ThemeProvider, useTheme } from 'shared/model/theme';
import { ConfirmDialog, Tooltip, TooltipPosition, useConfirmDialog } from 'shared/ui';
import styles from './PortalShowcase.module.css';

function ShowcaseContent() {
  const { theme, toggleTheme } = useTheme();
  const [parentClicks, setParentClicks] = useState(0);
  const [itemExists, setItemExists] = useState(true);
  const [message, setMessage] = useState('Элемент пока на месте');
  const { dialogOptions, showConfirmDialog, closeConfirmDialog } = useConfirmDialog();

  const handleDelete = async () => {
    const confirmed = await showConfirmDialog({
      title: 'Удалить элемент?',
      description: 'После подтверждения карточка исчезнет со страницы.',
    });

    if (confirmed) {
      setItemExists(false);
      setMessage('Элемент удален');
    } else {
      setMessage('Удаление отменено');
    }
  };

  return (
    <main className={`${styles.page} ${styles[theme]}`}>
      <header className={styles.header}>
        <div>
          <p className={styles.eyebrow}>Домашнее задание 8</p>
          <h1>React Portal</h1>
          <p className={styles.intro}>
            Tooltip и диалог находятся вне основного DOM-дерева, но сохраняют события и
            контекст темы.
          </p>
        </div>
        <nav className={styles.navigation} aria-label="Навигация">
          <Link to="/public">На главную</Link>
          <button type="button" onClick={toggleTheme}>
            {theme === 'light' ? 'Темная тема' : 'Светлая тема'}
          </button>
        </nav>
      </header>

      <section className={styles.grid}>
        <article
          className={styles.card}
          onClick={() => setParentClicks((clicks) => clicks + 1)}
        >
          <p className={styles.cardNumber}>01</p>
          <h2>Tooltip</h2>
          <p>
            Наведите курсор на кнопку. Клик по ней также дойдет до родительской карточки.
          </p>
          <Tooltip
            content={`Тема внутри портала: ${theme}`}
            position={TooltipPosition.Bottom}
          >
            <button className={styles.tooltipButton} type="button">
              Наведите сюда
            </button>
          </Tooltip>
          <p className={styles.counter}>Кликов по карточке: {parentClicks}</p>
        </article>

        <article className={styles.card}>
          <p className={styles.cardNumber}>02</p>
          <h2>ConfirmDialog</h2>
          <p>Диалог возвращает результат через Promise и не зависит от карточки.</p>
          {itemExists ? (
            <button className={styles.deleteButton} type="button" onClick={handleDelete}>
              Удалить
            </button>
          ) : (
            <button
              className={styles.restoreButton}
              type="button"
              onClick={() => {
                setItemExists(true);
                setMessage('Элемент восстановлен');
              }}
            >
              Восстановить
            </button>
          )}
          <p className={styles.status} aria-live="polite">
            {message}
          </p>
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
