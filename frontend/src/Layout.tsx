import { useAuth } from "react-oidc-context";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { Navbar } from "./components/Navbar";

export const Layout = () => {
  const location = useLocation();
  const { isAuthenticated } = useAuth();

  if (isAuthenticated === undefined) {
    return <></>;
  }

  return isAuthenticated ? (
    <>
      <Navbar />
      <div className="pt-24">
        <Outlet />
      </div>
    </>
  ) : (
    <Navigate to="/" replace state={{ from: location }} />
  );
};
