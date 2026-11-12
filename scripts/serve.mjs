import { createServer } from 'node:http';
import { randomUUID } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import { extname, resolve, sep } from 'node:path';
import { setTimeout as delay } from 'node:timers/promises';
import { pathToFileURL } from 'node:url';
import { demoPassword, demoProducts, demoUser } from './demo-data.mjs';

const MIME = {
	'.html': 'text/html; charset=utf-8',
	'.js': 'text/javascript; charset=utf-8',
	'.css': 'text/css; charset=utf-8',
	'.svg': 'image/svg+xml',
	'.png': 'image/png',
	'.jpg': 'image/jpeg',
	'.webp': 'image/webp',
};

function json(response, status, data) {
	response.writeHead(status, {
		'Content-Type': 'application/json; charset=utf-8',
	});
	response.end(JSON.stringify(data));
}

async function readBody(request) {
	let size = 0;
	const chunks = [];
	for await (const chunk of request) {
		size += chunk.length;
		if (size > 64 * 1024) throw new Error('Запрос слишком большой');
		chunks.push(chunk);
	}
	const body = JSON.parse(Buffer.concat(chunks).toString('utf8'));
	if (!body || typeof body !== 'object' || Array.isArray(body))
		throw new Error('Ожидался JSON-объект');
	return body;
}

