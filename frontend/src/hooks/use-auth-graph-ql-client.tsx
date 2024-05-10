import { GraphQLClient } from "graphql-request";
import { useAuth } from "react-oidc-context";

export const useAuthGraphQlClient = () => {
	const auth = useAuth();
	const client = new GraphQLClient(
		window.location.protocol + "//" + window.location.host + "/api/graphql",
		{
			headers: {
				Authorization: `Bearer ${auth.user?.access_token}`,
			},
		},
	);

	return { client };
};
