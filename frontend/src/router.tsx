import { createBrowserRouter } from "react-router-dom";
import { Welcome } from "./views/Welcome";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Welcome />,
  },
  {
    path: "/app",
    element: "Test",
  },
]);

export default router;