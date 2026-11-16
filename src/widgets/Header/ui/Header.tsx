import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { authApi } from '../../../features/auth/api/authApi';
import {
	clearSession,
	getAccessToken,
} from '../../../features/auth/model/session';
import { clearCart, getCartCount } from '../../../features/cart/model/cart';
import { useFavorites } from '../../../features/favorites/useFavorites';
import { productsApi } from '../../../features/products/api/productsApi';
import { Search } from '../../../features/search/Search';
import { useAppDispatch, useAppSelector } from '../../../shared/store/hooks';
import { Logo } from '../../../shared/ui/Logo';
import styles from './Header.module.css';

export const Header = () => {
	const token = useAppSelector(getAccessToken);
	const count = useAppSelector(getCartCount);
	const { favorites } = useFavorites();
	const { pathname } = useLocation();
	const navigate = useNavigate();
	const dispatch = useAppDispatch();

	function signOut() {
		dispatch(clearSession());
		dispatch(clearCart());
		dispatch(authApi.util.resetApiState());
		dispatch(productsApi.util.resetApiState());
		navigate('/signin', { replace: true });
	}

	return (
		<header className={styles.header}>
			<div className={'container ' + styles.bar}>
				<Logo />
				{token && pathname === '/' && <Search />}
				<nav aria-label='Основная навигация' className={styles.nav}>
					{token ? (
						<>
							<NavLink to='/' end>
								Каталог
							</NavLink>
							<NavLink to='/favorites'>
								Избранное <span>{favorites.length}</span>
							</NavLink>
							<NavLink to='/cart'>
								Корзина <span>{count}</span>
							</NavLink>
							<NavLink to='/profile'>Профиль</NavLink>
							<button type='button' onClick={signOut}>
								Выйти
							</button>
						</>
					) : (
						<Link to='/signin'>Войти</Link>
					)}
				</nav>
			</div>
		</header>
	);
};
