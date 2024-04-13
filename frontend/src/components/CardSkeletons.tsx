export const CardSkeletons = ({ amount }: { amount: number }) => {
	return Array.from({ length: amount }).map(() => (
		<div className="skeleton max-sm:w-[48%] w-52 h-28" />
	));
};
