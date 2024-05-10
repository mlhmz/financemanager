import { ChangeEvent, useState } from "react";
import { UseFormRegister, UseFormSetValue } from "react-hook-form";
import { useAuth } from "react-oidc-context";
import { TransactionCreateMutation } from "../../gql/graphql.ts";
import { Category } from "../Category";
import { useQueryCategories } from "../hooks/use-query-categories";

export const CategorySuggestion = ({
	register,
	setValue,
}: {
	register: UseFormRegister<TransactionCreateMutation>;
	setValue: UseFormSetValue<TransactionCreateMutation>;
}) => {
	const { user } = useAuth();
	const { data } = useQueryCategories({ token: user?.access_token });
	const [category, setCategory] = useState<Category>();
	const [searchText, setSearchText] = useState<string>("");

	const applyCategory = (category: Category) => {
		setCategory(category);
		setValue("categoryId", category.uuid ?? "");
		setSearchText(category.title ?? "");
	};

	const isSearchTextFilledAndCategoryEmpty = () => {
		return !!searchText && !category;
	};

	const handleSearchTextChange = (e: ChangeEvent<HTMLInputElement>) => {
		setSearchText(e.target.value);
		setCategory(undefined);
	};

	return (
		<div className="dropdown w-full">
			<input
				tabIndex={0}
				className="input input-bordered w-full"
				value={searchText}
				onChange={handleSearchTextChange}
			/>
			<input
				type="hidden"
				{...register("categoryId")}
				value={category?.uuid || ""}
			/>
			{isSearchTextFilledAndCategoryEmpty() && (
				<ul
					tabIndex={0}
					className="p-2 shadow menu dropdown-content z-[1] bg-base-100 rounded-box w-full"
				>
					{data
						?.filter((entry) =>
							entry.title?.toLowerCase().includes(searchText.toLowerCase()),
						)
						.slice(0, 5)
						.map((entry) => (
							<li key={entry.uuid} onClick={() => applyCategory(entry)}>
								<a>{entry.title}</a>
							</li>
						))}
				</ul>
			)}
		</div>
	);
};
