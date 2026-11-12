const formatter = new Intl.NumberFormat('ru-RU', {
	style: 'currency',
	currency: 'RUB',
	maximumFractionDigits: 2,
	minimumFractionDigits: 0,
});

export const money = (amount: number) => formatter.format(amount);
