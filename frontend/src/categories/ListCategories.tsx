import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback, useState } from "react";
import { useAuth } from "react-oidc-context";
import { Link } from "react-router-dom";
import { Icons } from "../components/Icons";
import { Category } from "./Category";

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

export const ListCategories = () => {
  const auth = useAuth();
  const { data, isLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: () => fetchCategories(auth.user?.access_token),
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
  }, [checked, data])

  const handleAllCheckboxChange = () => {
    if (isAllCategoriesSelected()) {
      setChecked([])
    } else {
      data && setChecked(data);
    }
  }

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
