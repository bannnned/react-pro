import { Link } from 'react-router-dom';

export function NotFoundPage() {
	return (
		<div className='empty-state'>
			<h1>Страница не найдена</h1>
			<Link to='/'>Перейти в каталог</Link>
		</div>
	);
}
