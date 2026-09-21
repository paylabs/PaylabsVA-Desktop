/**
 * @file useWindowState.ts
 * @description React hook untuk mengelola dan memantau status window (maximize, minimize, close).
 */

import { useState, useCallback } from 'react';
import {
  closeAppWindow,
  minimizeAppWindow,
  toggleMaximizeAppWindow,
} from '../services/windowService';

/**
 * Hook untuk mengontrol dan membaca status ukuran window.
 */
export function useWindowState() {
  const [isMaximized, setIsMaximized] = useState<boolean>(false);

  const handleMinimize = useCallback(async () => {
    await minimizeAppWindow();
  }, []);

  const handleToggleMaximize = useCallback(async () => {
    const nextState = await toggleMaximizeAppWindow();
    setIsMaximized(nextState);
  }, []);

  const handleClose = useCallback(async () => {
    await closeAppWindow();
  }, []);

  return {
    isMaximized,
    handleMinimize,
    handleToggleMaximize,
    handleClose,
  };
}
