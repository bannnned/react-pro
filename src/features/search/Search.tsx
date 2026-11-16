import { useSearchParams } from 'react-router-dom';

export const Search = () => {
	const [params, setParams] = useSearchParams();
	const value = params.get('q') || '';

	function update(query: string) {
		const next = new URLSearchParams(params);
		if (query) next.set('q', query);
		else next.delete('q');
		setParams(next, { replace: true });
	}

	return (
		<form
			role='search'
			className='catalog-search'
			onSubmit={(event) => event.preventDefault()}>
			<svg
				aria-hidden='true'
				width='17'
				height='17'
				viewBox='0 0 24 24'
				fill='none'
				stroke='currentColor'
				strokeWidth='1.7'>
				<circle cx='10.5' cy='10.5' r='5.75' />
				<path d='m15 15 4.25 4.25' />
			</svg>
			<input
				type='search'
				aria-label='Поиск товаров'
				placeholder='Поиск по каталогу'
				value={value}
				onChange={(event) => update(event.currentTarget.value)}
			/>
			{value && (
				<button
					type='button'
					aria-label='Очистить поиск'
					onClick={() => update('')}>
					×
				</button>
			)}
		</form>
	);
};
