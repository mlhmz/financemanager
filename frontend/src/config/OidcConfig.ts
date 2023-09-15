import { AuthProviderProps } from "react-oidc-context";

const oidcConfig: AuthProviderProps = {
  authority: "http://localhost:8081/realms/fm",
  client_id: "fm-client",
  redirect_uri: "http://localhost:5173",
};

export default oidcConfig