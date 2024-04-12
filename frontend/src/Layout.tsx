import { useAuth } from "react-oidc-context";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { toast } from "sonner";
import { Navbar } from "./components/Navbar";

export const Layout = () => {
	const location = useLocation();
	const { isAuthenticated, isLoading, error } = useAuth();

	error && toast.error(`An error occured while logging in: ${error?.message}`);

	if (isAuthenticated === undefined || isLoading) {
		return (
			<div className="flex flex-col justify-center items-center h-screen gap-3">
				<span className="loading loading-spinner loading-lg"></span>
				<p>Loading</p>
			</div>
		);
	}
	return isAuthenticated ? (
		<div className="h-screen flex flex-col">
			<Navbar />
			<div className="overflow-y-auto flex-grow p-5">
				<Outlet />
			</div>
		</div>
	) : (
		<Navigate to="/" replace state={{ from: location }} />
	);
};
