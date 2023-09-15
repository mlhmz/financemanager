import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback, useState } from "react";
import { useAuth } from "react-oidc-context";
import { Link } from "react-router-dom";
import { Icons } from "../components/Icons";
import { Category } from "./Category";
import { toast } from "sonner";

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
) {
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
}

export const ListCategories = () => {
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
  const [checked, setChecked] = useState<Category[]>([]);

  const isCategoryContained = useCallback(
    (category: Category) => {
      return checked?.includes(category);
    },
    [checked]
  );

  const handleCheckboxChange = (category: Category) => {
    if (isCategoryContained(category)) {
      setChecked(checked.filter((entry) => entry !== category));
    } else {
      setChecked([...checked, category]);
    }
  };

  const isAllCategoriesSelected = useCallback(() => {
    return data?.length === checked.length;
  }, [checked, data]);

  const handleAllCheckboxChange = () => {
    if (isAllCategoriesSelected()) {
      setChecked([]);
    } else {
      data && setChecked(data);
    }
  };

  const resetAfterDelete = () => {
    queryClient.invalidateQueries(["categories"]);
    setChecked([]);
  };

  const isAnySelected = () => {
    return checked.length !== 0;
  };

  const deleteSelectedItems = () => {
    if (!isAnySelected()) {
      toast.error("You need to select items in order to delete them.");
    }

    const promises = checked.map((entry) => mutateDeleteAsync(entry.uuid));
    toast.promise(Promise.all(promises), {
      loading: `Deleting ${checked.length} categories...`,
      success: () => {
        resetAfterDelete();
        return `${checked.length} categories were successfully deleted.`;
      },
      error: (responses: Response[]) => {
        resetAfterDelete();
        const failedDeletions = responses.filter(
          (response) => !response.ok
        ).length;
        const allRequestedDeletions = responses.length;
        return `${failedDeletions} from ${allRequestedDeletions} categories couldn't be deleted, please try again.`;
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
          disabled={!isAnySelected()}
          onClick={() => deleteSelectedItems()}
        >
          <Icons.delete />
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="table">
          <thead>
            <tr>
              <th>
                <input
                  type="checkbox"
                  checked={isAllCategoriesSelected()}
                  onChange={handleAllCheckboxChange}
                  className="checkbox"
                />
              </th>
              <th></th>
              <th>Title</th>
              <th>Created At</th>
              <th>Updated At</th>
            </tr>
          </thead>
          <tbody>
            {data?.map((category, index) => (
              <tr key={category.uuid}>
                <td>
                  <input
                    type="checkbox"
                    checked={isCategoryContained(category)}
                    onChange={() => handleCheckboxChange(category)}
                    className="checkbox"
                  />
                </td>
                <td className="font-bold">{index}</td>
                <td>{category.title}</td>
                <td>{category.createdAt}</td>
                <td>{category.updatedAt}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
