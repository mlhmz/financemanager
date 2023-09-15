import { useEffect } from 'react';
import { useLocalStorage } from 'react-use';

export const ThemeSelect = () => {
  const [value, setValue] = useLocalStorage('theme', 'light');

  useEffect(() => {
    document.documentElement.dataset.theme = value;
  }, [value]);

  return (
    <div>
      <input
        title="Toggle theme"
        type="checkbox"
        className="toggle"
        checked={value === 'light'}
        onChange={() => setValue(value === 'light' ? 'dark' : 'light')}
      />
    </div>
  );
};
