import { useAuth } from "react-oidc-context";

export const AuthButton = () => {
  const auth = useAuth();

  if (auth.isLoading) {
    return <a><span className="loading loading-spinner loading-xs"></span></a>;
  } else if (auth.isAuthenticated) {
    return (
      <a
        onClick={() => void auth.removeUser()}
      >
        Log out
      </a>
    );
  } else {
    return (
      <a
        onClick={() => void auth.signinRedirect()}
      >
        Log in
      </a>
    );
  }
};
