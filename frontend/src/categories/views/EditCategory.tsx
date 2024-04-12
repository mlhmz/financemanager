import { useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "react-oidc-context";
import { toast } from "sonner";
import { Category, MutateCategory } from "../Category";
import { CategoryEditor } from "../components/CategoryEditor";

async function fetchCategory(uuid?: string, token?: string) {
  const response = await fetch(`/api/v1/categories/${uuid}`, {
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
  return data as Category;
}

async function updateCategory(
  input: MutateCategory,
  uuid?: string,
  token?: string
): Promise<Category> {
  const response = await fetch(`/api/v1/categories/${uuid}`, {
    headers: {
      Authorization: `Bearer ${token ?? ""}`,
      "Content-Type": "application/json",
    },
    method: "PUT",
    body: JSON.stringify(input),
  });

  if (response.status === 401) {
    throw new Error("Invalid session, please reload the window.");
  } else if (!response.ok) {
    const error = await response.json();
    if (error.message) throw new Error(error.message);
    throw new Error("Problem fetching data");
  }

  const data = await response.json();
  return data as Category;
}

export const EditCategory = () => {
  const { categoryId } = useParams();
  const auth = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ["categories", categoryId],
    queryFn: () => fetchCategory(categoryId ?? "", auth.user?.access_token),
  });
  const { mutate } = useMutation({
    mutationFn: (category: MutateCategory) => {
      return updateCategory(category, categoryId, auth.user?.access_token);
    },
    onSettled: () => queryClient.invalidateQueries({queryKey: ["categories"]}),
  });

  const onSubmit = (formData: MutateCategory) => {
    mutate(
      { ...formData },
      {
        onSuccess: (data) => {
          toast.success(
            `The category named '${data.title}' was successfully updated.`
          );
          navigate("/app/categories");
        },
        onError: (error) =>
          error instanceof Error && toast.error(error.message),
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
  } else if (!data) {
    return <h1>Not found</h1>;
  }
  return <CategoryEditor onSubmit={onSubmit} initialData={data} />;
};
