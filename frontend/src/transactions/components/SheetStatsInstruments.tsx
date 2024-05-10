import { CurrencyCell } from "../../components/CurrencyCell.tsx";
import { Maybe, SheetStats } from "../../gql/graphql.ts";

export const SheetStatsInstruments = ({
	stats,
	isLoading,
}: { stats?: Maybe<SheetStats>; isLoading: boolean }) => {
	if (isLoading) {
		return <>is loading</>;
	}
	return (
		<div>
			<div className="stat">
				<h5 className="stat-title">Sheet sum</h5>
				<p className="stat-value">
					<CurrencyCell amount={stats?.sum ?? 0} />
				</p>
			</div>
		</div>
	);
};
