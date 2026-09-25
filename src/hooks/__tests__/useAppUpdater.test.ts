/**
 * @file useAppUpdater.test.ts
 * @description Unit test untuk hook useAppUpdater dengan pola AAA (Arrange-Act-Assert).
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useAppUpdater } from '../useAppUpdater';

// Mock dynamic import @tauri-apps/plugin-updater
const mockCheck = vi.fn();
const mockRelaunch = vi.fn();

vi.mock('@tauri-apps/plugin-updater', () => ({
  check: () => mockCheck(),
}));

vi.mock('@tauri-apps/plugin-process', () => ({
  relaunch: () => mockRelaunch(),
}));

describe('useAppUpdater Hook', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
  });

  it('should_initialize_with_idle_status_and_null_update_info', () => {
    // Arrange & Act
    const { result } = renderHook(() => useAppUpdater());

    // Assert
    expect(result.current.status).toBe('idle');
    expect(result.current.updateInfo).toBeNull();
    expect(result.current.downloadProgress).toBe(0);
    expect(result.current.isBannerVisible).toBe(false);
  });

  it('should_detect_update_when_newer_release_is_available', async () => {
    // Arrange
    const mockUpdateObject = {
      version: '0.1.2',
      body: 'Pembaruan fitur keamanan',
      date: '2026-09-25T14:00:00Z',
      downloadAndInstall: vi.fn(),
    };
    mockCheck.mockResolvedValueOnce(mockUpdateObject);

    const { result } = renderHook(() => useAppUpdater());

    // Act
    await act(async () => {
      await result.current.checkForUpdates(false);
    });

    // Assert
    expect(result.current.status).toBe('available');
    expect(result.current.updateInfo).toEqual({
      version: '0.1.2',
      notes: 'Pembaruan fitur keamanan',
      date: '2026-09-25T14:00:00Z',
    });
    expect(result.current.isBannerVisible).toBe(true);
  });

  it('should_set_status_to_up_to_date_when_no_update_found', async () => {
    // Arrange
    mockCheck.mockResolvedValueOnce(null);
    const { result } = renderHook(() => useAppUpdater());

    // Act
    await act(async () => {
      await result.current.checkForUpdates(false);
    });

    // Assert
    expect(result.current.status).toBe('up-to-date');
    expect(result.current.updateInfo).toBeNull();
  });

  it('should_handle_error_when_update_check_fails', async () => {
    // Arrange
    mockCheck.mockRejectedValueOnce(new Error('Network timeout'));
    const { result } = renderHook(() => useAppUpdater());

    // Act
    await act(async () => {
      await result.current.checkForUpdates(false);
    });

    // Assert
    expect(result.current.status).toBe('error');
    expect(result.current.errorMessage).toContain('Network timeout');
    expect(result.current.isBannerVisible).toBe(false);
  });

  it('should_treat_missing_release_manifest_as_up_to_date_when_404_returned', async () => {
    // Arrange
    mockCheck.mockRejectedValueOnce(new Error('Could not fetch a valid release JSON from the remote: 404 Not Found'));
    const { result } = renderHook(() => useAppUpdater());

    // Act
    await act(async () => {
      await result.current.checkForUpdates(false);
    });

    // Assert
    expect(result.current.status).toBe('up-to-date');
    expect(result.current.isBannerVisible).toBe(false);
  });

  it('should_dismiss_banner_when_dismissBanner_is_called', async () => {
    // Arrange
    mockCheck.mockResolvedValueOnce({
      version: '0.2.0',
      body: 'Update',
    });
    const { result } = renderHook(() => useAppUpdater());

    await act(async () => {
      await result.current.checkForUpdates(false);
    });
    expect(result.current.isBannerVisible).toBe(true);

    // Act
    act(() => {
      result.current.dismissBanner();
    });

    // Assert
    expect(result.current.isBannerVisible).toBe(false);
  });
});
