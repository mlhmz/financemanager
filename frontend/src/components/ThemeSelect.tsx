import { useEffect } from 'react';
import { useLocalStorage } from 'react-use';

export const ThemeSelect = () => {
  const [value, setValue] = useLocalStorage('theme', 'emerald');

  useEffect(() => {
    document.documentElement.dataset.theme = value;
  }, [value]);

  return (
    <div>
      <input
        title="Toggle theme"
        type="checkbox"
        className="toggle"
        checked={value === 'emerald'}
        onChange={() => setValue(value === 'emerald' ? 'forest' : 'emerald')}
      />
    </div>
  );
};
