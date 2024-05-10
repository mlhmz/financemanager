import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { graphql } from "../../gql";
import { TransactionCreateMutation } from "../../gql/graphql.ts";
import { useAuthGraphQlClient } from "../../hooks/use-auth-graph-ql-client.tsx";
import { TransactionEditor } from "../components/TransactionEditor";

const createTransaction = graphql(`
    mutation createTransaction($payload: TransactionCreateMutation!) {
        createTransaction(payload: $payload) {
					uuid
					title
					sheet {
						uuid
					}
				}
    }
`);

export const CreateTransaction = () => {
	const { sheetId } = useParams();
	const queryClient = useQueryClient();
	const navigate = useNavigate();
	const { client } = useAuthGraphQlClient();
	const { mutate } = useMutation({
		mutationFn: (data: TransactionCreateMutation) => {
			return client.request(createTransaction, {
				payload: data,
			});
		},
		onSettled: () => queryClient.invalidateQueries({ queryKey: ["sheets"] }),
	});

	const onSubmit = (formData: TransactionCreateMutation) => {
		mutate(
			{ ...formData },
			{
				onSuccess: (data) => {
					toast.success(
						`The transaction named '${data.createTransaction?.title}' was successfully created.`,
					);
					navigate(`/app/sheets/${data.createTransaction?.sheet?.uuid}`);
				},
				onError: (error) => toast.error(error.message),
			},
		);
	};

	return <TransactionEditor onSubmit={onSubmit} sheetId={sheetId} />;
};
