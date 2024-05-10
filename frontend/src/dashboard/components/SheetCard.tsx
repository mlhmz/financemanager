import { Link } from "react-router-dom";
import { CurrencyCell } from "../../components/CurrencyCell";
import { Maybe, Sheet } from "../../gql/graphql.ts";
import { useQuerySheetStats } from "../../sheets/hooks/use-query-sheet-stats";

export const SheetCard = ({ sheet }: { sheet: Maybe<Sheet> }) => {
	const { data: sheetStats } = useQuerySheetStats({
		sheetId: sheet?.uuid ?? undefined,
	});

	return (
		<Link
			to={`/app/sheets/${sheet?.uuid}`}
			className="card max-sm:w-[48%] w-52 h-28 bg-neutral hover:bg-opacity-80 text-neutral-content cursor-pointer transition-all"
		>
			<div className="card-body">
				<h2 className="card-title">{sheet?.title}</h2>
				<p>
					<CurrencyCell
						monotone
						amount={sheetStats?.calculateSheetStats?.sum ?? 0}
					/>
				</p>
			</div>
		</Link>
	);
};
