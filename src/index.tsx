import { createRoot } from 'react-dom/client';
import { StrictMode } from 'react';
import { RouterProvider } from 'react-router-dom';
import { Provider } from 'react-redux';
import { router } from './app/router';
import { store } from './app/store';

const root = document.getElementById('root');
if (!root) throw new Error('Missing #root');
createRoot(root).render(
	<StrictMode>
		<Provider store={store}>
			<RouterProvider router={router} />
		</Provider>
	</StrictMode>
);
