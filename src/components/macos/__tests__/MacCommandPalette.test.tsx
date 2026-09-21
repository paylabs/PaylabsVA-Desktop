/**
 * @file MacCommandPalette.test.tsx
 * @description Unit test untuk komponen MacCommandPalette (Apple Spotlight modal) pada Paylabs VA Suite.
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MacCommandPalette } from '../MacCommandPalette';
import { HistoryRecord } from '../../../types/paylabs';

describe('MacCommandPalette Component (Apple HIG)', () => {
  it('should_not_render_when_isOpen_is_false', () => {
    // Arrange & Act
    render(
      <MacCommandPalette
        isOpen={false}
        onClose={vi.fn()}
        onSelectTab={vi.fn()}
        onToggleTheme={vi.fn()}
      />
    );

    // Assert
    expect(screen.queryByRole('dialog')).toBeNull();
  });

  it('should_render_modal_and_filter_commands_by_query', () => {
    // Arrange
    render(
      <MacCommandPalette
        isOpen={true}
        onClose={vi.fn()}
        onSelectTab={vi.fn()}
        onToggleTheme={vi.fn()}
      />
    );

    // Act
    const input = screen.getByLabelText('Input pencarian perintah');
    fireEvent.change(input, { target: { value: 'Gelap' } });

    // Assert
    expect(screen.getByText('Toggle Mode Gelap / Terang')).toBeDefined();
    expect(screen.queryByText('Buka Paylabs VA Generator')).toBeNull();
  });

  it('should_execute_command_and_close_when_item_clicked', () => {
    // Arrange
    const handleSelectTab = vi.fn();
    const handleClose = vi.fn();

    render(
      <MacCommandPalette
        isOpen={true}
        onClose={handleClose}
        onSelectTab={handleSelectTab}
        onToggleTheme={vi.fn()}
      />
    );

    // Act
    const vaGenBtn = screen.getByText('Buka Paylabs VA Generator');
    fireEvent.click(vaGenBtn);

    // Assert
    expect(handleSelectTab).toHaveBeenCalledWith('va-generator');
    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it('should_close_when_Escape_key_is_pressed', () => {
    // Arrange
    const handleClose = vi.fn();

    render(
      <MacCommandPalette
        isOpen={true}
        onClose={handleClose}
        onSelectTab={vi.fn()}
        onToggleTheme={vi.fn()}
      />
    );

    // Act
    const input = screen.getByLabelText('Input pencarian perintah');
    fireEvent.keyDown(input, { key: 'Escape' });

    // Assert
    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it('should_render_icon_wrapper_and_action_hint_when_navigating_with_arrow_keys', () => {
    // Arrange
    const { container } = render(
      <MacCommandPalette
        isOpen={true}
        onClose={vi.fn()}
        onSelectTab={vi.fn()}
        onToggleTheme={vi.fn()}
      />
    );

    // Act
    const input = screen.getByLabelText('Input pencarian perintah');
    const iconWrappers = container.querySelectorAll('.macos-command-icon-wrapper');
    expect(iconWrappers.length).toBeGreaterThan(0);

    // Initial selected item should have action hint
    const initialActionHints = container.querySelectorAll('.macos-command-action-hint');
    expect(initialActionHints.length).toBe(1);

    // Arrow down
    fireEvent.keyDown(input, { key: 'ArrowDown' });

    // Assert
    const selectedItems = container.querySelectorAll('.macos-command-item.is-selected');
    expect(selectedItems.length).toBe(1);
    const actionHintsAfter = container.querySelectorAll('.macos-command-action-hint');
    expect(actionHintsAfter.length).toBe(1);
  });

  it('should_render_history_items_and_allow_selecting_them', () => {
    // Arrange
    const handleSelectTab = vi.fn();
    const handleClose = vi.fn();
    const handleSelectHistoryRecord = vi.fn();
    const mockHistory: HistoryRecord[] = [
      {
        id: 'hist-1',
        name: 'Ahmad Eko',
        virtualAccountNo: '1467584685177533',
        amount: '100000',
        channel: '014',
        channelName: 'BCA',
        createdAt: '2026-09-19T18:08:00Z',
        environment: 'SIT',
        trxId: 'TRX-001',
        expiredDate: '2026-10-19T18:08:00Z',
      },
    ];

    render(
      <MacCommandPalette
        isOpen={true}
        onClose={handleClose}
        onSelectTab={handleSelectTab}
        onToggleTheme={vi.fn()}
        history={mockHistory}
        onSelectHistoryRecord={handleSelectHistoryRecord}
      />
    );

    // Act: Cari nama pelanggan
    const input = screen.getByLabelText('Input pencarian perintah');
    fireEvent.change(input, { target: { value: 'Ahmad' } });

    // Assert: Record riwayat ditemukan
    const historyItem = screen.getByText(/Ahmad Eko/);
    expect(historyItem).toBeDefined();

    // Act: Klik item riwayat
    fireEvent.click(historyItem);

    // Assert: Pindah tab ke riwayat dan buka drawer
    expect(handleSelectTab).toHaveBeenCalledWith('va-history');
    expect(handleSelectHistoryRecord).toHaveBeenCalledWith(mockHistory[0]);
    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it('should_find_history_by_virtual_account_number_with_or_without_spaces', () => {
    // Arrange
    const mockHistory: HistoryRecord[] = [
      {
        id: 'hist-2',
        name: 'Budi Handoko',
        virtualAccountNo: '1467578347344463',
        amount: '250000',
        channel: '009',
        channelName: 'BNI',
        createdAt: '2026-09-19T18:10:00Z',
        environment: 'SIT',
        trxId: 'TRX-999',
        expiredDate: '2026-10-19T18:10:00Z',
      },
    ];

    render(
      <MacCommandPalette
        isOpen={true}
        onClose={vi.fn()}
        onSelectTab={vi.fn()}
        onToggleTheme={vi.fn()}
        history={mockHistory}
      />
    );

    const input = screen.getByLabelText('Input pencarian perintah');

    // Act 1: Cari dengan nomor VA murni (tanpa spasi)
    fireEvent.change(input, { target: { value: '1467578347344463' } });

    // Assert 1: Ditemukan
    expect(screen.getByText(/Budi Handoko/)).toBeDefined();

    // Act 2: Cari dengan spasi di tengah nomor
    fireEvent.change(input, { target: { value: '1467 5783' } });

    // Assert 2: Masih ditemukan
    expect(screen.getByText(/Budi Handoko/)).toBeDefined();
  });
});
