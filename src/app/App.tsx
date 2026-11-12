import './styles/normalize.css';
import './styles/styles.css';
import 'react-toastify/dist/ReactToastify.css';
import { Outlet } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { Header } from '../widgets/Header';
import { Footer } from '../widgets/Footer';

export function App() {
	return (
		<>
			<Header />
			<main className='container page'>
				<Outlet />
			</main>
			<ToastContainer position='top-right' autoClose={4000} />
			<Footer />
		</>
	);
}
