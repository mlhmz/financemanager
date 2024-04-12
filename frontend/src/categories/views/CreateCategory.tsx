import {useMutation, useQueryClient} from "@tanstack/react-query";
import {useAuth} from "react-oidc-context";
import {useNavigate} from "react-router-dom";
import {toast} from "sonner";
import type {Category, MutateCategory} from "../Category";
import {CategoryEditor} from "../components/CategoryEditor";

async function createCategory(
    input: MutateCategory,
    token?: string
): Promise<Category> {
    const response = await fetch("/api/v1/categories", {
        headers: {
            Authorization: `Bearer ${token ?? ""}`,
            "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify(input),
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
    return data as Category;
}

export const CreateCategory = () => {
    const queryClient = useQueryClient();
    const auth = useAuth();
    const navigate = useNavigate();
    const {mutate} = useMutation({
        mutationFn: (data: MutateCategory) => {
            return createCategory(data, auth.user?.access_token);
        },
        onSettled: () => queryClient.invalidateQueries({ queryKey: ["categories"]} ),
    });

    const onSubmit = (formData: MutateCategory) => {
        mutate(
            {...formData},
            {
                onSuccess: (data) => {
                    toast.success(
                        `The category named '${data.title}' was successfully created.`
                    );
                    navigate("/app/categories");
                },
                onError: (error) =>
                    error instanceof Error && toast.error(error.message),
            }
        );
    };

    return <CategoryEditor onSubmit={onSubmit}/>;
};
