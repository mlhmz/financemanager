import { ReactNode, createContext, useEffect } from "react";
import { useLocalStorage } from "react-use";

interface ThemeContextContent {
  theme: string | undefined;
  setTheme: React.Dispatch<React.SetStateAction<string | undefined>>;
}

export const ThemeContext = createContext<ThemeContextContent>({
  theme: "",
  setTheme: () => {},
});

export const ThemeContextProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setTheme] = useLocalStorage("theme", "light");

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  return (
    <ThemeContext.Provider
      value={{
        theme: theme,
        setTheme: setTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};