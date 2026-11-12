import { useMemo } from 'react';
import { useAppSelector } from '../../shared/store/hooks';
import { getAccessToken, getUser } from '../auth/model/session';
import { useGetProductsQuery } from '../products/api/productsApi';

const args = { searchText: '', sort: 'newest' } as const;
const empty: Product[] = [];

export function useFavorites() {
	const userId = useAppSelector(getUser)?.id;
	const accessToken = useAppSelector(getAccessToken);
	const query = useGetProductsQuery(args, { skip: !accessToken });
	const products = query.data?.products ?? empty;
	const favorites = useMemo(
		() =>
			products.filter((product) =>
				product.likes?.some((like) => like.userId === userId)
			),
		[products, userId]
	);
	return { ...query, favorites };
}
