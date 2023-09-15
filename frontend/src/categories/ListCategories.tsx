import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Category } from "./Category";
import { useAuth } from "react-oidc-context";

async function fetchCategories(token: string | undefined) {
  const response = await fetch("/api/v1/categories", {
    headers: {
      "Authorization": `Bearer ${token}` ?? "",
    }
  })

  if (!response.ok) throw new Error("Error fetching data");

  const data = await response.json();
  return data as Category[];
}

export const ListCategories = () => {
  const auth = useAuth();
  const { data, isLoading } = useQuery(["categories"], () => fetchCategories(auth.user?.access_token)); 
  const queryClient = useQueryClient();

  return (
    <div className="container m-auto flex flex-col gap-5">
      <h1 className="text-3xl">Categories</h1>
      <div className="self-end flex gap-3">
        <button className="btn btn-primary">Create</button>
        <button className="btn" onClick={() => queryClient.invalidateQueries(["categories"])}>{isLoading ? <span className="loading loading-spinner loading-sm"></span> : "Reload"}</button>
      </div>
      <div className="overflow-x-auto">
        <table className="table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Created At</th>
              <th>Updated At</th>
            </tr>
          </thead>
          <tbody>
            {
              data?.map(category => (
                <tr>
                  <td>{ category.title }</td>
                  <td>{ category.createdAt }</td>
                  <td>{ category.updatedAt }</td>
                </tr>
              ))
            }
          </tbody>
        </table>
      </div>
    </div>
  );
};
