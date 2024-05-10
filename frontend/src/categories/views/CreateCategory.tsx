import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { CategoryEditor } from "../components/CategoryEditor";
import { graphql } from "../../gql";
import { useAuthGraphQlClient } from "../../hooks/use-auth-graph-ql-client.tsx";
import { CategoryCreateMutation, CategoryCreateMutationSchema } from "../../graphql.ts";

const createCategory = graphql(`
    mutation createCategory($payload: CategoryCreateMutation!) {
        createCategory(payload: $payload) {
            title
        }
    }
`)

export const CreateCategory = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const {client} = useAuthGraphQlClient();
  const {mutate} = useMutation({
    mutationFn: (data: CategoryCreateMutation) => {
      return client.request(createCategory, {
        payload: data
      });
    },
    onSettled: () => queryClient.invalidateQueries({queryKey: ["categories"]}),
  });

  const onSubmit = (formData: CategoryCreateMutation) => {
    mutate(
      {...formData},
      {
        onSuccess: (data) => {
          toast.success(
            `The category named '${data.createCategory?.title}' was successfully created.`
          );
          navigate("/app/categories");
        },
        onError: (error) =>
          toast.error(error.message),
      }
    );
  };

  return <CategoryEditor<CategoryCreateMutation>
    title={<h1 className="text-3xl">Create a Category</h1>}
    onSubmit={onSubmit}
    zodSchema={CategoryCreateMutationSchema()}/>;
};
