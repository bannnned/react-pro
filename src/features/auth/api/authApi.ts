import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQuery } from '../../../shared/api/baseQuery';
import type { Session } from '../model/session';

export type Credentials = { email: string; password: string };
type ProfileUpdate = Pick<User, 'name' | 'about' | 'avatarPath'>;

export const authApi = createApi({
	reducerPath: 'authApi',
	baseQuery,
	tagTypes: ['Profile'],
	endpoints: (builder) => ({
		signUp: builder.mutation<Session, Credentials>({
			query: (body) => ({ url: '/auth/register', method: 'POST', body }),
		}),
		signIn: builder.mutation<Session, Credentials>({
			query: (body) => ({ url: '/auth/login', method: 'POST', body }),
		}),
		getProfile: builder.query<User, void>({
			query: () => '/users/me',
			providesTags: ['Profile'],
		}),
		updateProfile: builder.mutation<User, ProfileUpdate>({
			query: (body) => ({ url: '/users/me', method: 'PATCH', body }),
			invalidatesTags: (_data, error) => (error ? [] : ['Profile']),
		}),
	}),
});

export const {
	useSignInMutation,
	useSignUpMutation,
	useGetProfileQuery,
	useUpdateProfileMutation,
} = authApi;
