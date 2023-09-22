import { useContext } from "react";
import { ThemeContext } from "../ThemeContext";

export const ThemeSelect = () => {
  const { theme, setTheme } = useContext(ThemeContext);

  return (
    <div>
      <input
        title="Toggle theme"
        type="checkbox"
        className="toggle"
        checked={theme === "light"}
        onChange={() => setTheme(theme === "light" ? "dark" : "light")}
      />
    </div>
  );
};
