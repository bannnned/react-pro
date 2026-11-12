import { configureStore } from '@reduxjs/toolkit';
import { authApi } from '../features/auth/api/authApi';
import { userSlice } from '../features/auth/model/session';
import { cartSlice } from '../features/cart/model/cart';
import { productsApi } from '../features/products/api/productsApi';

export const store = configureStore({
	reducer: {
		user: userSlice.reducer,
		cart: cartSlice.reducer,
		[authApi.reducerPath]: authApi.reducer,
		[productsApi.reducerPath]: productsApi.reducer,
	},
	devTools: process.env.NODE_ENV !== 'production',
	middleware: (defaults) =>
		defaults().concat(authApi.middleware, productsApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
