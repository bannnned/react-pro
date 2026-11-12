import { Link } from 'react-router-dom';
import logo from '../assets/logo.svg';

export function Logo() {
	return (
		<Link to='/' className='brand' aria-label='DogFood, главная'>
			<img src={logo} alt='DogFood' />
		</Link>
	);
}
