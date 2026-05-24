import { createContext } from 'react';
import type { ThemeMode } from '@/types';

export interface ThemeContextValue {
  theme: ThemeMode;
  toggle: () => void;
  setTheme: (m: ThemeMode) => void;
}

export const ThemeContext = createContext<ThemeContextValue | null>(null);
