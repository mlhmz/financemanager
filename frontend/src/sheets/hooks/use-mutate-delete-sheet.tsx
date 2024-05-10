import { useMutation } from "@tanstack/react-query";
import { graphql } from "../../gql";
import { useAuthGraphQlClient } from "../../hooks/use-auth-graph-ql-client.tsx";

const deleteSheetByUuid = graphql(`
	mutation deleteSheetByUuid($uuid: ID!) {
		deleteSheetByUuid(uuid: $uuid)
	}
`);

export const useMutateDeleteSheet = () => {
	const { client } = useAuthGraphQlClient();
	const { mutateAsync } = useMutation({
		mutationFn: (uuid: string) =>
			client.request(deleteSheetByUuid, {
				uuid: uuid,
			}),
	});

	return { mutateAsync };
};
