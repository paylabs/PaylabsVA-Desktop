/**
 * @file IosActionSheet.test.tsx
 * @description Unit test untuk komponen modal IosActionSheet (Apple HIG).
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { IosActionSheet } from '../IosActionSheet';

describe('IosActionSheet Component (Apple HIG)', () => {
  it('should_not_render_when_isOpen_is_false', () => {
    // Arrange & Act
    const handleClose = vi.fn();
    render(
      <IosActionSheet
        isOpen={false}
        title="Sheet Title"
        actions={[]}
        onClose={handleClose}
      />
    );

    // Assert
    expect(screen.queryByRole('dialog')).toBeNull();
  });

  it('should_render_title_and_actions_when_isOpen_is_true', () => {
    // Arrange
    const handleClose = vi.fn();
    const handleAction = vi.fn();
    const actions = [
      { id: 'share', label: 'Share Document', onClick: handleAction },
      { id: 'delete', label: 'Delete Item', isDestructive: true, onClick: vi.fn() },
    ];

    // Act
    render(
      <IosActionSheet
        isOpen={true}
        title="Pilih Aksi Dokumen"
        actions={actions}
        onClose={handleClose}
      />
    );

    // Assert
    expect(screen.getByRole('dialog')).toBeDefined();
    expect(screen.getByText('Pilih Aksi Dokumen')).toBeDefined();
    expect(screen.getByText('Share Document')).toBeDefined();

    const deleteBtn = screen.getByText('Delete Item');
    expect(deleteBtn.className).toContain('destructive');
  });

  it('should_trigger_action_callback_and_close_when_action_clicked', () => {
    // Arrange
    const handleClose = vi.fn();
    const handleAction = vi.fn();
    render(
      <IosActionSheet
        isOpen={true}
        actions={[{ id: 'edit', label: 'Edit File', onClick: handleAction }]}
        onClose={handleClose}
      />
    );

    // Act
    fireEvent.click(screen.getByText('Edit File'));

    // Assert
    expect(handleAction).toHaveBeenCalledTimes(1);
    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it('should_close_when_cancel_button_clicked', () => {
    // Arrange
    const handleClose = vi.fn();
    render(
      <IosActionSheet
        isOpen={true}
        cancelLabel="Batalkan"
        actions={[]}
        onClose={handleClose}
      />
    );

    // Act
    fireEvent.click(screen.getByText('Batalkan'));

    // Assert
    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it('should_close_when_Escape_key_pressed', () => {
    // Arrange
    const handleClose = vi.fn();
    render(
      <IosActionSheet
        isOpen={true}
        actions={[]}
        onClose={handleClose}
      />
    );

    // Act
    fireEvent.keyDown(window, { key: 'Escape' });

    // Assert
    expect(handleClose).toHaveBeenCalledTimes(1);
  });
});
