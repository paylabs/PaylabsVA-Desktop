/**
 * @file shortcutFormatter.ts
 * @description Utilitas untuk memformat kombinasi tombol pintas keyboard sesuai konvensi OS.
 */

import { DesktopPlatform } from '../types/platform';

/**
 * Mengganti token 'Mod' dengan simbol atau teks yang sesuai dengan platform.
 * macOS menggunakan simbol ⌘, sedangkan Windows/Linux menggunakan Ctrl.
 *
 * @param shortcut - Pola shortcut, contoh: 'Mod+K' atau 'Mod+Shift+P'
 * @param platform - Platform target ('macos', 'windows', dll)
 * @returns String representasi shortcut yang disesuaikan
 */
export function formatShortcut(shortcut: string, platform: DesktopPlatform): string {
  if (!shortcut || typeof shortcut !== 'string') {
    return '';
  }

  const isMac = platform === 'macos';
  const parts = shortcut.split('+');

  const formattedParts = parts.map((part) => {
    const trimmed = part.trim();
    if (trimmed.toLowerCase() === 'mod') {
      return isMac ? '⌘' : 'Ctrl';
    }
    if (trimmed.toLowerCase() === 'shift') {
      return isMac ? '⇧' : 'Shift';
    }
    if (trimmed.toLowerCase() === 'alt') {
      return isMac ? '⌥' : 'Alt';
    }
    return trimmed.toUpperCase();
  });

  return isMac ? formattedParts.join('') : formattedParts.join(' + ');
}
