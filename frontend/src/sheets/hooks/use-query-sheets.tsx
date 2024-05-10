import { useQuery } from "@tanstack/react-query";
import { graphql } from "../../gql";
import { useAuthGraphQlClient } from "../../hooks/use-auth-graph-ql-client.tsx";

const findAllSheets = graphql(`
	query findAllSheets {
		findAllSheets {
			uuid
			title
			createdAt
			updatedAt
		}
	}
`);

export const useQuerySheets = () => {
	const { client } = useAuthGraphQlClient();
	const { data, isLoading } = useQuery({
		queryKey: ["sheets"],
		queryFn: () => client.request(findAllSheets),
	});

	return { data, isLoading };
};
