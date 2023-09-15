import { createBrowserRouter } from "react-router-dom";
import { Dashboard } from "./dashboard/Dashboard";
import { Hero } from "./Hero";
import { PageNotFound } from "./PageNotFound";
import { Layout } from "./Layout";
import { ListCategories } from "./categories/ListCategories";
import { CreateCategory } from "./categories/CreateCategory";

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
        {
          path: "/app/categories",
          element: <ListCategories />,
        },
        {
          path: "/app/categories/create",
          element: <CreateCategory />
        }
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
