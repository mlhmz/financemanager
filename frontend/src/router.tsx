import { createBrowserRouter } from "react-router-dom";
import { Welcome } from "./greet/Greet";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Welcome />,
  }
]);

export default router;