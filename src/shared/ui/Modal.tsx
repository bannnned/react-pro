import { useEffect, useId, useRef, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { Button } from './controls';
import styles from './Modal.module.css';

type ModalProps = {
	title: string;
	children: ReactNode;
	confirmLabel: string;
	busy?: boolean;
	onClose: () => void;
	onConfirm: () => void;
};

export function Modal({
	title,
	children,
	confirmLabel,
	busy,
	onClose,
	onConfirm,
}: ModalProps) {
	const dialog = useRef<HTMLDialogElement>(null);
	const cancel = useRef<HTMLButtonElement>(null);
	const opener = useRef<HTMLElement | null>(null);
	const label = useId();
	const description = useId();

	useEffect(() => {
		const element = dialog.current;
		if (!element) return;
		opener.current =
			document.activeElement instanceof HTMLElement
				? document.activeElement
				: null;
		element.showModal();
		cancel.current?.focus();
		return () => {
			element.close();
			if (opener.current?.isConnected) opener.current.focus();
		};
	}, []);

	const portalRoot = document.getElementById('modal-root');
	if (!portalRoot) return null;

	return createPortal(
		<dialog
			ref={dialog}
			className={styles.modal}
			aria-labelledby={label}
			aria-describedby={description}
			onCancel={(event) => {
				event.preventDefault();
				if (!busy) onClose();
			}}
			onPointerDown={(event) => {
				if (event.target === event.currentTarget && !busy) onClose();
			}}>
			<section className={styles.panel}>
				<h2 id={label}>{title}</h2>
				<div id={description}>{children}</div>
				<div className={styles.actions}>
					<button
						type='button'
						className='button button--secondary'
						ref={cancel}
						disabled={busy}
						onClick={onClose}>
						Отмена
					</button>
					<Button variant='danger' disabled={busy} onClick={onConfirm}>
						{busy ? 'Удаляем…' : confirmLabel}
					</Button>
				</div>
			</section>
		</dialog>,
		portalRoot
	);
}
