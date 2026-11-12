import { Link, useSearchParams } from 'react-router-dom';
import { CatalogResults } from '../../../features/products/ui/CatalogResults';
import { useDebounce } from '../../../shared/hooks/useDebounce';

const SORTS: ReadonlyArray<{ value: Sort; label: string }> = [
	{ value: 'newest', label: 'Сначала новые' },
	{ value: 'oldest', label: 'Сначала старые' },
	{ value: 'low-price', label: 'Сначала дешевле' },
	{ value: 'high-price', label: 'Сначала дороже' },
];

export function HomePage() {
	const [params, setParams] = useSearchParams();
	const sort =
		SORTS.find((option) => option.value === params.get('sort'))?.value ??
		'newest';
	const query = useDebounce((params.get('q') || '').trim(), 500);

	return (
		<section>
			<h1>{query ? 'Результаты поиска' : 'Лакомства для собак'}</h1>
			{query && <p className='search-caption'>По запросу «{query}»</p>}
			<div className='catalog-toolbar'>
				<label>
					<span>Сортировка</span>
					<select
						value={sort}
						onChange={(event) => {
							const next = new URLSearchParams(params);
							next.set('sort', event.currentTarget.value);
							setParams(next, { replace: true });
						}}>
						{SORTS.map(({ value, label }) => (
							<option key={value} value={value}>
								{label}
							</option>
						))}
					</select>
				</label>
				<Link className='catalog-add' to='/products/new'>
					<span aria-hidden='true'>+</span> Добавить товар
				</Link>
			</div>
			<CatalogResults
				key={JSON.stringify([query, sort])}
				searchText={query}
				sort={sort}
			/>
		</section>
	);
}
