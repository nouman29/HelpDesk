import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { storage } from '@/utils/storage';
import type { ThemeMode } from '@/types';
import { ThemeContext, type ThemeContextValue } from './context';

const STORAGE_KEY = 'hd:theme';

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<ThemeMode>(() =>
    storage.get<ThemeMode>(STORAGE_KEY, 'dark'),
  );

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle('light', theme === 'light');
    root.classList.toggle('dark',  theme === 'dark');
    root.style.colorScheme = theme;
    storage.set(STORAGE_KEY, theme);
  }, [theme]);

  const value = useMemo<ThemeContextValue>(
    () => ({
      theme,
      toggle: () => setThemeState((t) => (t === 'dark' ? 'light' : 'dark')),
      setTheme: setThemeState,
    }),
    [theme],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}
