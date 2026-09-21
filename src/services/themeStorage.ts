/**
 * @file themeStorage.ts
 * @description Layanan persistensi data tema ke local storage browser/webview dengan fallback aman.
 */

import { ThemeMode } from '../types/theme';

export const THEME_STORAGE_KEY = 'antigravity_desktop_theme';

/**
 * Mendapatkan tema tersimpan dari storage, atau membaca preferensi sistem OS.
 *
 * @returns ThemeMode ('dark' atau 'light')
 */
export function getSavedTheme(): ThemeMode {
  if (typeof window === 'undefined' || !window.localStorage) {
    return 'dark';
  }

  try {
    const saved = window.localStorage.getItem(THEME_STORAGE_KEY);
    if (saved === 'dark' || saved === 'light') {
      return saved;
    }
  } catch (error) {
    console.warn('[themeStorage] Gagal membaca tema dari localStorage:', error);
  }

  return getSystemDefaultTheme();
}

/**
 * Menyimpan tema terpilih ke persistent storage.
 *
 * @param theme - Mode tema yang akan disimpan
 */
export function saveTheme(theme: ThemeMode): void {
  if (typeof window === 'undefined' || !window.localStorage) {
    return;
  }

  try {
    window.localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch (error) {
    console.error('[themeStorage] Gagal menyimpan tema ke localStorage:', error);
  }
}

/**
 * Mendeteksi preferensi tema bawaan sistem operasi.
 *
 * @returns ThemeMode
 */
export function getSystemDefaultTheme(): ThemeMode {
  if (typeof window === 'undefined' || !window.matchMedia) {
    return 'dark';
  }

  try {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    return prefersDark ? 'dark' : 'light';
  } catch {
    return 'dark';
  }
}
