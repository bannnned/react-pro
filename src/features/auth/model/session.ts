import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export type Session = {
	user: User | null;
	accessToken: string;
};

const initialState: Session = { user: null, accessToken: '' };

export const userSlice = createSlice({
	name: 'user',
	initialState,
	reducers: {
		setSession: (_, action: PayloadAction<Session>) => action.payload,
		clearSession: () => initialState,
	},
	selectors: {
		getUser: (state) => state.user,
		getAccessToken: (state) => state.accessToken,
	},
});

export const { setSession, clearSession } = userSlice.actions;
export const { getUser, getAccessToken } = userSlice.selectors;
