/**
 * @file windowService.ts
 * @description Layanan komunikasi IPC untuk kontrol window, dragging, dan deteksi platform native Tauri.
 */

import { DesktopPlatform } from '../types/platform';

/**
 * Memeriksa apakah aplikasi berjalan di dalam runtime Tauri.
 *
 * @returns boolean true jika di dalam Tauri window
 */
export function isTauriEnvironment(): boolean {
  return typeof window !== 'undefined' && '__TAURI_INTERNALS__' in window;
}

/**
 * Mendapatkan identifikasi platform dari backend Rust atau fallback browser.
 *
 * @returns Promise<DesktopPlatform>
 */
export async function detectPlatform(): Promise<DesktopPlatform> {
  if (!isTauriEnvironment()) {
    return detectBrowserPlatform();
  }

  try {
    const { invoke } = await import('@tauri-apps/api/core');
    const platform = await invoke<string>('get_platform');
    if (platform === 'macos' || platform === 'windows' || platform === 'linux') {
      return platform;
    }
    return 'windows';
  } catch (error) {
    console.warn('[windowService] Gagal memanggil get_platform dari Rust, fallback ke browser:', error);
    return detectBrowserPlatform();
  }
}

/**
 * Fallback deteksi platform melalui userAgent browser.
 *
 * @returns DesktopPlatform
 */
export function detectBrowserPlatform(): DesktopPlatform {
  if (typeof navigator === 'undefined') {
    return 'windows';
  }
  const userAgent = navigator.userAgent.toLowerCase();
  if (userAgent.includes('mac')) {
    return 'macos';
  }
  if (userAgent.includes('win')) {
    return 'windows';
  }
  if (userAgent.includes('linux')) {
    return 'linux';
  }
  return 'web';
}

/**
 * Memulai pergeseran window (drag) saat mouse ditekan pada titlebar.
 */
export async function startDragAppWindow(): Promise<void> {
  if (!isTauriEnvironment()) {
    return;
  }
  try {
    const { invoke } = await import('@tauri-apps/api/core');
    await invoke('start_dragging_window');
  } catch (error) {
    console.error('[windowService] Gagal memulai drag window:', error);
  }
}

/**
 * Meminimalkan window aplikasi.
 */
export async function minimizeAppWindow(): Promise<void> {
  if (!isTauriEnvironment()) {
    console.info('[windowService] Mock minimizeWindow (di luar Tauri)');
    return;
  }
  try {
    const { invoke } = await import('@tauri-apps/api/core');
    await invoke('minimize_window');
  } catch (error) {
    console.error('[windowService] Gagal meminimalkan window:', error);
  }
}

/**
 * Memaksimalkan atau mengembalikan ukuran window aplikasi.
 *
 * @returns Promise<boolean> status baru apakah maximized
 */
export async function toggleMaximizeAppWindow(): Promise<boolean> {
  if (!isTauriEnvironment()) {
    console.info('[windowService] Mock toggleMaximizeWindow (di luar Tauri)');
    return false;
  }
  try {
    const { invoke } = await import('@tauri-apps/api/core');
    return await invoke<boolean>('toggle_maximize_window');
  } catch (error) {
    console.error('[windowService] Gagal toggle maximize window:', error);
    return false;
  }
}

/**
 * Menutup window aplikasi.
 */
export async function closeAppWindow(): Promise<void> {
  if (!isTauriEnvironment()) {
    console.info('[windowService] Mock closeWindow (di luar Tauri)');
    return;
  }
  try {
    const { invoke } = await import('@tauri-apps/api/core');
    await invoke('close_window');
  } catch (error) {
    console.error('[windowService] Gagal menutup window:', error);
  }
}

/**
 * Dimensi logical ukuran window dalam piksel.
 */
export interface WindowDimensions {
  width: number;
  height: number;
}

/**
 * Mengambil ukuran window aplikasi saat ini dalam logical pixel.
 *
 * @returns Promise<WindowDimensions | null> Dimensi logical atau fallback browser
 */
export async function getAppWindowSize(): Promise<WindowDimensions | null> {
  if (!isTauriEnvironment()) {
    return typeof window !== 'undefined'
      ? { width: window.innerWidth, height: window.innerHeight }
      : null;
  }
  try {
    const { invoke } = await import('@tauri-apps/api/core');
    return await invoke<WindowDimensions>('get_window_size');
  } catch (error) {
    console.error('[windowService] Gagal mengambil ukuran window:', error);
    return null;
  }
}

/**
 * Mengubah ukuran window aplikasi ke dimensi logical dan memusatkannya jika diminta.
 *
 * @param width Lebar target dalam logical pixel
 * @param height Tinggi target dalam logical pixel
 * @param center Menentukan apakah window dipusatkan di layar (default: true)
 */
export async function resizeAppWindow(
  width: number,
  height: number,
  center = true
): Promise<void> {
  if (!isTauriEnvironment()) {
    console.info(`[windowService] Mock resizeWindow (${width}x${height}, center=${center})`);
    return;
  }
  try {
    const { invoke } = await import('@tauri-apps/api/core');
    await invoke('resize_window', { width, height, center });
  } catch (error) {
    console.error('[windowService] Gagal mengubah ukuran window:', error);
  }
}

/**
 * Memeriksa apakah window sedang dalam kondisi maximized.
 */
export async function isWindowMaximizedState(): Promise<boolean> {
  if (!isTauriEnvironment()) {
    return false;
  }
  try {
    const { invoke } = await import('@tauri-apps/api/core');
    return await invoke<boolean>('is_window_maximized');
  } catch (error) {
    console.error('[windowService] Gagal memeriksa status maximize window:', error);
    return false;
  }
}
