import { useEffect, useRef } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { object, string } from 'yup';
import { Button, Input } from '../../../shared/ui/controls';
import { useAppDispatch } from '../../../shared/store/hooks';
import { getMessageFromError } from '../../../shared/utils/getMessageFromError';
import {
	useSignInMutation,
	useSignUpMutation,
	type Credentials,
} from '../api/authApi';
import { setSession } from '../model/session';

const schema = object({
	email: string()
		.trim()
		.email('Введите корректный email')
		.required('Введите email'),
	password: string()
		.min(6, 'Минимум 6 символов')
		.max(24, 'Максимум 24 символа')
		.required('Введите пароль'),
});

export function AuthForm({ mode }: { mode: 'signin' | 'signup' }) {
	const isSignIn = mode === 'signin';
	const [signIn] = useSignInMutation();
	const [signUp] = useSignUpMutation();
	const dispatch = useAppDispatch();
	const navigate = useNavigate();
	const { state } = useLocation();
	const emailRef = useRef<HTMLInputElement>(null);
	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting },
	} = useForm<Credentials>({
		resolver: yupResolver(schema),
	});
	const { ref: registerEmail, ...email } = register('email');

	useEffect(() => {
		emailRef.current?.focus();
	}, []);

	async function submit(values: Credentials) {
		try {
			const session = await (isSignIn
				? signIn(values)
				: signUp(values)
			).unwrap();
			if (isSignIn) {
				dispatch(setSession(session));
				toast.success('Вы вошли в DogFood');
				navigate(state?.from || '/', { replace: true });
			} else {
				toast.success('Аккаунт создан. Теперь можно войти.');
				navigate('/signin', { replace: true, state });
			}
		} catch (error) {
			toast.error(
				getMessageFromError(
					error,
					isSignIn ? 'Не удалось войти' : 'Не удалось зарегистрироваться'
				)
			);
		}
	}

	return (
		<section className='form-panel auth-panel'>
			<h1>{isSignIn ? 'Вход' : 'Регистрация'}</h1>
			<p>
				{isSignIn
					? 'Войдите, чтобы открыть каталог и избранное.'
					: 'Создайте аккаунт, чтобы сохранять товары и оставлять отзывы.'}
			</p>
			<form className='form-fields' noValidate onSubmit={handleSubmit(submit)}>
				<Input
					label='Электронная почта'
					type='email'
					autoComplete='email'
					required
					error={errors.email?.message}
					{...email}
					ref={(element) => {
						emailRef.current = element;
						registerEmail(element);
					}}
				/>
				<Input
					label='Пароль'
					type='password'
					autoComplete={isSignIn ? 'current-password' : 'new-password'}
					required
					error={errors.password?.message}
					{...register('password')}
				/>
				<Button type='submit' disabled={isSubmitting}>
					{isSubmitting ? 'Подождите…' : isSignIn ? 'Войти' : 'Создать аккаунт'}
				</Button>
			</form>
			<p className='auth-link'>
				<Link state={state} to={isSignIn ? '/signup' : '/signin'}>
					{isSignIn ? 'Зарегистрироваться' : 'Уже есть аккаунт? Войти'}
				</Link>
			</p>
		</section>
	);
}
