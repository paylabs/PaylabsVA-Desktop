/**
 * @file shortcutFormatter.test.ts
 * @description Unit test untuk pengujian pemformatan shortcut cross-platform.
 */

import { describe, it, expect } from 'vitest';
import { formatShortcut } from '../shortcutFormatter';

describe('shortcutFormatter', () => {
  it('should_format_mod_as_command_symbol_when_platform_is_macos', () => {
    // Arrange
    const shortcutInput = 'Mod+K';
    const platform = 'macos';

    // Act
    const result = formatShortcut(shortcutInput, platform);

    // Assert
    expect(result).toBe('⌘K');
  });

  it('should_format_mod_as_ctrl_plus_when_platform_is_windows', () => {
    // Arrange
    const shortcutInput = 'Mod+K';
    const platform = 'windows';

    // Act
    const result = formatShortcut(shortcutInput, platform);

    // Assert
    expect(result).toBe('Ctrl + K');
  });

  it('should_format_complex_combination_correctly_for_macos', () => {
    // Arrange
    const shortcutInput = 'Mod+Shift+P';
    const platform = 'macos';

    // Act
    const result = formatShortcut(shortcutInput, platform);

    // Assert
    expect(result).toBe('⌘⇧P');
  });

  it('should_format_complex_combination_correctly_for_windows', () => {
    // Arrange
    const shortcutInput = 'Mod+Shift+P';
    const platform = 'windows';

    // Act
    const result = formatShortcut(shortcutInput, platform);

    // Assert
    expect(result).toBe('Ctrl + Shift + P');
  });

  it('should_return_empty_string_when_input_is_empty', () => {
    // Arrange
    const shortcutInput = '';
    const platform = 'windows';

    // Act
    const result = formatShortcut(shortcutInput, platform);

    // Assert
    expect(result).toBe('');
  });
});
