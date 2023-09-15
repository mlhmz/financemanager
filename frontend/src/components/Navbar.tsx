import { ThemeSelect } from "./ThemeSelect";

export const Navbar = () => {
  return (
    <div className="navbar bg-base-200">
      <div className="flex-1">
        <a className="btn btn-ghost normal-case text-xl">Finance Manager</a>
      </div>
      <div className="flex-none">
        <ul className="menu menu-horizontal px-1">
          <li>
            <a>Link</a>
          </li>
          <li>
            <ThemeSelect />
          </li>
          <li>
            <details>
              <summary>Parent</summary>
              <ul className="p-2 bg-primary">
                <li>
                  <a>Link 1</a>
                </li>
                <li>
                  <a>Link 2</a>
                </li>
              </ul>
            </details>
          </li>
        </ul>
      </div>
    </div>
  );
};
