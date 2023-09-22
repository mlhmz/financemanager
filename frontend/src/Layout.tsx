import { useAuth } from "react-oidc-context";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { Navbar } from "./components/Navbar";
import { useEffect } from "react";
import { toast } from "sonner";

export const Layout = () => {
  const location = useLocation();
  const { isAuthenticated, isLoading, error } = useAuth();

  useEffect(() => {
    error &&
      toast.error(`An error occured while logging in: ${error?.message}`);
  }, [error]);

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
