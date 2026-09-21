/**
 * @file Toast.test.tsx
 * @description Unit test untuk komponen ToastContainer (render, dismiss button, and message).
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ToastContainer, ToastItem } from '../Toast';

describe('ToastContainer', () => {
  it('should_render_nothing_when_toasts_array_is_empty', () => {
    // Arrange & Act
    const { container } = render(<ToastContainer toasts={[]} onDismiss={vi.fn()} />);

    // Assert
    expect(container.firstChild).toBeNull();
  });

  it('should_render_toast_items_correctly', () => {
    // Arrange
    const sampleToasts: ToastItem[] = [
      { id: '1', type: 'success', title: 'Data Tersimpan', message: 'Sukses disimpan' },
      { id: '2', type: 'error', title: 'Operasi Gagal', message: 'Koneksi terputus' },
    ];

    // Act
    render(<ToastContainer toasts={sampleToasts} onDismiss={vi.fn()} />);

    // Assert
    expect(screen.getByText('Data Tersimpan')).toBeDefined();
    expect(screen.getByText('Sukses disimpan')).toBeDefined();
    expect(screen.getByText('Operasi Gagal')).toBeDefined();
  });

  it('should_trigger_onDismiss_when_dismiss_button_is_clicked', () => {
    // Arrange
    const handleDismiss = vi.fn();
    const sampleToasts: ToastItem[] = [
      { id: 'toast-1', type: 'info', title: 'Pemberitahuan Sistem' },
    ];

    // Act
    render(<ToastContainer toasts={sampleToasts} onDismiss={handleDismiss} />);
    const dismissButton = screen.getByLabelText('Tutup notifikasi');
    fireEvent.click(dismissButton);

    // Assert
    expect(handleDismiss).toHaveBeenCalledWith('toast-1');
  });
});
