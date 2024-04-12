import { useMutation } from "@tanstack/react-query";

async function deleteTransaction(uuid?: string, token?: string) {
	const response = await fetch(`/api/v1/transactions/${uuid}`, {
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

export const useMutateDeleteTransaction = ({ token }: { token?: string }) => {
	const { mutateAsync } = useMutation({
		mutationFn: (uuid?: string) => deleteTransaction(uuid, token),
	});

	return { mutateAsync };
};
