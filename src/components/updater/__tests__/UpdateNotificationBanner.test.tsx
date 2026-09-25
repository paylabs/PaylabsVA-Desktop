/**
 * @file UpdateNotificationBanner.test.tsx
 * @description Unit test untuk komponen UI UpdateNotificationBanner bergaya Apple HIG.
 */

import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { UpdateNotificationBanner } from '../UpdateNotificationBanner';

describe('UpdateNotificationBanner Component', () => {
  it('should_not_render_when_isVisible_is_false', () => {
    // Arrange & Act
    const { container } = render(
      <UpdateNotificationBanner
        status="available"
        updateInfo={{ version: '0.1.2' }}
        progress={0}
        errorMessage={null}
        isVisible={false}
        onDismiss={vi.fn()}
        onStartDownload={vi.fn()}
        onRelaunch={vi.fn()}
      />
    );

    // Assert
    expect(container.firstChild).toBeNull();
  });

  it('should_render_available_update_and_trigger_download_on_click', () => {
    // Arrange
    const handleDownload = vi.fn();
    const handleViewNotes = vi.fn();
    render(
      <UpdateNotificationBanner
        status="available"
        updateInfo={{ version: '0.1.3', notes: '### Fitur Baru\n- Peningkatan stabilitas' }}
        progress={0}
        errorMessage={null}
        isVisible={true}
        onDismiss={vi.fn()}
        onStartDownload={handleDownload}
        onRelaunch={vi.fn()}
        onViewReleaseNotes={handleViewNotes}
      />
    );

    // Assert
    expect(screen.getByText('Versi 0.1.3 Tersedia')).toBeDefined();
    expect(screen.getByText(/Tersedia pembaruan rilis baru dengan fitur dan peningkatan stabilitas/i)).toBeDefined();

    // Act: Klik Catatan Rilis
    const notesBtn = screen.getByRole('button', { name: /Catatan Rilis/i });
    fireEvent.click(notesBtn);
    expect(handleViewNotes).toHaveBeenCalledTimes(1);

    // Act: Klik Unduh & Pasang
    const downloadBtn = screen.getByRole('button', { name: /Unduh & Pasang/i });
    fireEvent.click(downloadBtn);

    // Assert
    expect(handleDownload).toHaveBeenCalledTimes(1);
  });

  it('should_render_download_progress_when_status_is_downloading', () => {
    // Arrange & Act
    render(
      <UpdateNotificationBanner
        status="downloading"
        updateInfo={{ version: '0.1.2' }}
        progress={65}
        errorMessage={null}
        isVisible={true}
        onDismiss={vi.fn()}
        onStartDownload={vi.fn()}
        onRelaunch={vi.fn()}
      />
    );

    // Assert
    expect(screen.getByText('Mengunduh Pembaruan...')).toBeDefined();
    expect(screen.getByText('65%')).toBeDefined();
  });

  it('should_render_ready_status_and_trigger_relaunch_on_click', () => {
    // Arrange
    const handleRelaunch = vi.fn();
    render(
      <UpdateNotificationBanner
        status="ready"
        updateInfo={{ version: '0.1.2' }}
        progress={100}
        errorMessage={null}
        isVisible={true}
        onDismiss={vi.fn()}
        onStartDownload={vi.fn()}
        onRelaunch={handleRelaunch}
      />
    );

    // Assert
    expect(screen.getByText('Pembaruan Telah Siap')).toBeDefined();

    // Act
    const relaunchBtn = screen.getByRole('button', { name: /Mulai Ulang Sekarang/i });
    fireEvent.click(relaunchBtn);

    // Assert
    expect(handleRelaunch).toHaveBeenCalledTimes(1);
  });

  it('should_trigger_onDismiss_when_close_button_is_clicked', () => {
    // Arrange
    const handleDismiss = vi.fn();
    render(
      <UpdateNotificationBanner
        status="available"
        updateInfo={{ version: '0.1.2' }}
        progress={0}
        errorMessage={null}
        isVisible={true}
        onDismiss={handleDismiss}
        onStartDownload={vi.fn()}
        onRelaunch={vi.fn()}
      />
    );

    // Act
    const closeBtn = screen.getByRole('button', { name: /Tutup banner pembaruan/i });
    fireEvent.click(closeBtn);

    // Assert
    expect(handleDismiss).toHaveBeenCalledTimes(1);
  });
});
