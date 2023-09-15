import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { Providers } from "./Providers.tsx";
import "./index.css";
import router from "./Routes.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Providers>
      <RouterProvider router={router} />
      <ReactQueryDevtools initialIsOpen={false} />
    </Providers>
  </React.StrictMode>
);
