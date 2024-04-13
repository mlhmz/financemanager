export const CurrencyCell = ({
	amount,
	monotone,
}: { amount?: number; monotone?: boolean }) => {
	if (amount === undefined) {
		return <></>;
	}

	const getClassNameByAmount = () => {
		if (amount === 0 || monotone) {
			return "";
		}
		if (amount > 0) {
			return "text-green-600";
		}
		return "text-red-600";
	};

	return <span className={getClassNameByAmount()}>{amount} €</span>;
};
