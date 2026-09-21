/**
 * @file Modal.test.tsx
 * @description Unit test untuk komponen Modal (render, backdrop click, escape listener, and footer buttons).
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Modal } from '../Modal';

describe('Modal Component', () => {
  it('should_not_render_when_isOpen_is_false', () => {
    // Arrange & Act
    render(
      <Modal isOpen={false} onClose={vi.fn()} title="Test Dialog">
        Konten modal
      </Modal>
    );

    // Assert
    expect(screen.queryByText('Test Dialog')).toBeNull();
  });

  it('should_render_title_and_children_when_isOpen_is_true', () => {
    // Arrange & Act
    render(
      <Modal isOpen={true} onClose={vi.fn()} title="Test Dialog">
        Konten modal aktif
      </Modal>
    );

    // Assert
    expect(screen.getByText('Test Dialog')).toBeDefined();
    expect(screen.getByText('Konten modal aktif')).toBeDefined();
  });

  it('should_trigger_onClose_when_close_button_clicked', () => {
    // Arrange
    const handleClose = vi.fn();
    render(
      <Modal isOpen={true} onClose={handleClose} title="Test Dialog">
        Konten modal
      </Modal>
    );

    // Act
    const closeButton = screen.getByLabelText('Tutup dialog');
    fireEvent.click(closeButton);

    // Assert
    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it('should_trigger_onClose_when_escape_key_pressed', () => {
    // Arrange
    const handleClose = vi.fn();
    render(
      <Modal isOpen={true} onClose={handleClose} title="Test Dialog">
        Konten modal
      </Modal>
    );

    // Act
    fireEvent.keyDown(window, { key: 'Escape' });

    // Assert
    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it('should_render_default_footer_buttons_and_handle_clicks', () => {
    // Arrange
    const handleClose = vi.fn();
    const handleConfirm = vi.fn();
    render(
      <Modal
        isOpen={true}
        onClose={handleClose}
        title="Test Action Dialog"
        cancelText="Batal"
        confirmText="Lanjutkan"
        onConfirm={handleConfirm}
      >
        Konfirmasi aksi
      </Modal>
    );

    // Act & Assert Cancel button
    const cancelBtn = screen.getByText('Batal');
    fireEvent.click(cancelBtn);
    expect(handleClose).toHaveBeenCalledTimes(1);

    // Act & Assert Confirm button
    const confirmBtn = screen.getByText('Lanjutkan');
    fireEvent.click(confirmBtn);
    expect(handleConfirm).toHaveBeenCalledTimes(1);
  });
});
