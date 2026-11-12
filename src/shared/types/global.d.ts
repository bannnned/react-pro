export {};

declare global {
	type User = {
		id: string;
		name?: string;
		email: string;
		about?: string;
		avatarPath?: string;
	};

	type Like = { id: string; userId: string; productId: string };

	type Review = {
		id: string;
		user: User;
		text: string;
		rating: number;
		createdAt: string;
	};

	type Product = {
		id: string;
		name: string;
		description: string;
		price: number;
		images: string;
		discount: number;
		stock: number;
		tags: string[];
		user?: User;
		likes: Like[];
		reviews: Review[];
	};

	type CartProduct = Product & { count: number };
	type Sort = 'high-price' | 'low-price' | 'newest' | 'oldest';
}
