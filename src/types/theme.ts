/**
 * @file theme.ts
 * @description Definisi tipe dan antarmuka untuk pengelolaan tema aplikasi (Dark/Light).
 */

/**
 * Pilihan mode tema yang didukung oleh aplikasi.
 */
export type ThemeMode = 'dark' | 'light';

/**
 * Antarmuka konteks / nilai yang disediakan oleh hook tema.
 */
export interface ThemeContextValue {
  /** Mode tema saat ini */
  readonly theme: ThemeMode;
  /** Apakah saat ini menggunakan tema gelap */
  readonly isDark: boolean;
  /** Beralih antara tema gelap dan terang */
  readonly toggleTheme: () => void;
  /** Menetapkan tema tertentu secara eksplisit */
  readonly setTheme: (mode: ThemeMode) => void;
}
