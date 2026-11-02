import type { ButtonHTMLAttributes } from 'react';
import styles from './FilterButton.module.css';

interface FilterButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  active?: boolean;
}

export function FilterButton({
  active = false,
  className = '',
  ...props
}: FilterButtonProps) {
  const classes = [styles.button, active ? styles.active : '', className]
    .filter(Boolean)
    .join(' ');

  return <button type="button" className={classes} aria-pressed={active} {...props} />;
}
