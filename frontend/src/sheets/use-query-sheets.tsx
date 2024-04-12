import {Sheet} from "./Sheet.ts";
import {useQuery} from "@tanstack/react-query";

async function fetchSheets(token: string | undefined) {
    const response = await fetch("/api/v1/sheets", {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    if (response.status === 401) {
        throw new Error("Invalid session, please reload the window.");
    } else if (!response.ok) {
        const error = await response.json();
        if (error.message) throw new Error(error.message);
        throw new Error("Problem fetching data");
    }

    const data = await response.json();
    return data as Sheet[];
}

export const useQuerySheets = ({token}: { token?: string }) => {

    const { data, isLoading } = useQuery({
        queryKey: ["sheets"],
        queryFn: () => fetchSheets(token),
        enabled: !!token
    });

    return { data, isLoading };
}