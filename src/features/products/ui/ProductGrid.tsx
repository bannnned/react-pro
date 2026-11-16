import { memo } from 'react';
import { ProductCard } from './ProductCard';
import styles from './Products.module.css';

export const ProductGrid = memo(
	({ products, empty }: { products: Product[]; empty: string }) => {
		if (!products.length) return <div className='empty-state'>{empty}</div>;
		return (
			<div className={styles.grid}>
				{products.map((product) => (
					<ProductCard key={product.id} product={product} />
				))}
			</div>
		);
	}
);

ProductGrid.displayName = 'ProductGrid';
