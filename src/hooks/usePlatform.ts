/**
 * @file usePlatform.ts
 * @description React hook untuk mendeteksi platform saat ini dan mendukung mode preview switch.
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { DesktopPlatform, PlatformConfig } from '../types/platform';
import {
  detectPlatform,
  resizeAppWindow,
  getAppWindowSize,
  WindowDimensions,
} from '../services/windowService';

export const PLATFORM_CONFIGS: Record<DesktopPlatform, PlatformConfig> = {
  macos: {
    displayName: 'macOS (Apple)',
    controlsPosition: 'left',
    modifierKeyLabel: 'Command',
    modifierKeySymbol: '⌘',
    visualEffect: 'vibrancy',
  },
  ios: {
    displayName: 'iOS / iPadOS (HIG)',
    controlsPosition: 'left',
    modifierKeyLabel: 'Command',
    modifierKeySymbol: '⌘',
    visualEffect: 'vibrancy',
  },
  windows: {
    displayName: 'Windows (Fluent)',
    controlsPosition: 'right',
    modifierKeyLabel: 'Control',
    modifierKeySymbol: 'Ctrl',
    visualEffect: 'mica',
  },
  linux: {
    displayName: 'Linux (Desktop)',
    controlsPosition: 'right',
    modifierKeyLabel: 'Control',
    modifierKeySymbol: 'Ctrl',
    visualEffect: 'standard',
  },
  web: {
    displayName: 'Web Browser Preview',
    controlsPosition: 'right',
    modifierKeyLabel: 'Control',
    modifierKeySymbol: 'Ctrl',
    visualEffect: 'standard',
  },
};

const STORAGE_KEY = 'antigravity_desktop_platform_profile';
const DESKTOP_SIZE_STORAGE_KEY = 'antigravity_desktop_window_dimensions';

/**
 * Dimensi logical layar portrait iPhone standar (Apple iPhone 14/15)
 */
export const IOS_PHONE_DIMENSIONS: WindowDimensions = {
  width: 390,
  height: 844,
};

/**
 * Dimensi logical default untuk window desktop (macOS/Windows)
 */
export const DEFAULT_DESKTOP_DIMENSIONS: WindowDimensions = {
  width: 880,
  height: 620,
};

/**
 * Mengambil ukuran window desktop terakhir yang tersimpan atau default.
 *
 * @returns WindowDimensions
 */
export function getStoredDesktopDimensions(): WindowDimensions {
  try {
    if (typeof localStorage !== 'undefined') {
      const saved = localStorage.getItem(DESKTOP_SIZE_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (typeof parsed.width === 'number' && typeof parsed.height === 'number') {
          return parsed;
        }
      }
    }
  } catch (error) {
    console.warn('[usePlatform] Gagal membaca ukuran desktop tersimpan:', error);
  }
  return DEFAULT_DESKTOP_DIMENSIONS;
}

/**
 * Menyimpan ukuran window desktop terakhir sebelum beralih ke mobile phone.
 *
 * @param dimensions Dimensi width dan height
 */
export function setStoredDesktopDimensions(dimensions: WindowDimensions): void {
  try {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(DESKTOP_SIZE_STORAGE_KEY, JSON.stringify(dimensions));
    }
  } catch (error) {
    console.warn('[usePlatform] Gagal menyimpan ukuran desktop:', error);
  }
}

/**
 * Mengambil preferensi platform tersimpan atau default ke 'macos'
 */
export function getStoredPlatformPreference(): DesktopPlatform {
  try {
    if (typeof localStorage !== 'undefined') {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved === 'macos' || saved === 'ios' || saved === 'windows' || saved === 'linux') {
        return saved;
      }
    }
  } catch (error) {
    console.warn('[usePlatform] Gagal membaca preferensi platform:', error);
  }
  return 'macos';
}

/**
 * Menyimpan preferensi platform ke localStorage
 */
export function setStoredPlatformPreference(platform: DesktopPlatform): void {
  try {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, platform);
    }
  } catch (error) {
    console.warn('[usePlatform] Gagal menyimpan preferensi platform:', error);
  }
}

/**
 * Hook untuk mengakses status platform aktif dan mengubahnya secara dinamis untuk simulasi.
 */
export function usePlatform() {
  const [actualPlatform, setActualPlatform] = useState<DesktopPlatform>('macos');
  const [overridePlatform, setOverridePlatform] = useState<DesktopPlatform>(getStoredPlatformPreference);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const previousPlatformRef = useRef<DesktopPlatform>(overridePlatform);

  useEffect(() => {
    let isMounted = true;
    detectPlatform().then((detected) => {
      if (isMounted) {
        setActualPlatform(detected);
        setIsLoading(false);
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  const currentPlatform = overridePlatform;
  const config = PLATFORM_CONFIGS[currentPlatform] || PLATFORM_CONFIGS.macos;

  // Auto-resize window saat berpindah ke/dari iOS (aspek rasio smartphone portrait)
  useEffect(() => {
    const prevPlatform = previousPlatformRef.current;
    if (prevPlatform === currentPlatform) {
      return;
    }

    if (currentPlatform === 'ios') {
      getAppWindowSize().then((currentSize) => {
        if (currentSize && currentSize.width > 500) {
          setStoredDesktopDimensions(currentSize);
        }
        resizeAppWindow(IOS_PHONE_DIMENSIONS.width, IOS_PHONE_DIMENSIONS.height, true);
      });
    } else if (prevPlatform === 'ios') {
      const savedDimensions = getStoredDesktopDimensions();
      resizeAppWindow(savedDimensions.width, savedDimensions.height, true);
    }

    previousPlatformRef.current = currentPlatform;
  }, [currentPlatform]);

  const togglePlatformPreview = useCallback(() => {
    setOverridePlatform((prev) => {
      let nextPlatform: DesktopPlatform = 'macos';
      if (prev === 'macos') nextPlatform = 'ios';
      else if (prev === 'ios') nextPlatform = 'windows';
      else nextPlatform = 'macos';
      setStoredPlatformPreference(nextPlatform);
      return nextPlatform;
    });
  }, []);

  const updatePlatform = useCallback((platform: DesktopPlatform | null) => {
    const targetPlatform = platform ?? 'macos';
    setOverridePlatform(targetPlatform);
    setStoredPlatformPreference(targetPlatform);
  }, []);

  return {
    platform: currentPlatform,
    actualPlatform,
    isOverridden: true,
    config,
    isLoading,
    setOverridePlatform: updatePlatform,
    togglePlatformPreview,
  };
}

