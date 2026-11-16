import { useState, type FormEvent } from 'react';
import { toast } from 'react-toastify';
import {
	useGetProfileQuery,
	useUpdateProfileMutation,
} from '../../../features/auth/api/authApi';
import { Button, Input } from '../../../shared/ui/controls';
import { QueryState } from '../../../shared/ui/QueryState';
import { getMessageFromError } from '../../../shared/utils/getMessageFromError';

const ProfileForm = ({ user }: { user: User }) => {
	const [update, { isLoading }] = useUpdateProfileMutation();
	const [error, setError] = useState('');

	async function submit(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();
		const data = new FormData(event.currentTarget);
		const read = (key: string) => String(data.get(key) ?? '').trim();
		const name = read('name');
		const about = read('about');
		const avatarPath = read('avatarPath');
		setError('');
		if (!name || (avatarPath && !/^https?:\/\//i.test(avatarPath))) {
			setError('Укажите имя и, при необходимости, ссылку HTTP или HTTPS.');
			return;
		}
		try {
			await update({ name, about, avatarPath }).unwrap();
			toast.success('Профиль сохранён');
		} catch (cause) {
			setError(getMessageFromError(cause, 'Не удалось сохранить профиль'));
		}
	}

	return (
		<form className='form-fields' onSubmit={submit}>
			<Input
				label='Имя'
				name='name'
				defaultValue={user.name || ''}
				required
				maxLength={80}
			/>
			<Input
				label='Электронная почта'
				defaultValue={user.email}
				readOnly
				type='email'
			/>
			<label className='field'>
				<span>О себе</span>
				<textarea
					name='about'
					rows={3}
					defaultValue={user.about || ''}
					maxLength={500}
				/>
			</label>
			<Input
				label='Ссылка на аватар'
				name='avatarPath'
				type='url'
				defaultValue={user.avatarPath || ''}
			/>
			{error && (
				<p className='form-error' role='alert'>
					{error}
				</p>
			)}
			<Button type='submit' disabled={isLoading}>
				{isLoading ? 'Сохраняем…' : 'Сохранить профиль'}
			</Button>
		</form>
	);
};

export const ProfilePage = () => {
	const { data, isLoading, error, refetch } = useGetProfileQuery();
	return (
		<section className='form-panel'>
			<h1>Мои данные</h1>
			<QueryState
				loading={isLoading}
				error={
					error
						? getMessageFromError(error, 'Не удалось загрузить профиль')
						: undefined
				}
				retry={refetch}>
				{data && <ProfileForm key={data.id} user={data} />}
			</QueryState>
		</section>
	);
};
