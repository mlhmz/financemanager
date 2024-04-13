import { useQuery } from "@tanstack/react-query";
import { SheetStats } from "../Sheet";

async function fetchSheetStats(uuid?: string, token?: string) {
	const response = await fetch(`/api/v1/sheets/${uuid}/stats`, {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	});

	if (response.status === 401) {
		throw new Error("Invalid session, please reload the window.");
	}

	if (!response.ok) {
		const error = await response.json();
		if (error.message) throw new Error(error.message);
		throw new Error("Problem fetching data");
	}

	const data = await response.json();
	return data as SheetStats;
}

export const useQuerySheetStats = ({
	sheetId,
	token,
}: { sheetId?: string; token?: string }) => {
	const { data, isLoading } = useQuery({
		queryKey: ["sheet", sheetId, "stats"],
		queryFn: () => fetchSheetStats(sheetId, token),
	});

	return { data, isLoading };
};
