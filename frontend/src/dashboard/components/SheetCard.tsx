import { Link } from "react-router-dom";
import { Sheet } from "../../sheets/Sheet";
import { useQuerySheetStats } from "../../sheets/hooks/use-query-sheet-stats";
import { useAuth } from "react-oidc-context";
import { CurrencyCell } from "../../components/CurrencyCell";

export const SheetCard = ({ sheet }: { sheet: Sheet }) => {
	const { user } = useAuth();
	const { data: sheetStats } = useQuerySheetStats({
		sheetId: sheet.uuid,
		token: user?.access_token,
	});

	return (
		<Link
			to={`/app/sheets/${sheet.uuid}`}
			className="card max-sm:w-[48%] w-52 h-28 bg-neutral hover:bg-opacity-80 text-neutral-content cursor-pointer transition-all"
		>
			<div className="card-body">
				<h2 className="card-title">{sheet.title}</h2>
				<p>
					<CurrencyCell monotone amount={sheetStats?.sum ?? 0} />
				</p>
			</div>
		</Link>
	);
};
