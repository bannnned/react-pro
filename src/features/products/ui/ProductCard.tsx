import { memo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { CartControls } from '../../cart/ui/CartControls';
import { LikeButton } from '../../favorites/LikeButton';
import { money } from '../../../shared/utils/money';
import styles from './Products.module.css';

export const ProductCard = memo(({ product }: { product: Product }) => {
	const { pathname, search } = useLocation();
	return (
		<article className={styles.card}>
			<Link
				to={'/products/' + product.id}
				state={{ from: pathname + search }}
				className={styles.cardLink}>
				<img src={product.images} alt='' loading='lazy' />
				<h3>{product.name}</h3>
			</Link>
			<div className={styles.cardPrice}>
				<strong>{money(product.price - product.discount)}</strong>
				{product.discount > 0 && <s>{money(product.price)}</s>}
			</div>
			<div className={styles.cardActions}>
				<CartControls product={product} />
				<LikeButton product={product} />
			</div>
		</article>
	);
});

ProductCard.displayName = 'ProductCard';
