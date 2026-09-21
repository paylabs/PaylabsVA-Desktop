/**
 * src/hooks/__tests__/usePlatform.test.ts — Unit Test untuk usePlatform Hook
 *
 * Tanggung Jawab:
 * - Memverifikasi default platform aktif adalah macOS
 * - Memverifikasi fungsi toggle preview beralih antar platform
 * - Memverifikasi persistensi platform ke localStorage
 *
 * Dependensi:
 * - vitest
 * - @testing-library/react
 * - src/hooks/usePlatform.ts
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import {
  usePlatform,
  getStoredPlatformPreference,
  setStoredPlatformPreference,
  getStoredDesktopDimensions,
  setStoredDesktopDimensions,
  IOS_PHONE_DIMENSIONS,
  DEFAULT_DESKTOP_DIMENSIONS,
} from '../usePlatform';
import * as windowService from '../../services/windowService';

describe('usePlatform Hook', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  it('should_default_to_macos_style_when_no_stored_preference', async () => {
    // Arrange & Act
    let hookResult: any;
    await act(async () => {
      hookResult = renderHook(() => usePlatform()).result;
    });

    // Assert
    expect(hookResult.current.platform).toBe('macos');
    expect(hookResult.current.config.displayName).toContain('macOS');
    expect(hookResult.current.config.controlsPosition).toBe('left');
    expect(hookResult.current.config.modifierKeySymbol).toBe('⌘');
  });

  it('should_cycle_through_macos_ios_and_windows_when_togglePlatformPreview_called', async () => {
    // Arrange
    let hookResult: any;
    await act(async () => {
      hookResult = renderHook(() => usePlatform()).result;
    });
    expect(hookResult.current.platform).toBe('macos');

    // Act 1 - Beralih ke iOS
    await act(async () => {
      hookResult.current.togglePlatformPreview();
    });

    // Assert 1
    expect(hookResult.current.platform).toBe('ios');
    expect(localStorage.getItem('antigravity_desktop_platform_profile')).toBe('ios');

    // Act 2 - Beralih ke Windows
    await act(async () => {
      hookResult.current.togglePlatformPreview();
    });

    // Assert 2
    expect(hookResult.current.platform).toBe('windows');
    expect(localStorage.getItem('antigravity_desktop_platform_profile')).toBe('windows');

    // Act 3 - Beralih kembali ke macOS
    await act(async () => {
      hookResult.current.togglePlatformPreview();
    });

    // Assert 3
    expect(hookResult.current.platform).toBe('macos');
    expect(localStorage.getItem('antigravity_desktop_platform_profile')).toBe('macos');
  });

  it('should_read_existing_preference_from_localStorage_when_initialized', () => {
    // Arrange
    setStoredPlatformPreference('windows');

    // Act
    const saved = getStoredPlatformPreference();

    // Assert
    expect(saved).toBe('windows');
  });

  it('should_trigger_window_resize_to_phone_dimensions_when_switched_to_ios', async () => {
    // Arrange
    const resizeSpy = vi.spyOn(windowService, 'resizeAppWindow').mockResolvedValue();
    vi.spyOn(windowService, 'getAppWindowSize').mockResolvedValue({ width: 1200, height: 800 });

    let hookResult: any;
    await act(async () => {
      hookResult = renderHook(() => usePlatform()).result;
    });

    // Act - Beralih ke iOS
    await act(async () => {
      hookResult.current.setOverridePlatform('ios');
    });

    // Assert
    expect(resizeSpy).toHaveBeenCalledWith(
      IOS_PHONE_DIMENSIONS.width,
      IOS_PHONE_DIMENSIONS.height,
      true
    );
  });

  it('should_restore_saved_desktop_dimensions_when_switched_from_ios_to_desktop', async () => {
    // Arrange
    vi.spyOn(windowService, 'getAppWindowSize').mockResolvedValue({ width: 1050, height: 720 });
    const resizeSpy = vi.spyOn(windowService, 'resizeAppWindow').mockResolvedValue();

    let hookResult: any;
    await act(async () => {
      hookResult = renderHook(() => usePlatform()).result;
    });

    // Beralih ke iOS dahulu
    await act(async () => {
      hookResult.current.setOverridePlatform('ios');
    });
    resizeSpy.mockClear();

    // Act - Beralih kembali ke Windows
    await act(async () => {
      hookResult.current.setOverridePlatform('windows');
    });

    // Assert - Harus memulihkan ukuran desktop 1050x720
    expect(resizeSpy).toHaveBeenCalledWith(1050, 720, true);
  });

  it('should_manage_stored_desktop_dimensions_correctly', () => {
    // Arrange - default ketika belum ada data
    expect(getStoredDesktopDimensions()).toEqual(DEFAULT_DESKTOP_DIMENSIONS);

    // Act - simpan ukuran kustom
    setStoredDesktopDimensions({ width: 1440, height: 900 });

    // Assert
    expect(getStoredDesktopDimensions()).toEqual({ width: 1440, height: 900 });
  });
});

