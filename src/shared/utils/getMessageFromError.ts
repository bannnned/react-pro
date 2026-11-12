export function getMessageFromError(error: unknown, fallback: string) {
	if (typeof error !== 'object' || error === null) return fallback;

	const details = 'data' in error ? error.data : error;
	if (typeof details === 'object' && details !== null && 'message' in details) {
		const { message } = details;
		if (typeof message === 'string') return message;
		if (
			Array.isArray(message) &&
			message.every((part) => typeof part === 'string')
		) {
			return message.join('. ');
		}
	}
	if (
		'status' in error &&
		(error.status === 'FETCH_ERROR' || error.status === 'TIMEOUT_ERROR')
	) {
		return 'Сервер недоступен. Попробуйте ещё раз.';
	}
	return fallback;
}
