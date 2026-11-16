import { useState, type FormEvent } from 'react';
import { toast } from 'react-toastify';
import { Button } from '../../shared/ui/controls';
import { getMessageFromError } from '../../shared/utils/getMessageFromError';
import { useAddReviewMutation } from '../products/api/productsApi';

const dates = new Intl.DateTimeFormat('ru-RU', { dateStyle: 'medium' });

export const Stars = ({ rating }: { rating: number }) => {
	const rounded = Math.round(Math.max(0, Math.min(5, rating)));
	return (
		<span className='stars' role='img' aria-label={`Оценка ${rating} из 5`}>
			{'★'.repeat(rounded)}
			{'☆'.repeat(5 - rounded)}
		</span>
	);
};

export const Reviews = ({ product }: { product: Product }) => {
	const [submitReview, { isLoading }] = useAddReviewMutation();
	const [error, setError] = useState('');

	async function submit(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();
		const form = event.currentTarget;
		const data = new FormData(form);
		const text = String(data.get('text') ?? '').trim();
		const rating = Number(data.get('rating'));
		setError('');
		if (text.length < 3 || rating < 1 || rating > 5) {
			setError('Выберите оценку и напишите хотя бы 3 символа.');
			return;
		}
		try {
			await submitReview({ id: product.id, text, rating }).unwrap();
			form.reset();
			toast.success('Отзыв опубликован');
		} catch (cause) {
			setError(getMessageFromError(cause, 'Не удалось отправить отзыв'));
		}
	}

	return (
		<section className='review-section'>
			<h2>
				Отзывы <small>{product.reviews.length}</small>
			</h2>
			{!product.reviews.length && <p>У этого товара пока нет отзывов.</p>}
			{product.reviews.map((review) => (
				<article className='review' key={review.id}>
					<div className='review-heading'>
						<strong>{review.user.name || 'Покупатель DogFood'}</strong>
						<time dateTime={review.createdAt}>
							{dates.format(new Date(review.createdAt))}
						</time>
					</div>
					<Stars rating={review.rating} />
					<p>{review.text}</p>
				</article>
			))}
			<form className='form-fields review-form' onSubmit={submit}>
				<h3>Оставить отзыв</h3>
				<label className='field'>
					<span>Оценка</span>
					<select aria-label='Оценка' name='rating' required defaultValue=''>
						<option value='' disabled>
							Выберите от 1 до 5
						</option>
						{[5, 4, 3, 2, 1].map((value) => (
							<option key={value} value={value}>
								{value}
							</option>
						))}
					</select>
				</label>
				<label className='field'>
					<span>Текст отзыва</span>
					<textarea
						name='text'
						required
						minLength={3}
						maxLength={600}
						rows={3}
					/>
				</label>
				{error && (
					<p className='form-error' role='alert'>
						{error}
					</p>
				)}
				<Button type='submit' disabled={isLoading}>
					{isLoading ? 'Отправляем…' : 'Отправить отзыв'}
				</Button>
			</form>
		</section>
	);
};
