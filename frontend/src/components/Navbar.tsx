import { ThemeSelect } from "./ThemeSelect";

export const Navbar = () => {
  return (
    <div className="navbar bg-base-200 z-10 bg-opacity-80 fixed backdrop-blur-sm">
      <div className="flex-1">
        <a className="btn btn-ghost normal-case text-xl">Finance Manager</a>
      </div>
      <div className="flex-none">
        <ul className="menu menu-horizontal px-1">
          <li>
            <ThemeSelect />
          </li>
        </ul>
      </div>
    </div>
  );
};
