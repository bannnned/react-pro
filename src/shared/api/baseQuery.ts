import { fetchBaseQuery } from '@reduxjs/toolkit/query';

export const baseQuery = fetchBaseQuery({
	baseUrl: process.env.API_URL || '/api',
	timeout: 8000,
	prepareHeaders(headers, { getState }) {
		const { user } = getState() as { user: { accessToken: string } };
		if (user.accessToken) headers.set('authorization', user.accessToken);
		return headers;
	},
});
