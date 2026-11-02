import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useTheme } from 'shared/model/theme';
import styles from './ConfirmDialog.module.css';

export interface ConfirmDialogOptions {
  title: string;
  description: string;
}

interface ConfirmDialogProps extends ConfirmDialogOptions {
  onClose: (confirmed: boolean) => void;
}

export function ConfirmDialog({ title, description, onClose }: ConfirmDialogProps) {
  const { theme } = useTheme();
  const confirmButtonRef = useRef<HTMLButtonElement>(null);
  const dialogRoot = document.getElementById('dialog-root');

  useEffect(() => {
    confirmButtonRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!dialogRoot) {
    return null;
  }

  return createPortal(
    <div className={styles.overlay} onMouseDown={() => onClose(false)}>
      <div
        className={`${styles.dialog} ${styles[theme]}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-title"
        aria-describedby="confirm-description"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <p className={styles.label}>Подтверждение</p>
        <h2 id="confirm-title">{title}</h2>
        <p className={styles.description} id="confirm-description">
          {description}
        </p>
        <div className={styles.actions}>
          <button
            className={styles.cancelButton}
            type="button"
            onClick={() => onClose(false)}
          >
            Отмена
          </button>
          <button
            className={styles.confirmButton}
            type="button"
            ref={confirmButtonRef}
            onClick={() => onClose(true)}
          >
            Подтвердить
          </button>
        </div>
      </div>
    </div>,
    dialogRoot,
  );
}
