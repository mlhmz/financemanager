import { useAuth } from "react-oidc-context";

export const Dashboard = () => {
  const auth = useAuth();

  return (
    <div className="container m-auto">
      <h1 className="text-2xl">Hi, {auth.user?.profile.given_name}!</h1>
      <p>What do you want to do?</p>

      <div className="flex justify-between my-5">
        <div className="card w-96 bg-primary text-primary-content">
          <div className="card-body">
            <h2 className="card-title">Categories</h2>
            <p>Manage your categories</p>
          </div>
        </div>
        <div className="card w-96 bg-primary text-primary-content">
          <div className="card-body">
            <h2 className="card-title">Sheets</h2>
            <p>See and manage your sheets</p>
          </div>
        </div>
      </div>
    </div>
  );
};
