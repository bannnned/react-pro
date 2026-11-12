import { useCallback, useEffect, useRef, useState } from 'react';
import { Button } from '../../../shared/ui/controls';
import { QueryState } from '../../../shared/ui/QueryState';
import { getMessageFromError } from '../../../shared/utils/getMessageFromError';
import { useGetProductsQuery } from '../api/productsApi';
import { ProductGrid } from './ProductGrid';

const PAGE_SIZE = 6;
const empty: Product[] = [];

export function CatalogResults({
	searchText,
	sort,
}: {
	searchText: string;
	sort: Sort;
}) {
	const [limit, setLimit] = useState(PAGE_SIZE);
	const { data, isFetching, error, refetch } = useGetProductsQuery({
		searchText,
		sort,
		limit,
	});
	const products = data?.products ?? empty;
	const hasMore = !!data && products.length < data.length;
	const sentinel = useRef<HTMLDivElement>(null);
	const loadMore = useCallback(() => setLimit((size) => size + PAGE_SIZE), []);

	useEffect(() => {
		const node = sentinel.current;
		if (!node || !hasMore || isFetching || error) return;
		const observer = new IntersectionObserver(
			([entry]) => {
				if (!entry.isIntersecting) return;
				observer.disconnect();
				loadMore();
			},
			{ rootMargin: '80px' }
		);
		observer.observe(node);
		return () => observer.disconnect();
	}, [hasMore, isFetching, error, loadMore]);

	return (
		<QueryState
			loading={isFetching && !data}
			error={
				error
					? getMessageFromError(error, 'Не удалось загрузить каталог')
					: undefined
			}
			retry={refetch}>
			<ProductGrid
				products={products}
				empty='По этому запросу ничего не найдено.'
			/>
			{hasMore && (
				<div className='load-more' ref={sentinel}>
					<Button variant='secondary' onClick={loadMore} disabled={isFetching}>
						{isFetching ? 'Загрузка…' : 'Показать ещё'}
					</Button>
				</div>
			)}
		</QueryState>
	);
}
