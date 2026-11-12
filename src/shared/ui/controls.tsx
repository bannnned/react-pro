import { useId, type ComponentPropsWithRef } from 'react';

type ButtonProps = ComponentPropsWithRef<'button'> & {
	variant?: 'primary' | 'secondary' | 'danger';
};

export function Button({
	variant = 'primary',
	type = 'button',
	className = '',
	...props
}: ButtonProps) {
	return (
		<button
			type={type}
			className={`button button--${variant} ${className}`}
			{...props}
		/>
	);
}

type InputProps = ComponentPropsWithRef<'input'> & {
	label: string;
	error?: string;
};

export function Input({ label, error, id, ...props }: InputProps) {
	const generatedId = useId();
	const inputId = id || generatedId;
	return (
		<label className='field' htmlFor={inputId}>
			<span>{label}</span>
			<input
				id={inputId}
				aria-invalid={!!error}
				aria-describedby={error ? `${inputId}-error` : undefined}
				{...props}
			/>
			{error && <small id={`${inputId}-error`}>{error}</small>}
		</label>
	);
}
