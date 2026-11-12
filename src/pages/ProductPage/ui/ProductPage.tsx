import { useState } from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { skipToken } from '@reduxjs/toolkit/query';
import { toast } from 'react-toastify';
import { getUser } from '../../../features/auth/model/session';
import { CartControls } from '../../../features/cart/ui/CartControls';
import { deleteCartProduct } from '../../../features/cart/model/cart';
import { LikeButton } from '../../../features/favorites/LikeButton';
import {
	useDeleteProductMutation,
	useGetProductQuery,
} from '../../../features/products/api/productsApi';
import { Reviews, Stars } from '../../../features/reviews/Reviews';
import { useAppDispatch, useAppSelector } from '../../../shared/store/hooks';
import { Button } from '../../../shared/ui/controls';
import { Modal } from '../../../shared/ui/Modal';
import { QueryState } from '../../../shared/ui/QueryState';
import { getMessageFromError } from '../../../shared/utils/getMessageFromError';
import { money } from '../../../shared/utils/money';
import styles from '../../../features/products/ui/Products.module.css';

function ProductDetail({ product }: { product: Product }) {
	const userId = useAppSelector(getUser)?.id;
	const dispatch = useAppDispatch();
	const navigate = useNavigate();
	const [deleting, setDeleting] = useState(false);
	const [deleteProduct, { isLoading }] = useDeleteProductMutation();
	const ownProduct = !!userId && product.user?.id === userId;
	const rating = product.reviews.length
		? Math.round(
				(product.reviews.reduce((total, review) => total + review.rating, 0) /
					product.reviews.length) *
					10
		  ) / 10
		: 0;

	async function confirmDelete() {
		try {
			await deleteProduct(product.id).unwrap();
			dispatch(deleteCartProduct(product.id));
			toast.success('Товар удалён из каталога');
			navigate('/', { replace: true });
		} catch (error) {
			setDeleting(false);
			toast.error(getMessageFromError(error, 'Не удалось удалить товар'));
		}
	}

	return (
		<>
			<article className={styles.detail}>
				<img src={product.images} alt={product.name} />
				<div>
					{ownProduct && <span className='owner-badge'>Ваш товар</span>}
					<h1>{product.name}</h1>
					{rating > 0 && <Stars rating={rating} />}
					<p className={styles.description}>{product.description}</p>
					<div className={styles.cardPrice}>
						<strong>{money(product.price - product.discount)}</strong>
						{product.discount > 0 && <s>{money(product.price)}</s>}
					</div>
					<p>
						{product.stock ? `В наличии ${product.stock} шт.` : 'Нет в наличии'}
					</p>
					<div className={styles.actions}>
						<CartControls product={product} />
						<LikeButton product={product} />
						{ownProduct && (
							<Button variant='secondary' onClick={() => setDeleting(true)}>
								Удалить товар
							</Button>
						)}
					</div>
				</div>
			</article>
			<Reviews product={product} />
			{deleting && (
				<Modal
					title='Удалить свой товар?'
					confirmLabel='Удалить'
					busy={isLoading}
					onClose={() => setDeleting(false)}
					onConfirm={confirmDelete}>
					<p>«{product.name}» исчезнет из каталога.</p>
				</Modal>
			)}
		</>
	);
}

export function ProductPage() {
	const { productId } = useParams();
	const { state } = useLocation();
	const {
		currentData: product,
		isFetching,
		error,
		refetch,
	} = useGetProductQuery(productId || skipToken);

	return (
		<section>
			<Link className='back-link' to={state?.from || '/'}>
				← К товарам
			</Link>
			<QueryState
				loading={isFetching && !product}
				error={
					error
						? getMessageFromError(error, 'Не удалось загрузить товар')
						: undefined
				}
				retry={refetch}>
				{product && <ProductDetail key={product.id} product={product} />}
			</QueryState>
		</section>
	);
}
