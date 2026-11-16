import { Modal } from '../../../shared/ui/Modal';

type RemoveCartItemDialogProps = {
	name: string;
	onClose: () => void;
	onConfirm: () => void;
};

export const RemoveCartItemDialog = ({
	name,
	onClose,
	onConfirm,
}: RemoveCartItemDialogProps) => {
	return (
		<Modal
			title='Удалить товар из корзины?'
			confirmLabel='Удалить'
			onClose={onClose}
			onConfirm={onConfirm}>
			<p>Товар «{name}» будет удалён из корзины.</p>
		</Modal>
	);
};
