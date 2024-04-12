import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "react-oidc-context";
import { useNavigate, useParams } from "react-router-dom";
import { MutateTransaction, Transaction } from "../Transaction";
import { toast } from "sonner";
import { TransactionEditor } from "../components/TransactionEditor";

async function createTransaction(
  input: MutateTransaction,
  token?: string
): Promise<Transaction> {
  const response = await fetch("/api/v1/transactions", {
    headers: {
      Authorization: `Bearer ${token ?? ""}`,
      "Content-Type": "application/json",
    },
    method: "POST",
    body: JSON.stringify(input),
  });
  if (response.status === 401) {
    throw new Error("Invalid session, please reload the window.");
  } else if (!response.ok) {
    const error = await response.json();
    if (error.message) throw new Error(error.message);
    throw new Error("Problem fetching data");
  }

  const data = await response.json();
  return data as Transaction;
}

export const CreateTransaction = () => {
  const { sheetId } = useParams();
  const queryClient = useQueryClient();
  const auth = useAuth();
  const navigate = useNavigate();
  const { mutate } = useMutation({
    mutationFn: (data: MutateTransaction) => {
      return createTransaction(data, auth.user?.access_token);
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: ["sheets"] }),
  });

  const onSubmit = (formData: MutateTransaction) => {
    mutate(
      { ...formData },
      {
        onSuccess: (data) => {
          toast.success(
            `The transaction named '${data.title}' was successfully created.`
          );
          navigate(`/app/sheets/${data.sheet?.uuid}`);
        },
        onError: (error) =>
          error instanceof Error && toast.error(error.message),
      }
    );
  };

  return <TransactionEditor onSubmit={onSubmit} sheetId={sheetId} />
}