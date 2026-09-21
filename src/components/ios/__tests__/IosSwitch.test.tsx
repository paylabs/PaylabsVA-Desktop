/**
 * @file IosSwitch.test.tsx
 * @description Unit test untuk komponen IosSwitch (Apple HIG switch toggle).
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { IosSwitch } from '../IosSwitch';

describe('IosSwitch Component (Apple HIG)', () => {
  it('should_render_unchecked_switch_correctly', () => {
    // Arrange
    const handleChange = vi.fn();
    render(<IosSwitch checked={false} onChange={handleChange} aria-label="Notifikasi" />);

    // Act
    const switchElement = screen.getByRole('switch', { name: 'Notifikasi' });

    // Assert
    expect(switchElement).toBeDefined();
    expect(switchElement.getAttribute('aria-checked')).toBe('false');
    expect(switchElement.className).not.toContain('is-active');
  });

  it('should_render_checked_switch_with_active_class', () => {
    // Arrange
    const handleChange = vi.fn();
    render(<IosSwitch checked={true} onChange={handleChange} aria-label="Bluetooth" />);

    // Act
    const switchElement = screen.getByRole('switch', { name: 'Bluetooth' });

    // Assert
    expect(switchElement.getAttribute('aria-checked')).toBe('true');
    expect(switchElement.className).toContain('is-active');
  });

  it('should_trigger_onChange_with_toggled_value_on_click', () => {
    // Arrange
    const handleChange = vi.fn();
    render(<IosSwitch checked={false} onChange={handleChange} aria-label="Wi-Fi" />);
    const switchElement = screen.getByRole('switch', { name: 'Wi-Fi' });

    // Act
    fireEvent.click(switchElement);

    // Assert
    expect(handleChange).toHaveBeenCalledTimes(1);
    expect(handleChange).toHaveBeenCalledWith(true);
  });

  it('should_trigger_onChange_on_Space_and_Enter_keypress', () => {
    // Arrange
    const handleChange = vi.fn();
    render(<IosSwitch checked={true} onChange={handleChange} aria-label="Dark Mode" />);
    const switchElement = screen.getByRole('switch', { name: 'Dark Mode' });

    // Act
    fireEvent.keyDown(switchElement, { key: ' ' });
    fireEvent.keyDown(switchElement, { key: 'Enter' });

    // Assert
    expect(handleChange).toHaveBeenCalledTimes(2);
    expect(handleChange).toHaveBeenNthCalledWith(1, false);
    expect(handleChange).toHaveBeenNthCalledWith(2, false);
  });

  it('should_not_trigger_onChange_when_disabled', () => {
    // Arrange
    const handleChange = vi.fn();
    render(<IosSwitch checked={false} onChange={handleChange} disabled={true} aria-label="Disabled Switch" />);
    const switchElement = screen.getByRole('switch', { name: 'Disabled Switch' });

    // Act
    fireEvent.click(switchElement);

    // Assert
    expect(handleChange).not.toHaveBeenCalled();
    expect(switchElement.getAttribute('disabled')).not.toBeNull();
  });
});
