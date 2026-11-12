import {
	createSelector,
	createSlice,
	type PayloadAction,
} from '@reduxjs/toolkit';

const initialState: { products: CartProduct[] } = { products: [] };

function boundedCount(count: number, stock: number) {
	return Math.max(1, Math.min(stock, 99, Math.trunc(count)));
}

export const cartSlice = createSlice({
	name: 'cart',
	initialState,
	reducers: {
		addCartProduct(state, { payload }: PayloadAction<CartProduct>) {
			if (payload.stock < 1 || !Number.isFinite(payload.count)) return;
			const existing = state.products.find(({ id }) => id === payload.id);
			if (existing) {
				existing.count = boundedCount(
					existing.count + payload.count,
					existing.stock
				);
			} else {
				state.products.push({
					...payload,
					count: boundedCount(payload.count, payload.stock),
				});
			}
		},
		deleteCartProduct(state, { payload }: PayloadAction<string>) {
			state.products = state.products.filter(({ id }) => id !== payload);
		},
		setCartProductCount(
			state,
			{ payload }: PayloadAction<{ id: string; count: number }>
		) {
			const product = state.products.find(({ id }) => id === payload.id);
			if (product && Number.isFinite(payload.count)) {
				product.count = boundedCount(payload.count, product.stock);
			}
		},
		clearCart: () => initialState,
	},
	selectors: {
		getCartProducts: (state) => state.products,
		getCartCount: (state) => state.products.length,
		getCartItem: (state, productId: string) =>
			state.products.find(({ id }) => id === productId),
	},
});

export const {
	addCartProduct,
	deleteCartProduct,
	setCartProductCount,
	clearCart,
} = cartSlice.actions;
export const { getCartProducts, getCartCount, getCartItem } =
	cartSlice.selectors;

export const getCartSummary = createSelector(getCartProducts, (products) =>
	products.reduce(
		(summary, product) => ({
			count: summary.count + product.count,
			total: summary.total + product.price * product.count,
			discount: summary.discount + product.discount * product.count,
		}),
		{ count: 0, total: 0, discount: 0 }
	)
);
