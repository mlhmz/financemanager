export const CardSkeletons = ({ amount }: { amount: number }) => {
	return Array.from({ length: amount }).map(() => (
		<div className="skeleton w-64 h-28" />
	));
};
