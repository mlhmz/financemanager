import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";
import { AuthProvider } from "react-oidc-context";
import oidcConfig from "./config/OidcConfig";

const queryClient = new QueryClient();

export const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <AuthProvider {...oidcConfig}>
          <>{children}</>
        </AuthProvider>
      </QueryClientProvider>
    </>
  );
};
