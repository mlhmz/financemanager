import { createBrowserRouter } from "react-router-dom";
import { Dashboard } from "./dashboard/Dashboard";
import { Hero } from "./Hero";
import { PageNotFound } from "./PageNotFound";
import { Layout } from "./Layout";
import { CreateCategory } from "./categories/views/CreateCategory";
import { EditCategory } from "./categories/views/EditCategory";
import { ListCategories } from "./categories/views/ListCategories";
import { ListSheets } from "./sheets/views/ListSheets";
import { CreateSheet } from "./sheets/views/CreateSheet";

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
          element: <CreateCategory />,
        },
        {
          path: "/app/categories/edit/:categoryId",
          element: <EditCategory />,
        },
        {
          path: "/app/sheets",
          element: <ListSheets />,
        },
        {
          path: "/app/sheets/create",
          element: <CreateSheet />,
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
