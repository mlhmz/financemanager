import { useAuth } from "react-oidc-context";

export const AuthButton = () => {
  const auth = useAuth();

  if (auth.isLoading) {
    return <a>Loading...</a>;
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
