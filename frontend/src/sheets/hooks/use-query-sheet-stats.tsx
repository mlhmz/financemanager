import { useQuery } from "@tanstack/react-query";
import { graphql } from "../../gql";
import { useAuthGraphQlClient } from "../../hooks/use-auth-graph-ql-client.tsx";

const calculateSheetStats = graphql(`
	query calculateSheetStats($uuid: ID!) {
		calculateSheetStats(uuid: $uuid) {
			sum
		}
	}
`);

export const useQuerySheetStats = ({ sheetId }: { sheetId?: string }) => {
	const { client } = useAuthGraphQlClient();
	const { data, isLoading } = useQuery({
		queryKey: ["sheet", sheetId, "stats"],
		queryFn: () =>
			client.request(calculateSheetStats, {
				uuid: sheetId ?? "",
			}),
		enabled: !!sheetId,
	});

	return { data, isLoading };
};
