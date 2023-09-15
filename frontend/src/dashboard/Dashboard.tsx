import { useAuth } from "react-oidc-context";
import { Link } from "react-router-dom";

export const Dashboard = () => {
  const auth = useAuth();

  return (
    <div className="container m-auto">
      <h1 className="text-2xl">Hi, {auth.user?.profile.given_name}!</h1>
      <p>What do you want to do?</p>
      <div className="flex gap-3 my-5">
        <Link
          to="/app/categories"
          className="card w-96 bg-neutral hover:bg-neutral-focus text-neutral-content cursor-pointer"
        >
          <div className="card-body">
            <h2 className="card-title">Categories</h2>
            <p>Manage your categories</p>
          </div>
        </Link>
        <div className="card w-96 bg-neutral hover:bg-neutral-focus text-neutral-content cursor-pointer">
          <div className="card-body">
            <h2 className="card-title">Sheets</h2>
            <p>See and manage your sheets</p>
          </div>
        </div>
      </div>
    </div>
  );
};
