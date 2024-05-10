import { useQueryClient } from "@tanstack/react-query";
import {
	createColumnHelper,
	getCoreRowModel,
	useReactTable,
} from "@tanstack/react-table";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { Icons } from "../../components/Icons";
import { TanstackTable } from "../../components/TanstackTable";
import { Sheet } from "../../gql/graphql.ts";
import { useMutateDeleteSheet } from "../hooks/use-mutate-delete-sheet.tsx";
import { useQuerySheets } from "../hooks/use-query-sheets.tsx";

export const ListSheets = () => {
	dayjs.extend(relativeTime);
	const { data, isLoading } = useQuerySheets();
	const { mutateAsync: mutateDeleteAsync } = useMutateDeleteSheet();
	const [rowSelection, setRowSelection] = useState({});
	const helper = createColumnHelper<Sheet>();
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
			helper.accessor("createdAt", {
				header: () => "Created At",
				cell: (cell) => dayjs(cell.getValue()).fromNow(),
			}),
			helper.accessor("updatedAt", {
				header: () => "Updated At",
				cell: (cell) => dayjs(cell.getValue()).fromNow(),
			}),
			helper.display({
				id: "actions",
				header: () => "Actions",
				cell: ({ row }) => (
					<div className="tooltip" data-tip="View sheet">
						<Link to={`/app/sheets/${row.original.uuid}`} className="btn">
							<Icons.table />
						</Link>
					</div>
				),
			}),
		],
		[helper],
	);
	const table = useReactTable<Sheet>({
		columns: [
			helper.group({
				id: "sheets",
				columns: columns,
			}),
		],
		initialState: {
			columnVisibility: {
				uuid: false,
			},
		},
		data: (data?.findAllSheets as Sheet[]) ?? [],
		state: {
			rowSelection,
		},
		onRowSelectionChange: setRowSelection,
		getCoreRowModel: getCoreRowModel(),
		defaultColumn: {
			minSize: 0,
			size: Number.MAX_SAFE_INTEGER,
			maxSize: Number.MAX_SAFE_INTEGER,
		},
	});
	const queryClient = useQueryClient();

	const resetTable = () => {
		queryClient.invalidateQueries({ queryKey: ["sheets"] });
		setRowSelection({});
	};

	const isEditEnabled = () => {
		return table.getSelectedRowModel().rows.length === 1;
	};

	const deleteSelectedItems = () => {
		if (!table.getIsSomeRowsSelected) {
			toast.error("You need to select items in order to delete them.");
		}

		const promises = table
			.getSelectedRowModel()
			.rows.map(
				({ original }) => original.uuid && mutateDeleteAsync(original.uuid),
			);
		toast.promise(Promise.all(promises), {
			loading: `Deleting ${table.getSelectedRowModel().rows.length} sheets...`,
			success: (responses) => {
				resetTable();
				return `${responses.length} sheets were successfully deleted.`;
			},
			error: () => {
				resetTable();
				// TODO: Give user proper callback
				return "Deletion failed";
			},
		});
	};

	return (
		<div className="container m-auto flex flex-col gap-5">
			<h1 className="text-3xl">Sheets</h1>
			<div className="self-end flex gap-3">
				<Link to="/app/sheets/create" className="btn btn-primary">
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
						to={`/app/sheets/edit/${
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
			<TanstackTable<Sheet> table={table} />
		</div>
	);
};
