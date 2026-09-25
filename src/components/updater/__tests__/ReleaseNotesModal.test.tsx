/**
 * @file ReleaseNotesModal.test.tsx
 * @description Unit test untuk komponen dialog ReleaseNotesModal.
 */

import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ReleaseNotesModal } from '../ReleaseNotesModal';

describe('ReleaseNotesModal Component', () => {
  const mockUpdateInfo = {
    version: '0.1.3',
    date: '2026-09-25T09:11:15Z',
    notes: '### Fitur Baru\n- Dukungan Bank Mandiri Virtual Account (`StaticMandiriVA`)',
  };

  it('should_not_render_content_when_isOpen_is_false', () => {
    // Arrange & Act
    const { container } = render(
      <ReleaseNotesModal
        isOpen={false}
        onClose={vi.fn()}
        updateInfo={mockUpdateInfo}
        onStartDownload={vi.fn()}
      />
    );

    // Assert
    expect(container.firstChild).toBeNull();
  });

  it('should_render_version_badge_and_markdown_notes_when_open', () => {
    // Arrange & Act
    render(
      <ReleaseNotesModal
        isOpen={true}
        onClose={vi.fn()}
        updateInfo={mockUpdateInfo}
        onStartDownload={vi.fn()}
      />
    );

    // Assert
    expect(screen.getByText('Catatan Rilis Pembaruan')).toBeDefined();
    expect(screen.getByText('Versi 0.1.3')).toBeDefined();
    expect(screen.getByText('Fitur Baru')).toBeDefined();
    expect(screen.getByText(/Dukungan Bank Mandiri Virtual Account/i)).toBeDefined();
  });

  it('should_trigger_onStartDownload_and_onClose_when_download_button_is_clicked', () => {
    // Arrange
    const handleClose = vi.fn();
    const handleStartDownload = vi.fn();

    render(
      <ReleaseNotesModal
        isOpen={true}
        onClose={handleClose}
        updateInfo={mockUpdateInfo}
        onStartDownload={handleStartDownload}
      />
    );

    // Act
    const downloadBtn = screen.getByRole('button', { name: /Unduh & Pasang Sekarang/i });
    fireEvent.click(downloadBtn);

    // Assert
    expect(handleStartDownload).toHaveBeenCalledTimes(1);
    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it('should_trigger_onClose_when_cancel_button_is_clicked', () => {
    // Arrange
    const handleClose = vi.fn();

    render(
      <ReleaseNotesModal
        isOpen={true}
        onClose={handleClose}
        updateInfo={mockUpdateInfo}
        onStartDownload={vi.fn()}
      />
    );

    // Act
    const cancelBtn = screen.getByRole('button', { name: /Nanti Saja/i });
    fireEvent.click(cancelBtn);

    // Assert
    expect(handleClose).toHaveBeenCalledTimes(1);
  });
});
