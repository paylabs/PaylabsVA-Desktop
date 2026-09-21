/**
 * @file disableContextMenu.test.ts
 * @description Unit test untuk pengujian penonaktifan context menu klik kanan.
 */

import { describe, it, expect, vi } from 'vitest';
import { handleContextMenu, setupContextMenuGuard } from '../disableContextMenu';

describe('disableContextMenu', () => {
  it('should_prevent_default_when_contextmenu_event_is_handled', () => {
    // Arrange
    const preventDefaultSpy = vi.fn();
    const mockEvent = {
      preventDefault: preventDefaultSpy,
    } as unknown as MouseEvent;

    // Act
    handleContextMenu(mockEvent);

    // Assert
    expect(preventDefaultSpy).toHaveBeenCalledTimes(1);
  });

  it('should_attach_and_remove_event_listener_when_setup_and_cleaned_up', () => {
    // Arrange
    const addEventListenerSpy = vi.spyOn(window, 'addEventListener');
    const removeEventListenerSpy = vi.spyOn(window, 'removeEventListener');

    // Act
    const cleanup = setupContextMenuGuard();

    // Assert
    expect(addEventListenerSpy).toHaveBeenCalledWith('contextmenu', handleContextMenu);

    cleanup();
    expect(removeEventListenerSpy).toHaveBeenCalledWith('contextmenu', handleContextMenu);

    addEventListenerSpy.mockRestore();
    removeEventListenerSpy.mockRestore();
  });
});
