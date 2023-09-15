import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { Providers } from "./Providers.tsx";
import { RouterProvider } from "react-router-dom";
import router from "./router.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Providers>
      <App>
        <RouterProvider router={router} />
      </App>
    </Providers>
  </React.StrictMode>
);
