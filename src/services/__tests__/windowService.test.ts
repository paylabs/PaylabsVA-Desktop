/**
 * @file windowService.test.ts
 * @description Unit test untuk windowService IPC wrappers dan fallback logic.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  isTauriEnvironment,
  detectBrowserPlatform,
  getAppWindowSize,
  resizeAppWindow,
} from '../windowService';

describe('windowService', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  describe('isTauriEnvironment', () => {
    it('should_return_false_when_not_in_tauri_runtime', () => {
      // Arrange & Act
      const result = isTauriEnvironment();

      // Assert
      expect(result).toBe(false);
    });
  });

  describe('detectBrowserPlatform', () => {
    it('should_detect_macos_when_userAgent_contains_mac', () => {
      // Arrange
      vi.spyOn(navigator, 'userAgent', 'get').mockReturnValue('Mozilla/5.0 (Macintosh; Intel Mac OS X)');

      // Act
      const platform = detectBrowserPlatform();

      // Assert
      expect(platform).toBe('macos');
    });

    it('should_detect_windows_when_userAgent_contains_win', () => {
      // Arrange
      vi.spyOn(navigator, 'userAgent', 'get').mockReturnValue('Mozilla/5.0 (Windows NT 10.0; Win64; x64)');

      // Act
      const platform = detectBrowserPlatform();

      // Assert
      expect(platform).toBe('windows');
    });
  });

  describe('getAppWindowSize', () => {
    it('should_return_window_inner_dimensions_when_in_browser_fallback', async () => {
      // Arrange
      window.innerWidth = 1024;
      window.innerHeight = 768;

      // Act
      const size = await getAppWindowSize();

      // Assert
      expect(size).toEqual({ width: 1024, height: 768 });
    });
  });

  describe('resizeAppWindow', () => {
    it('should_execute_mock_gracefully_when_in_browser_fallback', async () => {
      // Arrange
      const consoleSpy = vi.spyOn(console, 'info').mockImplementation(() => {});

      // Act
      await resizeAppWindow(390, 844, true);

      // Assert
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('Mock resizeWindow (390x844, center=true)')
      );
    });
  });
});
