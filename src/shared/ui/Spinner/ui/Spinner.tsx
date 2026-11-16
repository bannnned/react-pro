import s from './Spinner.module.css';

export const Spinner = () => {
	return (
		<div className={s.wrapper} role='status' aria-label='Загрузка'>
			<div className={s.loader} aria-hidden='true'>
				<div />
				<div />
				<div />
				<div />
			</div>
		</div>
	);
};
