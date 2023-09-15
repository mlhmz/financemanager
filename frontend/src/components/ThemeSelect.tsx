import { useEffect } from "react";
import { themeChange } from "theme-change";

export const ThemeSelect = () => {
  useEffect(() => {
    themeChange(false);
  }, []);

  return (
    <div>
      <button className="toggle" data-toggle-theme="emerald,forest" data-act-class="ACTIVECLASS" />
    </div>
  );
};
