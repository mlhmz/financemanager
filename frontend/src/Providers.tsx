import { QueryCache, QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";
import { AuthProvider } from "react-oidc-context";
import oidcConfig from "./config/OidcConfig";
import { toast } from "sonner";

const queryClient = new QueryClient(
  {
    queryCache: new QueryCache({
      onError: (error) => error instanceof Error && toast.error(error.message) 
    })
  }
);

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
