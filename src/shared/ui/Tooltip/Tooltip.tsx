import { useRef, useState } from 'react';
import type { CSSProperties, ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { useTheme } from 'shared/model/theme';
import { TooltipPosition } from './TooltipPosition';
import styles from './Tooltip.module.css';

interface TooltipProps {
  children: ReactNode;
  content: ReactNode;
  position?: TooltipPosition;
}

const gap = 10;

function getTooltipStyle(rect: DOMRect, position: TooltipPosition): CSSProperties {
  if (position === TooltipPosition.Right) {
    return {
      top: rect.top + rect.height / 2,
      left: rect.right + gap,
      transform: 'translateY(-50%)',
    };
  }

  if (position === TooltipPosition.Bottom) {
    return {
      top: rect.bottom + gap,
      left: rect.left + rect.width / 2,
      transform: 'translateX(-50%)',
    };
  }

  if (position === TooltipPosition.Left) {
    return {
      top: rect.top + rect.height / 2,
      left: rect.left - gap,
      transform: 'translate(-100%, -50%)',
    };
  }

  return {
    top: rect.top - gap,
    left: rect.left + rect.width / 2,
    transform: 'translate(-50%, -100%)',
  };
}

export function Tooltip({
  children,
  content,
  position = TooltipPosition.Top,
}: TooltipProps) {
  const { theme } = useTheme();
  const triggerRef = useRef<HTMLSpanElement>(null);
  const [tooltipStyle, setTooltipStyle] = useState<CSSProperties | null>(null);
  const tooltipRoot = document.getElementById('tooltip-root');

  const showTooltip = () => {
    if (triggerRef.current) {
      setTooltipStyle(
        getTooltipStyle(triggerRef.current.getBoundingClientRect(), position),
      );
    }
  };

  return (
    <span
      className={styles.trigger}
      ref={triggerRef}
      onMouseEnter={showTooltip}
      onMouseLeave={() => setTooltipStyle(null)}
    >
      {children}
      {tooltipRoot &&
        tooltipStyle &&
        createPortal(
          <span
            className={`${styles.tooltip} ${styles[theme]}`}
            style={tooltipStyle}
            role="tooltip"
          >
            {content}
          </span>,
          tooltipRoot,
        )}
    </span>
  );
}
