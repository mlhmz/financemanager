import { Dispatch } from "react";
import { useZodForm } from "../../hooks/use-zod-form";
import { MutateSheet, Sheet } from "../Sheet";

interface SheetEditorProps {
  onSubmit: Dispatch<MutateSheet>;
  initialData?: Sheet;
}

export const SheetEditor = ({ onSubmit, initialData }: SheetEditorProps) => {
  const { register, handleSubmit } = useZodForm({
    schema: MutateSheet,
    defaultValues: {
      title: initialData?.title,
    },
  });

  return (
    <div className="container m-auto flex flex-col gap-5 items-center">
      <h1 className="text-3xl">Create a Sheet</h1>
      <form
        className="flex flex-col gap-5 w-full md:w-1/2 xl:w-1/3"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="flex flex-col gap-1 w-full">
          <label htmlFor="title-input">Title</label>
          <input
            id="title-input"
            className="input input-bordered w-full"
            placeholder="Title of the sheet"
            {...register("title")}
          ></input>
        </div>
        <div className="flex flex-col align-items-center m-auto">
          <input type="submit" value="Save" className="btn btn-primary" />
        </div>
      </form>
    </div>
  );
};
