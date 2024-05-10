import { useQuery } from "@tanstack/react-query";
import { graphql } from "../../gql";
import { useAuthGraphQlClient } from "../../hooks/use-auth-graph-ql-client.tsx";

const findAllCategories = graphql(`
	query findAllCategories {
		findAllCategories {
			uuid
			title
			description
			createdAt
			updatedAt
		}
	}
`);

export const useQueryCategories = () => {
	const { client } = useAuthGraphQlClient();
	const { data, isLoading } = useQuery({
		queryKey: ["categories"],
		queryFn: () => client.request(findAllCategories),
	});

	return { data, isLoading };
};
