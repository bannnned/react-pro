import type { ReactNode } from 'react';
import { Button } from './controls';
import { Spinner } from './Spinner';

type QueryStateProps = {
	loading: boolean;
	error?: string;
	retry?: () => void;
	children: ReactNode;
};

export const QueryState = ({
	loading,
	error,
	retry,
	children,
}: QueryStateProps) => {
	if (loading) return <Spinner />;
	if (error)
		return (
			<div className='empty-state' role='alert'>
				<p>{error}</p>
				{retry && <Button onClick={retry}>Повторить</Button>}
			</div>
		);
	return children;
};
