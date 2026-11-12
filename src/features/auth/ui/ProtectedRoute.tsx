import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAppSelector } from '../../../shared/store/hooks';
import { getAccessToken } from '../model/session';

export function ProtectedRoute() {
	const accessToken = useAppSelector(getAccessToken);
	const { pathname, search, hash } = useLocation();

	return accessToken ? (
		<Outlet />
	) : (
		<Navigate replace to='/signin' state={{ from: pathname + search + hash }} />
	);
}
