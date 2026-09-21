/**
 * @file platform.ts
 * @description Definisi tipe data dan antarmuka untuk platform desktop dan status window.
 */

/**
 * Representasi platform desktop yang didukung oleh aplikasi.
 */
export type DesktopPlatform = 'macos' | 'ios' | 'windows' | 'linux' | 'web';

/**
 * Konfigurasi perilaku dan tampilan berdasarkan platform.
 */
export interface PlatformConfig {
  /** Nama tampilan ramah pengguna */
  readonly displayName: string;
  /** Posisi kontrol window pada titlebar */
  readonly controlsPosition: 'left' | 'right';
  /** Label tombol pengubah utama (⌘ untuk mac, Ctrl untuk win) */
  readonly modifierKeyLabel: string;
  /** Simbol tombol shortcut utama */
  readonly modifierKeySymbol: string;
  /** Gaya efek material yang diutamakan (vibrancy vs mica) */
  readonly visualEffect: 'vibrancy' | 'mica' | 'standard';
}

/**
 * Status saat ini dari window aplikasi.
 */
export interface WindowState {
  /** Apakah window dalam kondisi maksimal */
  isMaximized: boolean;
  /** Apakah window dalam kondisi minimal */
  isMinimized: boolean;
  /** Apakah window sedang aktif/fokus */
  isFocused: boolean;
}
