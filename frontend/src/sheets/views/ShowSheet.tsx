import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { useAuth } from "react-oidc-context";
import { useParams } from "react-router-dom";
import { graphql } from "../../gql";
import { Transaction } from "../../gql/graphql.ts";
import { useAuthGraphQlClient } from "../../hooks/use-auth-graph-ql-client.tsx";
import { SheetStatsInstruments } from "../../transactions/components/SheetStatsInstruments.tsx";
import { TransactionList } from "../../transactions/components/TransactionList";
import { useQuerySheetStats } from "../hooks/use-query-sheet-stats.tsx";

const findAllTransactionsBySheet = graphql(`
    query findAllTransactionsBySheet($filter: TransactionFilter) {
        findAllTransactions(filter: $filter) {
            uuid
            title
            description
            amount
            timestamp
            category {
                uuid
                title
                description
                createdAt
                updatedAt
            }
            sheet {
                uuid
                title
                createdAt
                updatedAt
            }
        }
    }
`);

export const ShowSheet = () => {
	const { sheetId } = useParams();
	const { client } = useAuthGraphQlClient();
	const auth = useAuth();
	const { data, isLoading } = useQuery({
		queryKey: ["transactions", sheetId],
		queryFn: () =>
			client.request(findAllTransactionsBySheet, {
				filter: {
					sheetId: sheetId,
				},
			}),
		retry: 0,
	});
	const { data: sheetStats, isLoading: isSheetStatsLoading } =
		useQuerySheetStats({ sheetId: sheetId, token: auth.user?.access_token });
	const sheet = useMemo(() => {
		if (data?.findAllTransactions) {
			return data.findAllTransactions[0]?.sheet;
		}
	}, [data]);

	return (
		<div className="container m-auto flex flex-col gap-5">
			<h1 className="text-3xl">Transactions</h1>
			<h2 className="text-xl">{sheet?.title}</h2>
			<SheetStatsInstruments
				stats={sheetStats}
				isLoading={isSheetStatsLoading}
			/>
			<TransactionList
				transactions={data?.findAllTransactions as Transaction[]}
				isLoading={isLoading}
				sheet={sheet ?? undefined}
			/>
		</div>
	);
};
