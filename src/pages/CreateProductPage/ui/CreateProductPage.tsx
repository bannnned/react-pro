import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useCreateProductMutation } from '../../../features/products/api/productsApi';
import { Button, Input } from '../../../shared/ui/controls';
import { getMessageFromError } from '../../../shared/utils/getMessageFromError';

export function CreateProductPage() {
	const [createProduct, { isLoading }] = useCreateProductMutation();
	const [error, setError] = useState('');
	const navigate = useNavigate();

	async function submit(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();
		const form = new FormData(event.currentTarget);
		const read = (name: string) => String(form.get(name) ?? '').trim();
		const name = read('name');
		const description = read('description');
		const images = read('images');
		const price = Number(read('price'));
		const stock = Number(read('stock'));
		const discount = Number(read('discount'));
		setError('');

		if (
			!name ||
			!description ||
			price <= 0 ||
			discount < 0 ||
			discount > price ||
			!Number.isInteger(stock) ||
			stock < 0
		) {
			setError(
				'Заполните название и описание. Скидка не должна превышать цену, а остаток должен быть целым числом.'
			);
			return;
		}
		if (images && !/^https?:\/\//i.test(images)) {
			setError('Для изображения нужна ссылка HTTP или HTTPS.');
			return;
		}

		try {
			const product = await createProduct({
				name,
				description,
				price,
				stock,
				discount,
				images: images || '/media/classic.svg',
				tags: [],
				slug: 'dogfood-' + crypto.randomUUID(),
				categoryId: 1,
				isPublished: true,
			}).unwrap();
			toast.success('Товар появился в каталоге');
			navigate('/products/' + product.id, { replace: true });
		} catch (cause) {
			setError(getMessageFromError(cause, 'Не удалось создать товар'));
		}
	}

	return (
		<section className='form-panel'>
			<Link className='back-link' to='/'>
				← К каталогу
			</Link>
			<h1>Добавить товар</h1>
			<p>Укажите цену, остаток и описание лакомства.</p>
			<form className='form-fields' onSubmit={submit}>
				<Input label='Название' name='name' required maxLength={80} />
				<label className='field'>
					<span>Описание</span>
					<textarea name='description' rows={3} required maxLength={600} />
				</label>
				<div className='field-row'>
					<Input
						label='Цена, ₽'
						name='price'
						type='number'
						min='1'
						step='0.01'
						required
					/>
					<Input
						label='Скидка, ₽'
						name='discount'
						type='number'
						min='0'
						step='0.01'
						defaultValue='0'
					/>
					<Input
						label='Остаток, шт.'
						name='stock'
						type='number'
						min='0'
						step='1'
						required
					/>
				</div>
				<Input
					label='Ссылка на изображение (необязательно)'
					name='images'
					type='url'
				/>
				{error && (
					<p className='form-error' role='alert'>
						{error}
					</p>
				)}
				<Button type='submit' disabled={isLoading}>
					{isLoading ? 'Сохраняем…' : 'Опубликовать товар'}
				</Button>
			</form>
		</section>
	);
}
