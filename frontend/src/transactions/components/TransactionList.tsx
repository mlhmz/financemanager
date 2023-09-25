import {
  createColumnHelper,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Transaction } from "../Transaction";
import { useMemo, useState } from "react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { TanstackTable } from "../../components/TanstackTable";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { Icons } from "../../components/Icons";
import { Sheet } from "../../sheets/Sheet";
import { useQueryClient } from "@tanstack/react-query";
import { CurrencyCell } from "../../components/CurrencyCell";

interface TransactionListProps {
  isLoading: boolean,
  transactions?: Transaction[]
  sheet?: Sheet,
}

export const TransactionList = ({
  transactions,
  isLoading,
  sheet
}: TransactionListProps) => {
  dayjs.extend(relativeTime);
  const [rowSelection, setRowSelection] = useState({});
  const helper = createColumnHelper<Transaction>();
  const columns = useMemo(
    () => [
      {
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
      },
      helper.accessor("uuid", {
        header: () => "UUID",
      }),
      helper.accessor("title", {
        header: () => "Title",
      }),
      helper.accessor("amount", {
        header: () => "Amount",
        cell: (cell) => <CurrencyCell amount={cell.getValue()} />
      }),
      helper.accessor("timestamp", {
        header: () => "Timestamp",
        cell: (cell) => dayjs(cell.getValue()).toDate().toLocaleString("de")  
      })
    ],
    [helper]
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
    return table.getSelectedRowModel().rows.length == 1;
  };

  const resetTable = () => {
    queryClient.invalidateQueries(["sheet"]);
    setRowSelection({});
  };

  return (
    <div className="container m-auto flex flex-col gap-5">
    <h1 className="text-3xl">Transactions</h1>
    <h2 className="text-xl">{sheet?.title}</h2>
    <div className="self-end flex gap-3">
      <Link to={`/app/transactions/create${sheet ? "/" + sheet.uuid : ""}`} className="btn btn-primary">
        <Icons.plus />
      </Link>
      <button className="btn" onClick={() => resetTable()}>
        {isLoading ? (
          <span className="loading loading-spinner loading-sm"></span>
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
        onClick={() => {
          // TODO: Implement delete
          toast.error("Not implemented!");
        }}
      >
        <Icons.delete />
      </button>
    </div>
    <TanstackTable<Transaction> table={table} />
  </div>
  );
};
