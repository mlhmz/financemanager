import { Dispatch } from "react";
import { CategorySuggestion } from "../../categories/components/CategorySuggestion";
import { Transaction } from "../../gql/graphql.ts";
import {
	TransactionCreateMutation,
	TransactionCreateMutationSchema,
} from "../../graphql.ts";
import { useZodForm } from "../../hooks/use-zod-form";

interface TransactionEditorProps {
	onSubmit: Dispatch<TransactionCreateMutation>;
	sheetId?: string;
	initialData?: Transaction;
}

export const TransactionEditor = ({
	onSubmit,
	sheetId,
	initialData,
}: TransactionEditorProps) => {
	const { register, handleSubmit, formState, setValue } = useZodForm({
		schema: TransactionCreateMutationSchema(),
		defaultValues: {
			title: initialData?.title ?? undefined,
			description: initialData?.description ?? undefined,
			amount: initialData?.amount ?? undefined,
			sheetId: sheetId,
		},
	});

	console.log(formState);

	return (
		<div className="container m-auto flex flex-col gap-5 items-center">
			<h1 className="text-3xl">Create a Transaction</h1>
			<form
				className="flex flex-col gap-5 w-full md:w-1/2 xl:w-1/3"
				onSubmit={handleSubmit(onSubmit)}
			>
				<div className="flex flex-col gap-1 w-full">
					<label htmlFor="title-input">Title</label>
					<input
						id="title-input"
						className="input input-bordered w-full"
						placeholder="Title of the transaction"
						{...register("title")}
					></input>
					<p className="text-red-600">{formState.errors.title?.message}</p>
				</div>
				<div className="flex flex-col gap-1 w-full">
					<label htmlFor="description-input">Description</label>
					<textarea
						id="description-input"
						className="textarea textarea-bordered w-full"
						placeholder="Description of the transaction"
						{...register("description")}
					></textarea>
					<p className="text-red-600">
						{formState.errors.description?.message}
					</p>
				</div>
				<div className="flex flex-col gap-1 w-full">
					<label htmlFor="amount-input">Amount</label>
					<label className="input input-bordered flex items-center w-full">
						<input
							id="amount-input"
							className="flex-grow"
							placeholder="Amount of the transaction"
							{...register("amount", {
								valueAsNumber: true,
							})}
						/>
						<span>€</span>
					</label>
					<p className="text-red-600">{formState.errors.amount?.message}</p>
				</div>
				<div className="flex flex-col gap-1 w-full">
					<label htmlFor="category-select">Category</label>
					<CategorySuggestion register={register} setValue={setValue} />
					<p className="text-red-600">{formState.errors.categoryId?.message}</p>
				</div>
				<div className="flex flex-col gap-1 w-full">
					<label htmlFor="amount-input">Timestamp</label>
					<input
						id="timestamp-input"
						type="datetime-local"
						className="input input-bordered w-full"
						placeholder="Amount of the timestamp"
						{...register("timestamp", {
							valueAsDate: true,
						})}
					></input>
					<p className="text-red-600">{formState.errors.timestamp?.message}</p>
				</div>
				<div className="flex flex-col align-items-center m-auto">
					<input type="submit" value="Save" className="btn btn-primary" />
				</div>
			</form>
		</div>
	);
};
