import { useAuth } from "react-oidc-context";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { Navbar } from "./components/Navbar";

export const Layout = () => {
  const location = useLocation();
  const { isAuthenticated, isLoading } = useAuth();

  if (isAuthenticated === undefined || isLoading) {
    return (
      <div className="flex flex-col justify-center items-center h-screen gap-3">
          <span className="loading loading-spinner loading-lg"></span>
          <p>Loading</p>
      </div>
    );
  }

  return isAuthenticated ? (
    <>
      <Navbar />
      <div className="pt-24 mx-2">
        <Outlet />
      </div>
    </>
  ) : (
    <Navigate to="/" replace state={{ from: location }} />
  );
};
