import { useQuery } from "@tanstack/react-query";
import { useAuth } from "react-oidc-context";
import { useParams } from "react-router-dom";
import type { Transaction } from "../../transactions/Transaction";
import { SheetStatsInstruments } from "../../transactions/components/SheetStatsInstruments.tsx";
import { TransactionList } from "../../transactions/components/TransactionList";
import type { Sheet, SheetStats } from "../Sheet";

async function fetchSheet(uuid?: string, token?: string) {
	const response = await fetch(`/api/v1/sheets/${uuid}`, {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	});

	if (response.status === 401) {
		throw new Error("Invalid session, please reload the window.");
	}

	if (!response.ok) {
		const error = await response.json();
		if (error.message) throw new Error(error.message);
		throw new Error("Problem fetching data");
	}

	const data = await response.json();
	return data as Sheet;
}

async function fetchTransactionsOfSheet(uuid?: string, token?: string) {
	const response = await fetch(`/api/v1/transactions/sheet/${uuid}`, {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	});

	if (response.status === 401) {
		throw new Error("Invalid session, please reload the window.");
	}

	if (!response.ok) {
		const error = await response.json();
		if (error.message) throw new Error(error.message);
		throw new Error("Problem fetching data");
	}

	const data = await response.json();
	return data as Transaction[];
}

async function fetchSheetStats(uuid?: string, token?: string) {
	const response = await fetch(`/api/v1/sheets/${uuid}/stats`, {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	});

	if (response.status === 401) {
		throw new Error("Invalid session, please reload the window.");
	}

	if (!response.ok) {
		const error = await response.json();
		if (error.message) throw new Error(error.message);
		throw new Error("Problem fetching data");
	}

	const data = await response.json();
	return data as SheetStats;
}

export const ShowSheet = () => {
	const { sheetId } = useParams();
	const auth = useAuth();
	const { data: sheet, isLoading: isSheetStatsLoading } = useQuery({
		queryKey: ["sheet", sheetId],
		queryFn: () => fetchSheet(sheetId, auth.user?.access_token),
	});
	const { data: sheetStats } = useQuery({
		queryKey: ["sheet", sheetId, "stats"],
		queryFn: () => fetchSheetStats(sheetId, auth.user?.access_token),
	});
	const { data: transactions, isLoading: isTransactionsLoading } = useQuery({
		queryKey: ["sheet", sheetId, "transactions"],
		queryFn: () => fetchTransactionsOfSheet(sheetId, auth.user?.access_token),
		enabled: !!sheet,
	});

	return (
		<div className="container m-auto flex flex-col gap-5">
			<h1 className="text-3xl">Transactions</h1>
			<h2 className="text-xl">{sheet?.title}</h2>
			<SheetStatsInstruments
				stats={sheetStats}
				isLoading={isSheetStatsLoading}
			/>
			<TransactionList
				transactions={transactions}
				isLoading={isTransactionsLoading}
				sheet={sheet}
			/>
		</div>
	);
};
