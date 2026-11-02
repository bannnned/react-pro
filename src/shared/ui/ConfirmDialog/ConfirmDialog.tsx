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
  const dialogRoot = document.getElementById('dialog-root');

  if (!dialogRoot) {
    return null;
  }

  return createPortal(
    <div className={styles.overlay}>
      <div
        className={`${styles.dialog} ${theme === 'dark' ? styles.dark : ''}`}
        role="dialog"
        aria-modal="true"
      >
        <h2>{title}</h2>
        <p>{description}</p>
        <div className={styles.actions}>
          <button type="button" onClick={() => onClose(false)}>
            Отмена
          </button>
          <button
            className={styles.confirmButton}
            type="button"
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