export function createDemoServer({
	directory = 'dist',
	likeDelay = 1000,
	failLikes = false,
} = {}) {
	const root = resolve(directory);
	const products = new Map(
		demoProducts().map((product) => [product.id, product])
	);
	const accounts = new Map([
		[demoUser.email, { user: { ...demoUser }, password: demoPassword }],
	]);
	const sessions = new Map();

	async function api(request, response, url) {
		const route = url.pathname.slice('/api'.length);
		const { method } = request;
		const token = request.headers.authorization?.replace(/^Bearer\s+/i, '');
		const user = sessions.get(token);
		const fail = (status, message) =>
			json(response, status, { statusCode: status, message });

		if (
			method === 'POST' &&
			(route === '/auth/login' || route === '/auth/register')
		) {
			const { email: rawEmail, password } = await readBody(request);
			const email =
				typeof rawEmail === 'string' ? rawEmail.trim().toLowerCase() : '';
			if (
				!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
				typeof password !== 'string' ||
				password.length < 6 ||
				password.length > 24
			) {
				return fail(400, 'Проверьте почту и пароль');
			}
			if (route === '/auth/register') {
				if (accounts.has(email)) return fail(409, 'Такой аккаунт уже есть');
				const created = {
					id: randomUUID(),
					email,
					name: email.split('@')[0],
					about: '',
					avatarPath: '',
				};
				accounts.set(email, { user: created, password });
				return json(response, 201, { user: created });
			}
			const account = accounts.get(email);
			if (!account || account.password !== password)
				return fail(401, 'Неверная почта или пароль');
			const accessToken = randomUUID();
			sessions.set(accessToken, account.user);
			return json(response, 200, { user: account.user, accessToken });
		}

		if (!user) return fail(401, 'Войдите в аккаунт');

		if (route === '/users/me') {
			if (method === 'GET') return json(response, 200, user);
			if (method === 'PATCH') {
				const { name, about, avatarPath } = await readBody(request);
				if (typeof name !== 'string' || !name.trim() || name.length > 80)
					return fail(400, 'Укажите имя');
				user.name = name.trim();
				if (typeof about === 'string') user.about = about.slice(0, 500);
				if (typeof avatarPath === 'string') user.avatarPath = avatarPath;
				return json(response, 200, user);
			}
		}

		if (route === '/products') {
			if (method === 'GET') {
				const search = (
					url.searchParams.get('searchTerm') || ''
				).toLocaleLowerCase('ru');
				const sort = url.searchParams.get('sort') || 'newest';
				const matching = Array.from(products.values())
					.filter(({ name, description }) =>
						(name + ' ' + description).toLocaleLowerCase('ru').includes(search)
					)
					.sort((a, b) => {
						if (sort === 'low-price')
							return a.price - a.discount - b.price + b.discount;
						if (sort === 'high-price')
							return b.price - b.discount - a.price + a.discount;
						return sort === 'oldest'
							? a.createdAt.localeCompare(b.createdAt)
							: b.createdAt.localeCompare(a.createdAt);
					});
				const perPage = Number(url.searchParams.get('perPage'));
				return json(response, 200, {
					products: perPage > 0 ? matching.slice(0, perPage) : matching,
					length: matching.length,
				});
			}
			if (method === 'POST') {
				const { name, description, price, discount, stock, images } =
					await readBody(request);
				if (
					typeof name !== 'string' ||
					!name.trim() ||
					name.length > 80 ||
					typeof description !== 'string' ||
					!description.trim() ||
					description.length > 600 ||
					!Number.isFinite(price) ||
					price <= 0 ||
					!Number.isFinite(discount) ||
					discount < 0 ||
					discount > price ||
					!Number.isInteger(stock) ||
					stock < 0
				)
					return fail(400, 'Проверьте название, описание, цену и остаток');
				const product = {
					id: randomUUID(),
					name: name.trim(),
					description: description.trim(),
					price,
					discount,
					stock,
					user,
					images:
						typeof images === 'string' && /^https?:\/\//i.test(images)
							? images
							: '/media/classic.svg',
					tags: [],
					likes: [],
					reviews: [],
					createdAt: new Date().toISOString(),
				};
				products.set(product.id, product);
				return json(response, 201, product);
			}
		}

		const item = /^\/products\/([^/]+)(\/likes)?$/.exec(route);
		if (item) {
			const id = decodeURIComponent(item[1]);
			const product = products.get(id);
			if (!product) return fail(404, 'Товар не найден');
			if (item[2] && (method === 'PUT' || method === 'DELETE')) {
				await delay(likeDelay);
				if (failLikes) return fail(503, 'Избранное временно недоступно');
				if (!products.has(id)) return fail(404, 'Товар не найден');
				if (method === 'PUT') {
					let like = product.likes.find((entry) => entry.userId === user.id);
					if (!like) {
						like = { id: randomUUID(), productId: id, userId: user.id };
						product.likes.push(like);
					}
					return json(response, 200, { like });
				}
				product.likes = product.likes.filter(
					(entry) => entry.userId !== user.id
				);
				return json(response, 200, { message: 'Товар убран из избранного' });
			}
			if (!item[2] && method === 'GET') return json(response, 200, product);
			if (!item[2] && method === 'DELETE') {
				if (product.user.id !== user.id)
					return fail(403, 'Удалять можно только свои товары');
				products.delete(id);
				return json(response, 200, { id });
			}
		}

		const reviewRoute = /^\/reviews\/leave\/([^/]+)$/.exec(route);
		if (reviewRoute && method === 'POST') {
			const product = products.get(decodeURIComponent(reviewRoute[1]));
			if (!product) return fail(404, 'Товар не найден');
			const { text, rating } = await readBody(request);
			if (
				typeof text !== 'string' ||
				text.trim().length < 3 ||
				text.length > 600 ||
				!Number.isInteger(rating) ||
				rating < 1 ||
				rating > 5
			) {
				return fail(400, 'Укажите оценку и текст отзыва');
			}
			const review = {
				id: randomUUID(),
				user,
				text: text.trim(),
				rating,
				createdAt: new Date().toISOString(),
			};
			product.reviews.push(review);
			return json(response, 201, review);
		}
		return fail(404, 'Маршрут не найден');
	}

	return createServer(async (request, response) => {
		try {
			const url = new URL(request.url, 'http://localhost');
			if (url.pathname.startsWith('/api/'))
				return await api(request, response, url);
			if (request.method !== 'GET' && request.method !== 'HEAD')
				return response.writeHead(405).end();
			const pathname = decodeURIComponent(url.pathname);
			const filename = extname(pathname)
				? resolve(root, '.' + pathname)
				: resolve(root, 'index.html');
			if (!filename.startsWith(root + sep))
				return response.writeHead(403).end();
			const body = await readFile(filename);
			response.writeHead(200, {
				'Content-Type': MIME[extname(filename)] || 'application/octet-stream',
			});
			response.end(request.method === 'HEAD' ? undefined : body);
		} catch (error) {
			if (error.code === 'ENOENT') return response.writeHead(404).end();
			return json(response, 400, { message: 'Не удалось обработать запрос' });
		}
	});
}

if (
	process.argv[1] &&
	import.meta.url === pathToFileURL(resolve(process.argv[1])).href
) {
	const port = Number(process.env.PORT || 4173);
	const directory = process.argv[2] || 'dist';
	const failLikes = process.argv.includes('--fail-likes');
	createDemoServer({ directory, failLikes }).listen(port, '127.0.0.1', () => {
		console.log(
			'DogFood: http://127.0.0.1:' +
				port +
				(failLikes ? ' (избранное отвечает ошибкой)' : '')
		);
	});
}
