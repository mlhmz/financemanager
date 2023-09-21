import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createColumnHelper,
  getCoreRowModel,
  useReactTable
} from "@tanstack/react-table";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { useMemo, useState } from "react";
import { useAuth } from "react-oidc-context";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { Icons } from "../components/Icons";
import { Category } from "./Category";
import { CategoryTanstackTable } from "./components/CategoryTanstackTable";

async function fetchCategories(token: string | undefined) {
  const response = await fetch("/api/v1/categories", {
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
  return data as Category[];
}

async function deleteCategory(
  uuid?: string,
  token?: string
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
  } else if (!response.ok) {
    const error = await response.json();
    if (error.message) throw new Error(error.message);
    throw new Error("Problem fetching data");
  }

  return response;
}

export const ListCategories = () => {
  dayjs.extend(relativeTime);
  const auth = useAuth();
  const { data, isLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: () => fetchCategories(auth.user?.access_token),
  });
  const { mutateAsync: mutateDeleteAsync } = useMutation({
    mutationFn: (uuid?: string) =>
      deleteCategory(uuid, auth.user?.access_token),
  });
  const queryClient = useQueryClient();
  const [rowSelection, setRowSelection] = useState({});
  const helper = createColumnHelper<Category>();
  const columns = useMemo(
    () => [
      {
        id: "select",
        header: ({ table }) => (
          <input
            type="checkbox"
            className="checkbox"
            {...{
              checked: table.getIsAllRowsSelected(),
              indeterminate: table.getIsSomeRowsSelected(),
              onChange: table.getToggleAllRowsSelectedHandler(),
            }}
          />
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
    [helper]
  );
  const table = useReactTable<Category>({
    columns: [
      helper.group({
        id: "categories",
        columns: columns,
      }),
    ],
    data: data ?? [],
    state: {
      rowSelection,
    },
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
  });

  const resetAfterDelete = () => {
    queryClient.invalidateQueries(["categories"]);
    setRowSelection({});
  };

  const deleteSelectedItems = () => {
    if (!table.getIsSomeRowsSelected) {
      toast.error("You need to select items in order to delete them.");
    }

    const promises = table
      .getSelectedRowModel()
      .rows.map((entry) => mutateDeleteAsync(entry.original.uuid));
    toast.promise(Promise.all(promises), {
      loading: `Deleting ${
        table.getSelectedRowModel().rows.length
      } categories...`,
      success: (responses) => {
        resetAfterDelete();
        return `${responses.length} categories were successfully deleted.`;
      },
      error: () => {
        resetAfterDelete();
        // TODO: Give user proper callback
        return "Deletion failed";
      },
    });
  };

  return (
    <div className="container m-auto flex flex-col gap-5">
      <h1 className="text-3xl">Categories</h1>
      <div className="self-end flex gap-3">
        <Link to="/app/categories/create" className="btn btn-primary">
          <Icons.plus />
        </Link>
        <button
          className="btn"
          onClick={() => queryClient.invalidateQueries(["categories"])}
        >
          {isLoading ? (
            <span className="loading loading-spinner loading-sm"></span>
          ) : (
            <Icons.refresh />
          )}
        </button>
        <button
          className="btn"
          disabled={!table.getIsSomeRowsSelected() && !table.getIsAllRowsSelected()}
          onClick={() => deleteSelectedItems()}
        >
          <Icons.delete />
        </button>
      </div>
      <CategoryTanstackTable table={table} />
    </div>
  );
};
