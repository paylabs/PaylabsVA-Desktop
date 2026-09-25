/**
 * @file VaGeneratorView.test.tsx
 * @description Unit test untuk komponen VaGeneratorView, memvalidasi form validation, mode Dynamic VA (MultipleBNIVA), dan Static VA (StaticBNIVA tanpa kolom amount).
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { VaGeneratorView } from '../VaGeneratorView';

const submitCreateVaMock = vi.fn();

vi.mock('../../../hooks/usePaylabs', () => ({
  usePaylabs: () => ({
    status: { configured: true, environment: 'SIT' },
    channels: [
      { id: 'MultipleBNIVA', code: '009', name: 'BNI' },
      { id: 'StaticBNIVA', code: '009', name: 'BNI' },
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

  it('should_prevent_submission_and_show_error_when_name_is_empty', () => {
    // Arrange
    render(<VaGeneratorView mode="dynamic" onShowToast={onShowToastMock} />);
    const submitButton = screen.getByRole('button', { name: /Generate Dynamic Virtual Account/i });

    // Act
    fireEvent.click(submitButton);

    // Assert: Tidak memanggil submit API
    expect(submitCreateVaMock).not.toHaveBeenCalled();
    // Assert: Menampilkan pesan kesalahan nama wajib diisi
    expect(screen.getByText('Nama pelanggan wajib diisi')).toBeDefined();
    expect(onShowToastMock).toHaveBeenCalledWith('Validasi Gagal', 'Nama pelanggan wajib diisi', 'warning');
  });

  it('should_clear_error_when_name_input_is_changed', () => {
    // Arrange
    render(<VaGeneratorView mode="dynamic" onShowToast={onShowToastMock} />);
    const submitButton = screen.getByRole('button', { name: /Generate Dynamic Virtual Account/i });
    fireEvent.click(submitButton);
    expect(screen.getByText('Nama pelanggan wajib diisi')).toBeDefined();

    // Act
    const nameInput = screen.getByPlaceholderText('Contoh: Budi Pratama');
    fireEvent.change(nameInput, { target: { value: 'Budi Santoso' } });

    // Assert: Pesan kesalahan nama hilang
    expect(screen.queryByText('Nama pelanggan wajib diisi')).toBeNull();
  });

  it('should_not_render_amount_field_and_show_open_payment_when_mode_is_static', () => {
    // Arrange & Act
    render(<VaGeneratorView mode="static" onShowToast={onShowToastMock} />);

    // Assert: Input nominal dan preset pills tidak boleh ada di DOM
    expect(screen.queryByPlaceholderText('Nominal tagihan')).toBeNull();
    expect(screen.queryByText('100rb')).toBeNull();

    // Assert: Banner Open Payment tampil
    expect(screen.getByText(/Open Payment \(Rp 0\.00 \/ Bebas Nominal\)/i)).toBeDefined();
    expect(screen.getByText(/Static Virtual Account menerima nominal transfer bebas/i)).toBeDefined();

    // Assert: Judul parameter kartu disesuaikan
    expect(screen.getByText('Parameter Static Virtual Account')).toBeDefined();
  });

  it('should_render_amount_field_when_mode_is_dynamic', () => {
    // Arrange & Act
    render(<VaGeneratorView mode="dynamic" onShowToast={onShowToastMock} />);

    // Assert: Input nominal tagihan harus ada
    expect(screen.getByPlaceholderText('Nominal tagihan')).toBeDefined();
    expect(screen.getByText('100rb')).toBeDefined();

    // Assert: Judul parameter kartu disesuaikan
    expect(screen.getByText('Parameter Dynamic Virtual Account')).toBeDefined();
  });

  it('should_default_to_bni_and_provide_bca_and_mandiri_options', () => {
    // Arrange & Act
    render(<VaGeneratorView mode="dynamic" onShowToast={onShowToastMock} />);

    // Assert: Default terpilih adalah BNI (009)
    expect(screen.getByText('BNI (009)')).toBeDefined();

    // Act: Buka dropdown select
    const triggerBtn = screen.getByRole('button', { name: /Dropdown selector/i });
    fireEvent.click(triggerBtn);

    // Assert: Opsi BCA dan Mandiri tersedia di popover
    expect(screen.getByText('BCA (014)')).toBeDefined();
    expect(screen.getByText('Mandiri (008)')).toBeDefined();
  });

  it('should_provide_static_mandiri_va_option_in_static_mode', () => {
    // Arrange & Act
    render(<VaGeneratorView mode="static" onShowToast={onShowToastMock} />);

    // Act: Buka dropdown select
    const triggerBtn = screen.getByRole('button', { name: /Dropdown selector/i });
    fireEvent.click(triggerBtn);

    // Assert: Opsi Mandiri (008) tersedia di popover Static VA
    expect(screen.getByText('Mandiri (008)')).toBeDefined();
  });

  it('should_submit_with_zero_amount_when_mode_is_static', async () => {
    // Arrange
    submitCreateVaMock.mockResolvedValueOnce({
      success: true,
      parsed: {
        virtualAccountData: {
          virtualAccountNo: '00900000000000000000',
        },
      },
    });

    render(<VaGeneratorView mode="static" onShowToast={onShowToastMock} />);

    // Act: Isi nama dan klik submit
    const nameInput = screen.getByPlaceholderText('Contoh: Budi Pratama');
    fireEvent.change(nameInput, { target: { value: 'Pelanggan Statis' } });

    const submitButton = screen.getByRole('button', { name: /Generate Static Virtual Account/i });
    fireEvent.click(submitButton);

    // Assert: Memanggil API dengan amount '0' dan channel 'StaticBNIVA'
    await waitFor(() => {
      expect(submitCreateVaMock).toHaveBeenCalledWith(
        expect.objectContaining({
          channel: 'StaticBNIVA',
          name: 'Pelanggan Statis',
          amount: '0',
        })
      );
    });
  });

  it('should_submit_with_custom_amount_when_mode_is_dynamic', async () => {
    // Arrange
    submitCreateVaMock.mockResolvedValueOnce({
      success: true,
      parsed: {
        virtualAccountData: {
          virtualAccountNo: '00912345678901234567',
        },
      },
    });

    render(<VaGeneratorView mode="dynamic" onShowToast={onShowToastMock} />);

    // Act: Isi nama dan nominal lalu klik submit
    const nameInput = screen.getByPlaceholderText('Contoh: Budi Pratama');
    fireEvent.change(nameInput, { target: { value: 'Pelanggan Dinamis' } });

    const amountInput = screen.getByPlaceholderText('Nominal tagihan');
    fireEvent.change(amountInput, { target: { value: '250000' } });

    const submitButton = screen.getByRole('button', { name: /Generate Dynamic Virtual Account/i });
    fireEvent.click(submitButton);

    // Assert: Memanggil API dengan amount '250000' dan channel 'MultipleBNIVA'
    await waitFor(() => {
      expect(submitCreateVaMock).toHaveBeenCalledWith(
        expect.objectContaining({
          channel: 'MultipleBNIVA',
          name: 'Pelanggan Dinamis',
          amount: '250000',
        })
      );
    });
  });

  it('should_display_asterisk_indicator_for_all_mandatory_fields', () => {
    // Arrange & Act (Dynamic Mode)
    const { unmount } = render(<VaGeneratorView mode="dynamic" onShowToast={onShowToastMock} />);

    // Assert: Bank Channel, Customer Name, and Amount have mandatory asterisk indicator
    const requiredStarsDynamic = screen.getAllByLabelText('wajib diisi');
    expect(requiredStarsDynamic.length).toBe(3); // Channel, Name, Amount

    unmount();

    // Arrange & Act (Static Mode)
    render(<VaGeneratorView mode="static" onShowToast={onShowToastMock} />);

    // Assert: Bank Channel and Customer Name have mandatory asterisk indicator (amount is hidden)
    const requiredStarsStatic = screen.getAllByLabelText('wajib diisi');
    expect(requiredStarsStatic.length).toBe(2); // Channel, Name only
  });
});
