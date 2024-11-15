import {useMutation, useQueryClient} from "@tanstack/react-query";
import {createColumnHelper, getCoreRowModel, useReactTable,} from "@tanstack/react-table";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import {useMemo, useState} from "react";
import {useAuth} from "react-oidc-context";
import {Link} from "react-router-dom";
import {toast} from "sonner";
import {Icons} from "../../components/Icons";
import {TanstackTable} from "../../components/TanstackTable";
import {useQueryCategories} from "../hooks/use-query-categories.tsx";
import {Category} from "../../gql/graphql.ts";

async function deleteCategory(
	uuid?: string,
	token?: string,
): Promise<Response> {
	const response = await fetch(`/api/v1/categories/${uuid}`, {
		headers: {
			Authorization: `Bearer ${token ?? ""}`,
			"Content-Type": "application/json",
		},
		method: "DELETE",
	});

	if (response.status === 401) {
		throw new Error("Invalid session, please reload the window.");
	}
	if (!response.ok) {
		const error = await response.json();
		if (error.message) throw new Error(error.message);
		throw new Error("Problem fetching data");
	}

	return response;
}

export const ListCategories = () => {
	dayjs.extend(relativeTime);
	const auth = useAuth();
	const { data, isLoading } = useQueryCategories();
	const { mutateAsync: mutateDeleteAsync } = useMutation({
		mutationFn: (uuid?: string) =>
			deleteCategory(uuid, auth.user?.access_token),
	});
	const queryClient = useQueryClient();
	const [rowSelection, setRowSelection] = useState({});
	const helper = createColumnHelper<Category>();
	const columns = useMemo(
		() => [
			helper.display({
				id: "select",
				header: ({ table }) => (
					<div className="px-1">
						<input
							type="checkbox"
							className="checkbox"
							{...{
								checked: table.getIsAllRowsSelected(),
								indeterminate: table.getIsSomeRowsSelected(),
								onChange: table.getToggleAllRowsSelectedHandler(),
							}}
						/>
					</div>
				),
				cell: ({ row }) => (
					<div className="px-1">
						<input
							type="checkbox"
							className="checkbox"
							{...{
								checked: row.getIsSelected(),
								disabled: !row.getCanSelect(),
								indeterminate: row.getIsSomeSelected(),
								onChange: row.getToggleSelectedHandler(),
							}}
						/>
					</div>
				),
			}),
			helper.accessor("uuid", {
				header: () => "UUID",
			}),
			helper.accessor("title", {
				header: () => "Title",
			}),
			helper.accessor("description", {
				header: () => "Description",
			}),
			helper.accessor("createdAt", {
				header: () => "Created At",
				cell: (cell) => dayjs(cell.getValue()).fromNow(),
			}),
			helper.accessor("updatedAt", {
				header: () => "Updated At",
				cell: (cell) => dayjs(cell.getValue()).fromNow(),
			}),
		],
		[helper],
	);
	const table = useReactTable<Category>({
		columns: [
			helper.group({
				id: "categories",
				columns: columns,
			}),
		],
		initialState: {
			columnVisibility: {
				uuid: false,
			},
		},
		data: data?.findAllCategories as Category[] ?? [],
		state: {
			rowSelection,
		},
		onRowSelectionChange: setRowSelection,
		getCoreRowModel: getCoreRowModel(),
	});

	const resetTable = () => {
		queryClient.invalidateQueries({ queryKey: ["categories"] });
		setRowSelection({});
	};

	const deleteSelectedItems = () => {
		if (!table.getIsSomeRowsSelected) {
			toast.error("You need to select items in order to delete them.");
		}

		const promises = table
			.getSelectedRowModel()
			.rows.map(({original}) => original.uuid && mutateDeleteAsync(original.uuid));
		toast.promise(Promise.all(promises), {
			loading: `Deleting ${
				table.getSelectedRowModel().rows.length
			} categories...`,
			success: (responses) => {
				resetTable();
				return `${responses.length} categories were successfully deleted.`;
			},
			error: () => {
				resetTable();
				// TODO: Give user proper callback
				return "Deletion failed";
			},
		});
	};

	const isEditEnabled = () => {
		return table.getSelectedRowModel().rows.length === 1;
	};

	return (
		<div className="container m-auto flex flex-col gap-5">
			<h1 className="text-3xl">Categories</h1>
			<div className="self-end flex gap-3">
				<Link to="/app/categories/create" className="btn btn-primary">
					<Icons.plus />
				</Link>
				<button className="btn" onClick={() => resetTable()}>
					{isLoading ? (
						<span className="loading loading-spinner loading-sm" />
					) : (
						<Icons.refresh />
					)}
				</button>
				<button className="btn" disabled={!isEditEnabled()}>
					<Link
						to={`/app/categories/edit/${
							table.getSelectedRowModel().rows[0]?.original.uuid
						}`}
					>
						<Icons.edit className={`${isEditEnabled() && "animate-pulse"}`} />
					</Link>
				</button>
				<button
					className="btn"
					disabled={
						!table.getIsSomeRowsSelected() && !table.getIsAllRowsSelected()
					}
					onClick={() => deleteSelectedItems()}
				>
					<Icons.delete />
				</button>
			</div>
			<TanstackTable<Category> table={table} />
		</div>
	);
};
