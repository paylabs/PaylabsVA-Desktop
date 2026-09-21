/**
 * @file themeStorage.test.ts
 * @description Unit test untuk pengujian persistensi data tema pada themeStorage.
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { getSavedTheme, saveTheme, THEME_STORAGE_KEY } from '../themeStorage';

describe('themeStorage', () => {
  beforeEach(() => {
    window.localStorage.clear();
    vi.restoreAllMocks();
  });

  it('should_save_theme_to_local_storage_when_saveTheme_is_called', () => {
    // Arrange
    const themeToSave = 'light';

    // Act
    saveTheme(themeToSave);

    // Assert
    const storedValue = window.localStorage.getItem(THEME_STORAGE_KEY);
    expect(storedValue).toBe('light');
  });

  it('should_return_saved_theme_when_stored_in_local_storage', () => {
    // Arrange
    window.localStorage.setItem(THEME_STORAGE_KEY, 'light');

    // Act
    const theme = getSavedTheme();

    // Assert
    expect(theme).toBe('light');
  });

  it('should_return_fallback_theme_when_storage_is_empty', () => {
    // Arrange
    window.localStorage.clear();

    // Act
    const theme = getSavedTheme();

    // Assert
    expect(['dark', 'light']).toContain(theme);
  });
});
