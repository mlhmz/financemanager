import { Dispatch } from "react";
import { useZodForm } from "../../hooks/use-zod-form";
import { MutateCategory, Category } from "../Category";

export const CategoryEditor = ({
  onSubmit,
  initialData
}: {
  onSubmit: Dispatch<MutateCategory>;
  initialData?: Category;
}) => {
  const { register, handleSubmit } = useZodForm({
    schema: MutateCategory,
    defaultValues: {
      title: initialData?.title,
      description: initialData?.description
    }
  });

  return (
    <div className="container m-auto flex flex-col gap-5 items-center">
      <h1 className="text-3xl">Create a Category</h1>
      <form
        className="flex flex-col gap-5 w-full md:w-1/2 xl:w-1/3"
        onSubmit={handleSubmit(onSubmit)}
      >
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
          <input type="submit" value="Save" className="btn btn-primary" />
        </div>
      </form>
    </div>
  );
};
