import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { graphql } from "../../gql";
import { SheetCreateMutation } from "../../gql/graphql.ts";
import { useAuthGraphQlClient } from "../../hooks/use-auth-graph-ql-client.tsx";
import { SheetEditor } from "../components/SheetEditor";

const createSheet = graphql(`
	mutation createSheet($payload: SheetCreateMutation!) {
		createSheet(payload: $payload) {
			title
		}
	}
`);

export const CreateSheet = () => {
	const queryClient = useQueryClient();
	const navigate = useNavigate();
	const { client } = useAuthGraphQlClient();
	const { mutate } = useMutation({
		mutationFn: (data: SheetCreateMutation) => {
			return client.request(createSheet, {
				payload: data,
			});
		},
		onSettled: () => queryClient.invalidateQueries({ queryKey: ["sheets"] }),
	});

	const onSubmit = (formData: SheetCreateMutation) => {
		mutate(
			{ ...formData },
			{
				onSuccess: (data) => {
					toast.success(
						`The sheet named '${data.createSheet?.title}' was successfully created.`,
					);
					navigate("/app/sheets");
				},
				onError: (error) => toast.error(error.message),
			},
		);
	};

	return <SheetEditor onSubmit={onSubmit} />;
};
