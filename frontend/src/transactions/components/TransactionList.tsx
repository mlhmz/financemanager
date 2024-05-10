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
import { CurrencyCell } from "../../components/CurrencyCell";
import { Icons } from "../../components/Icons";
import { TanstackTable } from "../../components/TanstackTable";
import { Sheet, Transaction } from "../../gql/graphql.ts";
import { useMutateDeleteTransaction } from "../hooks/use-mutate-delete-transaction";

interface TransactionListProps {
	isLoading: boolean;
	transactions?: Transaction[];
	sheet?: Sheet;
}

export const TransactionList = ({
	transactions,
	isLoading,
	sheet,
}: TransactionListProps) => {
	dayjs.extend(relativeTime);
	const { mutateAsync: mutateDeleteAsync } = useMutateDeleteTransaction();
	const [rowSelection, setRowSelection] = useState({});
	const helper = createColumnHelper<Transaction>();
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
			helper.accessor("amount", {
				header: () => "Amount",
				cell: (cell) => <CurrencyCell amount={cell.getValue() ?? 0} />,
			}),
			helper.accessor("timestamp", {
				header: () => "Timestamp",
				cell: (cell) => dayjs(cell.getValue()).toDate().toLocaleString("de"),
			}),
		],
		[helper],
	);
	const table = useReactTable<Transaction>({
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
		data: transactions ?? [],
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

	const isEditEnabled = () => {
		return table.getSelectedRowModel().rows.length === 1;
	};

	const resetTable = () => {
		queryClient
			.invalidateQueries({ queryKey: ["transactions"] })
			.then(() => setRowSelection({}));
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
			loading: `Deleting ${
				table.getSelectedRowModel().rows.length
			} transactions...`,
			success: (responses) => {
				resetTable();
				return `${responses.length} transactions were successfully deleted.`;
			},
			error: () => {
				resetTable();
				// TODO: Give user proper callback
				return "Deletion failed";
			},
		});
	};

	return (
		<>
			<div className="self-end flex gap-3">
				<Link
					to={`/app/transactions/create${sheet ? `/${sheet.uuid}` : ""}`}
					className="btn btn-primary"
				>
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
			<TanstackTable<Transaction> table={table} />
		</>
	);
};
