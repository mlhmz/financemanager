import { useAuth } from "react-oidc-context";
import { Navigate, useLocation } from "react-router-dom";
import { toast } from "sonner";

export const Hero = () => {
  const location = useLocation();
  const { signinRedirect, isAuthenticated, error } = useAuth();

  error && toast.error(`An error occured while authorizing: ${error?.message}`);

  if (isAuthenticated) {
    return <Navigate to="/app" replace state={{ from: location }} />;
  }
  return (
    <div className="container m-auto flex flex-col gap-5">
      <div className="hero min-h-screen">
        <div className="hero-content text-center">
          <div className="max-w-md">
            <h1 className="text-5xl font-bold">Finance Manager</h1>
            <p className="py-6">
              Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam
              nonumy eirmod tempor invidunt ut lore et dolore magna aliquyam
              erat, sed diam voluptua.
            </p>
            <div className="flex gap-3 items-center justify-center">
              <a
                onClick={() => void signinRedirect()}
                className="btn btn-primary"
              >
                Login
              </a>
              <a href="https://github.com/mlhmz/financemanager" className="btn">
                GitHub
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
