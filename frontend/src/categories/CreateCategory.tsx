import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useZodForm } from "../hooks/use-zod-form";
import { Category, MutateCategory } from "./Category";
import { useAuth } from "react-oidc-context";
import { useNavigate } from "react-router-dom";

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
  } else if (!response.ok) {
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
  const { mutate } = useMutation({
    mutationFn: (data: MutateCategory) => {
      return createCategory(data, auth.user?.access_token);
    },
    onSettled: () => queryClient.invalidateQueries(["categories"]),
  });
  const { register, handleSubmit } = useZodForm({
    schema: MutateCategory,
  });

  const onSubmit = (formData: MutateCategory) =>
    mutate(
      { ...formData },
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

  return (
    <div className="container m-auto flex flex-col gap-5 items-center">
      <h1 className="text-3xl">Create a Category</h1>
      <form className="flex flex-col gap-5 w-full md:w-1/2 xl:w-1/3" onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-col gap-1 w-full">
          <label htmlFor="title-input">Title</label>
          <input
            id="title-input"
            className="input input-bordered w-full"
            placeholder="Title of the category"
            {...register("title")}
          ></input>
        </div>
        <div className="flex flex-col gap-1 w-full">
          <label htmlFor="description-input">Description</label>
          <textarea
            id="description-input"
            className="textarea textarea-bordered w-full h-40 resize-none"
            placeholder="Description of the category"
            {...register("description")}
          ></textarea>
        </div>
        <div className="flex flex-col align-items-center m-auto">
          <input type="submit" value="Create" className="btn btn-primary" />
        </div>
      </form>
    </div>
  );
};
