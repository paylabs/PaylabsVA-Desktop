/**
 * @file VaGeneratorView.test.tsx
 * @description Unit test untuk komponen VaGeneratorView, memvalidasi form validation bergaya tema dan pencegahan submit tanpa bank.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { VaGeneratorView } from '../VaGeneratorView';

const submitCreateVaMock = vi.fn();

vi.mock('../../../hooks/usePaylabs', () => ({
  usePaylabs: () => ({
    status: { configured: true, environment: 'SIT' },
    channels: [
      { id: 'BCA', code: '014', name: 'BCA' },
      { id: 'BNI', code: '009', name: 'BNI' },
    ],
    isSubmitting: false,
    lastExchange: null,
    submitCreateVa: submitCreateVaMock,
  }),
}));

describe('VaGeneratorView Component Validation', () => {
  const onShowToastMock = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should_prevent_submission_and_show_error_when_bank_is_not_selected', () => {
    // Arrange
    render(<VaGeneratorView onShowToast={onShowToastMock} />);
    const submitButton = screen.getByRole('button', { name: /Generate Virtual Account/i });

    // Act
    fireEvent.click(submitButton);

    // Assert: Tidak memanggil submit API
    expect(submitCreateVaMock).not.toHaveBeenCalled();
    // Assert: Menampilkan pesan kesalahan bank belum dipilih
    expect(screen.getByText('Silakan pilih channel bank terlebih dahulu')).toBeDefined();
    expect(screen.getByText('Nama pelanggan wajib diisi')).toBeDefined();
    // Assert: Memanggil toast peringatan bank
    expect(onShowToastMock).toHaveBeenCalledWith('Validasi Gagal', 'Silakan pilih channel bank terlebih dahulu', 'warning');
  });

  it('should_clear_error_when_name_input_is_changed', () => {
    // Arrange
    render(<VaGeneratorView onShowToast={onShowToastMock} />);
    const submitButton = screen.getByRole('button', { name: /Generate Virtual Account/i });
    fireEvent.click(submitButton);
    expect(screen.getByText('Nama pelanggan wajib diisi')).toBeDefined();

    // Act
    const nameInput = screen.getByPlaceholderText('Contoh: Budi Pratama');
    fireEvent.change(nameInput, { target: { value: 'Budi Santoso' } });

    // Assert: Pesan kesalahan nama hilang
    expect(screen.queryByText('Nama pelanggan wajib diisi')).toBeNull();
  });
});
