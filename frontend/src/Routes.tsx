import { createBrowserRouter } from "react-router-dom";
import { Dashboard } from "./dashboard/Dashboard";
import { Hero } from "./Hero";
import { PageNotFound } from "./PageNotFound";
import { Layout } from "./Layout";

const router = createBrowserRouter(
  [
    {
      path: "/app",
      element: <Layout />,
      children: [
        {
          path: "",
          element: <Dashboard />,
        },
      ],
    },
    {
      path: "/",
      element: <Hero />,
    },
    {
      path: "*",
      element: <PageNotFound />,
    },
  ],
  {}
);

export default router;
