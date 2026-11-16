import { memo, useCallback, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../../shared/store/hooks';
import { Button } from '../../../shared/ui/controls';
import { RemoveCartItemDialog } from './RemoveCartItemDialog';
import { money } from '../../../shared/utils/money';
import {
	deleteCartProduct,
	getCartProducts,
	getCartSummary,
} from '../model/cart';
import { CartControls } from './CartControls';
import styles from './Cart.module.css';

const CartItem = memo(
	({
		product,
		onRemove,
	}: {
		product: CartProduct;
		onRemove: (product: CartProduct) => void;
	}) => {
		return (
			<li className={styles.item} data-product-id={product.id}>
				<img src={product.images} alt='' width='96' height='80' />
				<div className={styles.itemMain}>
					<Link to={'/products/' + product.id}>{product.name}</Link>
					<CartControls product={product} onRemove={onRemove} />
				</div>
				<strong>
					{money((product.price - product.discount) * product.count)}
				</strong>
				<Button
					variant='secondary'
					onClick={() => onRemove(product)}
					aria-label={'Удалить: ' + product.name}>
					Удалить
				</Button>
			</li>
		);
	}
);

CartItem.displayName = 'CartItem';

const CartSummary = () => {
	const { count, total, discount } = useAppSelector(getCartSummary);
	return (
		<aside className={styles.summary}>
			<h2>Сумма корзины</h2>
			<dl>
				<div>
					<dt>Количество товаров</dt>
					<dd>{count}</dd>
				</div>
				<div>
					<dt>Цена без скидки</dt>
					<dd>{money(total)}</dd>
				</div>
				<div>
					<dt>Скидка</dt>
					<dd>{money(discount)}</dd>
				</div>
				<div className={styles.total}>
					<dt>Итого</dt>
					<dd>{money(total - discount)}</dd>
				</div>
			</dl>
		</aside>
	);
};

export const Cart = () => {
	const products = useAppSelector(getCartProducts);
	const dispatch = useAppDispatch();
	const [removing, setRemoving] = useState<CartProduct | null>(null);
	const heading = useRef<HTMLHeadingElement>(null);
	const askRemove = useCallback(
		(product: CartProduct) => setRemoving(product),
		[]
	);

	function confirm() {
		if (!removing) return;
		dispatch(deleteCartProduct(removing.id));
		setRemoving(null);
		requestAnimationFrame(() => heading.current?.focus());
	}

	return (
		<section>
			<h1 ref={heading} tabIndex={-1}>
				Корзина
			</h1>
			{products.length ? (
				<div className={styles.layout}>
					<ul className={styles.items}>
						{products.map((product) => (
							<CartItem
								key={product.id}
								product={product}
								onRemove={askRemove}
							/>
						))}
					</ul>
					<CartSummary />
				</div>
			) : (
				<div className='empty-state'>
					<p>В корзине пока пусто.</p>
					<Link to='/'>Открыть каталог</Link>
				</div>
			)}
			{removing && (
				<RemoveCartItemDialog
					name={removing.name}
					onClose={() => setRemoving(null)}
					onConfirm={confirm}
				/>
			)}
		</section>
	);
};
