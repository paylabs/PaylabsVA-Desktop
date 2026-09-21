/**
 * @file disableContextMenu.ts
 * @description Utilitas untuk menonaktifkan context menu klik kanan bawaan browser pada desktop app.
 */

/**
 * Handler event contextmenu yang membatalkan menu bawaan webview.
 *
 * @param event - MouseEvent dari event contextmenu
 */
export function handleContextMenu(event: MouseEvent): void {
  event.preventDefault();
}

/**
 * Memasang pendengar event global untuk mematikan klik kanan di seluruh aplikasi desktop.
 *
 * @returns Fungsi cleanup untuk menghapus event listener jika diperlukan
 */
export function setupContextMenuGuard(): () => void {
  if (typeof window === 'undefined') {
    return () => {};
  }

  window.addEventListener('contextmenu', handleContextMenu);

  return () => {
    window.removeEventListener('contextmenu', handleContextMenu);
  };
}
