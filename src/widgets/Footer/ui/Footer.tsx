import { Link } from 'react-router-dom';
import { Logo } from '../../../shared/ui/Logo';

export function Footer() {
	return (
		<footer className='site-footer'>
			<div className='container footer-inner'>
				<Logo />
				<span>DogFood · учебный интернет-магазин</span>
				<Link to='/'>Каталог</Link>
			</div>
		</footer>
	);
}
