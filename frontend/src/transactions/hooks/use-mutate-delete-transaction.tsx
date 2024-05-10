import { useMutation } from "@tanstack/react-query";
import { graphql } from "../../gql";
import { useAuthGraphQlClient } from "../../hooks/use-auth-graph-ql-client.tsx";

const deleteTransaction = graphql(`
	mutation deleteTransaction($uuid: ID!) {
		deleteTransactionByUUID(uuid: $uuid)
	}
`);

export const useMutateDeleteTransaction = () => {
	const { client } = useAuthGraphQlClient();
	const { mutateAsync } = useMutation({
		mutationFn: (uuid: string) =>
			client.request(deleteTransaction, {
				uuid: uuid,
			}),
	});

	return { mutateAsync };
};
