import { useQuery } from "@tanstack/react-query";
import { Sheet } from "../Sheet";
import { useParams } from "react-router-dom";
import { useAuth } from "react-oidc-context";
import { Transaction } from "../../transactions/Transaction";
import { TransactionList } from "../../transactions/components/TransactionList";

async function fetchSheet(uuid?: string, token?: string) {
  const response = await fetch(`/api/v1/sheets/${uuid}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (response.status === 401) {
    throw new Error("Invalid session, please reload the window.");
  } else if (!response.ok) {
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
  } else if (!response.ok) {
    const error = await response.json();
    if (error.message) throw new Error(error.message);
    throw new Error("Problem fetching data");
  }

  const data = await response.json();
  return data as Transaction[];
}

export const ShowSheet = () => {
  const { sheetId } = useParams();
  const auth = useAuth();
  const { data: sheet } = useQuery({
    queryKey: ["sheet", sheetId],
    queryFn: () => fetchSheet(sheetId, auth.user?.access_token),
  });
  const { data: transactions, isLoading: isTransactionsLoading } = useQuery({
    queryKey: ["sheet", sheetId, "transactions"],
    queryFn: () => fetchTransactionsOfSheet(sheetId, auth.user?.access_token),
    enabled: !!sheet,
  });

  return <div>
    <TransactionList 
    transactions={transactions} 
    isLoading={isTransactionsLoading} 
    sheet={sheet}
    />
  </div>;
};
