import { useAuth } from "react-oidc-context";
import { Link } from "react-router-dom";
import { CardSkeletons } from "../components/CardSkeletons.tsx";
import { useQuerySheets } from "../sheets/hooks/use-query-sheets.tsx";
import { Icons } from "../components/Icons.tsx";
import { SheetCard } from "./components/SheetCard.tsx";

export const Dashboard = () => {
	const auth = useAuth();
	const { data, isLoading } = useQuerySheets({
		token: auth.user?.access_token,
	});

	return (
		<div className="container m-auto">
			<h1 className="text-2xl">Hi, {auth.user?.profile.given_name}!</h1>
			<p>What do you want to do?</p>
			<div className="w-full flex flex-col my-5 gap-5">
				<div className="flex gap-3">
					<div className="flex flex-col items-center">
						<Link
							to="/app/categories"
							className="bg-neutral hover:bg-opacity-80 text-neutral-content p-1 rounded-md"
						>
							<Icons.tag />
						</Link>
						<p>Categories</p>
					</div>
					<div className="flex flex-col items-center">
						<Link
							to="/app/sheets"
							className="bg-neutral hover:bg-opacity-80 text-neutral-content p-1 rounded-md"
						>
							<Icons.table />
						</Link>
						<p>Sheets</p>
					</div>
				</div>
				<div className="flex flex-col w-full gap-3">
					<div>
						<h1 className="text-xl">Transactions</h1>
						<p>Grouped by sheets</p>
					</div>
					<div className="flex flex-wrap gap-3">
						{isLoading ? (
							<CardSkeletons amount={13} />
						) : (
							data?.map((sheet) => <SheetCard sheet={sheet} />)
						)}
					</div>
				</div>
			</div>
		</div>
	);
};
