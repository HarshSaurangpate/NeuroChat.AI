import { useState, useEffect } from 'react';
import { Sun, Moon } from 'lucide-react';

/**
 * Toggles dark/light mode by adding/removing the 'dark' class on <html>.
 * Persists preference in localStorage.
 */
export default function ThemeToggle() {
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem('nc_theme');
    if (saved) return saved === 'dark';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add('dark');
      localStorage.setItem('nc_theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('nc_theme', 'light');
    }
  }, [isDark]);

  return (
    <button
      onClick={() => setIsDark((d) => !d)}
      title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      className="p-2 rounded-lg text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200
                 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200"
    >
      {isDark ? <Sun size={18} /> : <Moon size={18} />}
    </button>
  );
}
