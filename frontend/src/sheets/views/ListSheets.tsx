import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createColumnHelper,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useMemo, useState } from "react";
import { useAuth } from "react-oidc-context";
import { Link } from "react-router-dom";
import { Icons } from "../../components/Icons";
import { TanstackTable } from "../../components/TanstackTable";
import { Sheet } from "../Sheet";
import { toast } from "sonner";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

async function fetchSheets(token: string | undefined) {
  const response = await fetch("/api/v1/sheets", {
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
  return data as Sheet[];
}

export const ListSheets = () => {
  dayjs.extend(relativeTime);
  const auth = useAuth();
  const { data, isLoading } = useQuery({
    queryKey: ["sheets"],
    queryFn: () => fetchSheets(auth.user?.access_token),
  });
  const [rowSelection, setRowSelection] = useState({});
  const helper = createColumnHelper<Sheet>();
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
      helper.accessor("createdAt", {
        header: () => "Created At",
        cell: (cell) => dayjs(cell.getValue()).fromNow(),
      }),
      helper.accessor("updatedAt", {
        header: () => "Updated At",
        cell: (cell) => dayjs(cell.getValue()).fromNow(),
      }),
{
        id: "actions",
        header: () => "Actions",
        cell: ({ row }) => (
          <div className="tooltip" data-tip="View sheet">
            <Link to={`/app/sheets/${row.original.uuid}`} className="btn">
              <Icons.table />
            </Link>
          </div>
        ),
      },
    ],
    [helper]
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
    data: data ?? [],
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
    queryClient.invalidateQueries(["sheets"]);
    setRowSelection({});
  };

  const isEditEnabled = () => {
    return table.getSelectedRowModel().rows.length == 1;
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
      <TanstackTable<Sheet> table={table} />
    </div>
  );
};
