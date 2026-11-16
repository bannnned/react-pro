import { useRef, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../shared/store/hooks';
import { Button } from '../../../shared/ui/controls';
import {
	addCartProduct,
	deleteCartProduct,
	getCartItem,
	setCartProductCount,
} from '../model/cart';
import { RemoveCartItemDialog } from './RemoveCartItemDialog';
import styles from './Quantity.module.css';

type CartControlsProps = {
	product: Product;
	onRemove?: (product: CartProduct) => void;
};

export const CartControls = ({ product, onRemove }: CartControlsProps) => {
	const cartItem = useAppSelector((state) => getCartItem(state, product.id));
	const dispatch = useAppDispatch();
	const [confirmingRemoval, setConfirmingRemoval] = useState(false);
	const addButton = useRef<HTMLButtonElement>(null);

	if (!cartItem) {
		return (
			<Button
				ref={addButton}
				disabled={product.stock < 1}
				onClick={() => dispatch(addCartProduct({ ...product, count: 1 }))}>
				{product.stock < 1 ? 'Нет в наличии' : 'В корзину'}
			</Button>
		);
	}

	const { id, name, count, stock } = cartItem;
	const max = Math.min(99, stock);
	const setCount = (next: number) =>
		dispatch(setCartProductCount({ id, count: next }));

	const decrement = () => {
		if (count > 1) {
			setCount(count - 1);
		} else if (onRemove) {
			onRemove(cartItem);
		} else {
			setConfirmingRemoval(true);
		}
	};

	function confirmRemoval() {
		setConfirmingRemoval(false);
		dispatch(deleteCartProduct(id));
		requestAnimationFrame(() => addButton.current?.focus());
	}

	return (
		<>
			<div
				className={styles.quantity}
				role='group'
				aria-label={'Количество: ' + name}>
				<button
					type='button'
					aria-label={
						(count === 1 ? 'Удалить из корзины: ' : 'Уменьшить количество: ') +
						name
					}
					onClick={decrement}>
					−
				</button>
				<input
					type='number'
					aria-label={'Количество: ' + name}
					min={1}
					max={max}
					value={count}
					onChange={(event) => setCount(event.currentTarget.valueAsNumber)}
				/>
				<button
					type='button'
					aria-label={'Увеличить количество: ' + name}
					disabled={count >= max}
					onClick={() => setCount(count + 1)}>
					+
				</button>
			</div>
			{confirmingRemoval && (
				<RemoveCartItemDialog
					name={name}
					onClose={() => setConfirmingRemoval(false)}
					onConfirm={confirmRemoval}
				/>
			)}
		</>
	);
};
