import { useFavorites } from '../../../features/favorites/useFavorites';
import { ProductGrid } from '../../../features/products/ui/ProductGrid';
import { QueryState } from '../../../shared/ui/QueryState';
import { getMessageFromError } from '../../../shared/utils/getMessageFromError';

export const FavoritesPage = () => {
	const { favorites, isLoading, error, refetch } = useFavorites();

	return (
		<section>
			<h1>Избранное</h1>
			<QueryState
				loading={isLoading}
				error={
					error
						? getMessageFromError(error, 'Не удалось загрузить избранное')
						: undefined
				}
				retry={refetch}>
				<ProductGrid
					products={favorites}
					empty='Нажмите на сердечко в каталоге, чтобы сохранить товар.'
				/>
			</QueryState>
		</section>
	);
};
