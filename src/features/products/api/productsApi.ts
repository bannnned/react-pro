import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQuery } from '../../../shared/api/baseQuery';

type ProductsResponse = { products: Product[]; length: number };
type ProductRequest = { sort: Sort; searchText: string; limit?: number };

export type NewProduct = Pick<
	Product,
	'name' | 'description' | 'price' | 'stock' | 'discount' | 'images' | 'tags'
> & {
	slug: string;
	categoryId: number;
	isPublished: boolean;
};

export const productsApi = createApi({
	reducerPath: 'productsApi',
	baseQuery,
	tagTypes: ['Products'],
	endpoints: (builder) => ({
		getProducts: builder.query<ProductsResponse, ProductRequest>({
			query: ({ searchText, sort, limit }) => ({
				url: '/products',
				params: { sort, searchTerm: searchText || undefined, perPage: limit },
			}),
			providesTags: [{ type: 'Products', id: 'list' }],
		}),
		getProduct: builder.query<Product, string>({
			query: (id) => '/products/' + encodeURIComponent(id),
			providesTags: (_data, _error, id) => [{ type: 'Products', id }],
		}),
		createProduct: builder.mutation<Product, NewProduct>({
			query: (body) => ({ url: '/products', method: 'POST', body }),
			invalidatesTags: (_data, error) =>
				error ? [] : [{ type: 'Products', id: 'list' }],
		}),
		deleteProduct: builder.mutation<unknown, string>({
			query: (id) => ({
				url: '/products/' + encodeURIComponent(id),
				method: 'DELETE',
			}),
			invalidatesTags: (_data, error, id) =>
				error
					? []
					: [
							{ type: 'Products', id: 'list' },
							{ type: 'Products', id },
					  ],
		}),
		setLike: builder.mutation<{ like: Like }, string>({
			query: (id) => ({
				url: '/products/' + encodeURIComponent(id) + '/likes',
				method: 'PUT',
			}),
		}),
		deleteLike: builder.mutation<unknown, string>({
			query: (id) => ({
				url: '/products/' + encodeURIComponent(id) + '/likes',
				method: 'DELETE',
			}),
		}),
		addReview: builder.mutation<
			Review,
			{ id: string; text: string; rating: number }
		>({
			query: ({ id, ...body }) => ({
				url: '/reviews/leave/' + encodeURIComponent(id),
				method: 'POST',
				body,
			}),
			invalidatesTags: (_data, error, { id }) =>
				error
					? []
					: [
							{ type: 'Products', id },
							{ type: 'Products', id: 'list' },
					  ],
		}),
	}),
});

export const {
	useGetProductsQuery,
	useGetProductQuery,
	useCreateProductMutation,
	useDeleteProductMutation,
	useSetLikeMutation,
	useDeleteLikeMutation,
	useAddReviewMutation,
} = productsApi;
