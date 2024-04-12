import { CurrencyCell } from "../../components/CurrencyCell.tsx";
import type { SheetStats } from "../../sheets/Sheet.ts";

export const SheetStatsInstruments = ({
	stats,
	isLoading,
}: { stats?: SheetStats; isLoading: boolean }) => {
	if (isLoading) {
		return <>is loading</>;
	}
	return (
		<div>
			<div className="stat">
				<h5 className="stat-title">Sheet sum</h5>
				<p className="stat-value">
					<CurrencyCell amount={stats?.sum} />
				</p>
			</div>
		</div>
	);
};
