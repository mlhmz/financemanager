import { useMutation } from "@tanstack/react-query";

async function deleteSheet(uuid?: string, token?: string) {
	const response = await fetch(`/api/v1/sheets/${uuid}`, {
		headers: {
			Authorization: `Bearer ${token ?? ""}`,
		},
		method: "DELETE",
	});
	if (response.status === 401) {
		throw new Error("Invalid session, please reload the window.");
	}
	if (!response.ok) {
		const error = await response.json();
		if (error.message) throw new Error(error.message);
		throw new Error("Problem fetching data");
	}
}

export const useMutateDeleteSheet = ({ token }: { token?: string }) => {
	const { mutateAsync } = useMutation({
		mutationFn: (uuid?: string) => deleteSheet(uuid, token),
	});

	return { mutateAsync };
};
