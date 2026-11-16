import { startTransition, useOptimistic, useRef, useTransition } from 'react';
import { toast } from 'react-toastify';
import { useAppDispatch, useAppSelector } from '../../shared/store/hooks';
import { getMessageFromError } from '../../shared/utils/getMessageFromError';
import { getUser } from '../auth/model/session';
import {
	productsApi,
	useDeleteLikeMutation,
	useSetLikeMutation,
} from '../products/api/productsApi';
import type { AppDispatch, RootState } from '../../app/store';
import styles from './LikeButton.module.css';

function confirmLike(
	dispatch: AppDispatch,
	productId: string,
	userId: string,
	like?: Like
) {
	function update(product: Product) {
		const otherLikes = (product.likes || []).filter(
			(entry) => entry.userId !== userId
		);
		product.likes = like ? [...otherLikes, like] : otherLikes;
	}

	dispatch((send, getState: () => RootState) => {
		for (const args of productsApi.util.selectCachedArgsForQuery(
			getState(),
			'getProducts'
		)) {
			send(
				productsApi.util.updateQueryData(
					'getProducts',
					args,
					({ products }) => {
						const product = products.find(({ id }) => id === productId);
						if (product) update(product);
					}
				)
			);
		}
		send(productsApi.util.updateQueryData('getProduct', productId, update));
		send(
			productsApi.util.invalidateTags([
				{ type: 'Products', id: 'list' },
				{ type: 'Products', id: productId },
			])
		);
	});
}

export const LikeButton = ({ product }: { product: Product }) => {
	const userId = useAppSelector(getUser)?.id;
	const confirmed =
		product.likes?.some((like) => like.userId === userId) ?? false;
	const [liked, setOptimistic] = useOptimistic(confirmed);
	const [pending, startAction] = useTransition();
	const inFlight = useRef(false);
	const [addLike] = useSetLikeMutation();
	const [removeLike] = useDeleteLikeMutation();
	const dispatch = useAppDispatch();

	function toggle() {
		if (!userId || inFlight.current) return;
		const next = !confirmed;
		inFlight.current = true;

		startAction(async () => {
			setOptimistic(next);
			try {
				let like: Like | undefined;
				if (next) {
					const result = await addLike(product.id).unwrap();
					like = result.like;
				} else {
					await removeLike(product.id).unwrap();
				}
				startTransition(() => confirmLike(dispatch, product.id, userId, like));
			} catch (error) {
				toast.error(
					getMessageFromError(error, 'Не удалось изменить избранное')
				);
			} finally {
				inFlight.current = false;
			}
		});
	}

	return (
		<button
			type='button'
			className={styles.heart}
			aria-pressed={liked}
			aria-busy={pending}
			aria-label={
				(liked ? 'Убрать из избранного: ' : 'В избранное: ') + product.name
			}
			title={
				pending ? 'Сохраняем…' : liked ? 'Убрать из избранного' : 'В избранное'
			}
			onClick={toggle}
			disabled={pending}>
			<span aria-hidden='true'>{liked ? '♥' : '♡'}</span>
		</button>
	);
};
