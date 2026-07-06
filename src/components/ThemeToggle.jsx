import React from 'react';
import { useTheme } from '../context/ThemeContext.jsx';
import Icon from './Icon.jsx';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <button
      type="button"
      className="theme-toggle"
      onClick={toggleTheme}
      aria-label={isDark ? 'Açık temaya geç' : 'Koyu temaya geç'}
      title={isDark ? 'Açık temaya geç' : 'Koyu temaya geç'}
    >
      <Icon name={isDark ? 'sun' : 'moon'} size={18} />
    </button>
  );
}
