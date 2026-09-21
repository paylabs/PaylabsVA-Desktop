/**
 * @file useTheme.ts
 * @description Hook React untuk pengelolaan tema gelap/terang dan sinkronisasi atribut DOM.
 */

import { useState, useEffect, useCallback } from 'react';
import { ThemeMode, ThemeContextValue } from '../types/theme';
import { getSavedTheme, saveTheme } from '../services/themeStorage';

/**
 * Hook untuk mengontrol tema dan persistensinya.
 *
 * @returns ThemeContextValue
 */
export function useTheme(): ThemeContextValue {
  const [theme, setCurrentTheme] = useState<ThemeMode>(getSavedTheme);

  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.setAttribute('data-theme', theme);
    }
    saveTheme(theme);
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setCurrentTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  }, []);

  const setTheme = useCallback((mode: ThemeMode) => {
    setCurrentTheme(mode);
  }, []);

  return {
    theme,
    isDark: theme === 'dark',
    toggleTheme,
    setTheme,
  };
}
