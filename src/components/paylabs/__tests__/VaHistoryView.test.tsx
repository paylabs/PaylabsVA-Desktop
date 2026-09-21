/**
 * @file VaHistoryView.test.tsx
 * @description Unit test untuk komponen VaHistoryView (tabel riwayat transaksi lokal Paylabs).
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { VaHistoryView } from '../VaHistoryView';

// Mock hook usePaylabs
vi.mock('../../../hooks/usePaylabs', () => ({
  usePaylabs: () => ({
    history: [
      {
        id: 'hist-1',
        environment: 'SIT',
        channel: 'BCA',
        channelName: 'Bank BCA',
        virtualAccountNo: '8888000012345678',
        virtualAccountPhone: '6281234567890',
        name: 'Ahmad Dahlan',
        amount: '250000',
        trxId: 'TRX-101',
        expiredDate: '2026-10-19T23:59:59+07:00',
        createdAt: '2026-09-19T10:00:00+07:00',
      },
      {
        id: 'hist-2',
        environment: 'PROD',
        channel: 'BRI',
        channelName: 'Bank BRI',
        virtualAccountNo: '8888000087654321',
        name: 'Siti Aminah',
        amount: '500000',
        trxId: 'TRX-102',
        expiredDate: '2026-10-25T23:59:59+07:00',
        createdAt: '2026-09-19T11:00:00+07:00',
      },
    ],
    isLoadingHistory: false,
    handleClearHistory: vi.fn(),
    refreshHistory: vi.fn(),
  }),
}));


describe('VaHistoryView Component', () => {
  const onShowToastMock = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should_render_header_and_stats_correctly', () => {
    // Arrange & Act
    render(<VaHistoryView onShowToast={onShowToastMock} />);

    // Assert
    expect(screen.getByText('Riwayat Virtual Account')).toBeDefined();
    expect(screen.getByText('Total Transaksi')).toBeDefined();
    expect(screen.getByText('Total Nominal')).toBeDefined();
  });

  it('should_render_history_records_in_table', () => {
    // Arrange & Act
    render(<VaHistoryView onShowToast={onShowToastMock} />);

    // Assert
    expect(screen.getByText('Ahmad Dahlan')).toBeDefined();
    expect(screen.getByText('8888000012345678')).toBeDefined();
    expect(screen.getByText('Siti Aminah')).toBeDefined();
    expect(screen.getByText('8888000087654321')).toBeDefined();
  });

  it('should_render_filter_segmented_buttons', () => {
    // Arrange & Act
    render(<VaHistoryView onShowToast={onShowToastMock} />);

    // Assert
    expect(screen.getByRole('button', { name: /Semua/ })).toBeDefined();
    expect(screen.getByRole('button', { name: 'SIT' })).toBeDefined();
    expect(screen.getByRole('button', { name: 'PROD' })).toBeDefined();
  });

  it('should_render_with_va_history_fixed_container_class', () => {
    // Arrange & Act
    const { container } = render(<VaHistoryView onShowToast={onShowToastMock} />);

    // Assert
    const fixedContainer = container.querySelector('.va-history-fixed-container');
    expect(fixedContainer).not.toBeNull();

    const tableWrapper = container.querySelector('.paylabs-table-wrapper');
    expect(tableWrapper).not.toBeNull();
  });

  it('should_render_customer_name_with_pointer_events_none', () => {
    // Arrange & Act
    render(<VaHistoryView onShowToast={onShowToastMock} />);

    // Assert: Elemen nama pelanggan harus memiliki pointerEvents: 'none' agar overflow: hidden tidak memblokir scroll
    const nameEl = screen.getByText('Ahmad Dahlan');
    expect(nameEl.style.pointerEvents).toBe('none');
  });

  it('should_render_payer_number_column_and_data', () => {
    // Arrange & Act
    render(<VaHistoryView onShowToast={onShowToastMock} />);

    // Assert
    expect(screen.getByText('Payer Number')).toBeDefined();
    expect(screen.getByText('6281234567890')).toBeDefined();
  });
});
