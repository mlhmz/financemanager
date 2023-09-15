import { Link } from "react-router-dom";
import { AuthButton } from "./AuthButton";
import { ThemeSelect } from "./ThemeSelect";

export const Navbar = () => {
  return (
    <div className="navbar bg-base-200 z-10 bg-opacity-80 fixed backdrop-blur-sm">
      <div className="flex-1">
        <Link to="/" className="btn btn-ghost normal-case text-xl">Finance Manager</Link>
      </div>
      <div className="flex-none">
        <ul className="menu menu-horizontal px-1">
          <li>
            <AuthButton />
          </li>
          <li>
            <ThemeSelect />
          </li>
        </ul>
      </div>
    </div>
  );
};
