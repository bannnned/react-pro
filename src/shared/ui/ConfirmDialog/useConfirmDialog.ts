import { useCallback, useRef, useState } from 'react';
import type { ConfirmDialogOptions } from './ConfirmDialog';

export function useConfirmDialog() {
  const [dialogOptions, setDialogOptions] = useState<ConfirmDialogOptions | null>(null);
  const resolverRef = useRef<((confirmed: boolean) => void) | null>(null);

  const showConfirmDialog = useCallback(
    (options: ConfirmDialogOptions) =>
      new Promise<boolean>((resolve) => {
        resolverRef.current = resolve;
        setDialogOptions(options);
      }),
    [],
  );

  const closeConfirmDialog = useCallback((confirmed: boolean) => {
    resolverRef.current?.(confirmed);
    resolverRef.current = null;
    setDialogOptions(null);
  }, []);

  return {
    dialogOptions,
    showConfirmDialog,
    closeConfirmDialog,
  };
}
