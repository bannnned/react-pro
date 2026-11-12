import { createBrowserRouter } from 'react-router-dom';
import { ProtectedRoute } from '../features/auth/ui/ProtectedRoute';
import { CartPage } from '../pages/CartPage';
import { FavoritesPage } from '../pages/FavoritesPage';
import { HomePage } from '../pages/HomePage';
import { NotFoundPage } from '../pages/NotFoundPage';
import { ProductPage } from '../pages/ProductPage';
import { ProfilePage } from '../pages/ProfilePage';
import { SignInPage } from '../pages/SignInPage';
import { SignUpPage } from '../pages/SignUpPage';
import { CreateProductPage } from '../pages/CreateProductPage';
import { App } from './App';

export const router = createBrowserRouter([
	{
		element: <App />,
		children: [
			{ path: '/signin', element: <SignInPage /> },
			{ path: '/signup', element: <SignUpPage /> },
			{
				element: <ProtectedRoute />,
				children: [
					{ index: true, element: <HomePage /> },
					{ path: '/favorites', element: <FavoritesPage /> },
					{ path: '/products/new', element: <CreateProductPage /> },
					{ path: '/products/:productId', element: <ProductPage /> },
					{ path: '/profile', element: <ProfilePage /> },
					{ path: '/cart', element: <CartPage /> },
				],
			},
			{ path: '*', element: <NotFoundPage /> },
		],
	},
]);
