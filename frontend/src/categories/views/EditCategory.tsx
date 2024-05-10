import {useNavigate, useParams} from "react-router-dom";
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {toast} from "sonner";
import {CategoryEditor} from "../components/CategoryEditor";
import {CategoryUpdateMutation, CategoryUpdateMutationSchema} from "../../graphql.ts";
import {graphql} from "../../gql";
import {useAuthGraphQlClient} from "../../hooks/use-auth-graph-ql-client.tsx";

const findCategoryByUuid = graphql(`
    query findCategoryByUuid($uuid: ID!) {
        findCategoryByUuid(uuid: $uuid) {
            uuid
            title
            description
            createdAt
            updatedAt
        }
    }
`)

const updateCategory = graphql(`
    mutation updateCategory($uuid: ID!, $payload: CategoryUpdateMutation!) {
        updateCategory(uuid: $uuid, payload: $payload) {
            title
        }
    }
`)

export const EditCategory = () => {
  const { categoryId } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { client } = useAuthGraphQlClient();
  const { data, isLoading } = useQuery({
    queryKey: ["categories", categoryId],
    queryFn: () => client.request(findCategoryByUuid, {
      uuid: categoryId ?? ""
    }),
    enabled: !!categoryId
  });
  const { mutate } = useMutation({
    mutationFn: (category: CategoryUpdateMutation) => {
      return client.request(updateCategory, {
        uuid: data?.findCategoryByUuid?.uuid ?? "",
        payload: category
      })
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: ["categories"] }),
  });

  const onSubmit = (formData: CategoryUpdateMutation) => {
    mutate(
      { ...formData },
      {
        onSuccess: (data) => {
          toast.success(
            `The category named '${data.updateCategory?.title}' was successfully updated.`
          );
          navigate("/app/categories");
        },
        onError: (error) =>
          toast.error(error.message),
      }
    );
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center gap-3">
        <span className="loading loading-spinner loading-lg"></span>
        <h1>Loading</h1>
      </div>
    );
  } else if (!data?.findCategoryByUuid?.uuid) {
    return <h1>Not found</h1>;
  }
  return <CategoryEditor<CategoryUpdateMutation>
    title={<h1 className="text-3xl">Update a category</h1>}
    onSubmit={onSubmit}
    initialData={data.findCategoryByUuid}
    zodSchema={CategoryUpdateMutationSchema()}
  />;
};
