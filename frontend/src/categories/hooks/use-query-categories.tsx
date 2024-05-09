import { useQuery } from "@tanstack/react-query";
import { Category } from "../Category";

async function fetchCategories(token: string | undefined) {
	const response = await fetch("/api/v1/categories", {
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
	return data as Category[];
}

export const useQueryCategories = ({ token }: { token?: string }) => {
	const { data, isLoading } = useQuery({
		queryKey: ["categories"],
		queryFn: () => fetchCategories(token),
	});

	return { data, isLoading };
};
