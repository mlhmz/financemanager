import {
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import React from "react";
import { AuthProvider } from "react-oidc-context";
import oidcConfig from "./config/OidcConfig";
import { toast } from "sonner";
import { ThemeContextProvider } from "./ThemeContext";

const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: (error) => error instanceof Error && toast.error(error.message),
  }),
});

export const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <ThemeContextProvider>
        <QueryClientProvider client={queryClient}>
          <AuthProvider {...oidcConfig}>
            <>{children}</>
          </AuthProvider>
        </QueryClientProvider>
      </ThemeContextProvider>
    </>
  );
};
