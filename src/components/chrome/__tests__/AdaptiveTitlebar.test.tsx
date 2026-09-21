/**
 * @file AdaptiveTitlebar.test.tsx
 * @description Unit test untuk komponen AdaptiveTitlebar macOS native dan tombol kredensial Paylabs.
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { AdaptiveTitlebar } from '../AdaptiveTitlebar';

describe('AdaptiveTitlebar', () => {
  it('should_render_mac_traffic_lights_and_handle_close', () => {
    // Arrange
    const handleClose = vi.fn();
    const handleMinimize = vi.fn();
    const handleToggleMaximize = vi.fn();

    // Act
    render(
      <AdaptiveTitlebar
        platform="macos"
        isMaximized={false}
        title="Paylabs Test"
        onClose={handleClose}
        onMinimize={handleMinimize}
        onToggleMaximize={handleToggleMaximize}
      />
    );

    // Assert
    const macCloseBtn = screen.getByLabelText('Tutup Window');
    expect(macCloseBtn).toBeDefined();

    fireEvent.click(macCloseBtn);
    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it('should_render_credential_pill_and_trigger_onOpenSettings_when_clicked', () => {
    // Arrange
    const handleOpenSettings = vi.fn();
    const statusMock = {
      environment: 'SIT',
      baseUrl: 'https://sit-pay.paylabs.co.id',
      configured: true,
      production: false,
    };

    // Act
    render(
      <AdaptiveTitlebar
        isMaximized={false}
        title="Paylabs Test"
        status={statusMock}
        onClose={vi.fn()}
        onMinimize={vi.fn()}
        onToggleMaximize={vi.fn()}
        onOpenSettings={handleOpenSettings}
      />
    );

    // Assert
    const credPill = screen.getByLabelText('Pengaturan Kredensial Paylabs');
    expect(credPill).toBeDefined();
    expect(screen.getByText('SIT')).toBeDefined();

    fireEvent.click(credPill);
    expect(handleOpenSettings).toHaveBeenCalledTimes(1);
  });

  it('should_trigger_toggle_maximize_when_titlebar_is_double_clicked', () => {
    // Arrange
    const handleToggleMaximize = vi.fn();

    // Act
    render(
      <AdaptiveTitlebar
        isMaximized={false}
        title="Paylabs Test"
        onClose={vi.fn()}
        onMinimize={vi.fn()}
        onToggleMaximize={handleToggleMaximize}
      />
    );

    // Assert
    const titlebar = screen.getByTestId('adaptive-titlebar');
    fireEvent.doubleClick(titlebar);
    expect(handleToggleMaximize).toHaveBeenCalledTimes(1);
  });

  it('should_trigger_onToggleTheme_when_theme_toggle_button_is_clicked', () => {
    // Arrange
    const handleToggleTheme = vi.fn();

    // Act
    render(
      <AdaptiveTitlebar
        isMaximized={false}
        title="Paylabs Test"
        theme="dark"
        onClose={vi.fn()}
        onMinimize={vi.fn()}
        onToggleMaximize={vi.fn()}
        onToggleTheme={handleToggleTheme}
      />
    );

    // Assert
    const themeBtn = screen.getByLabelText('Toggle Tema');
    expect(themeBtn).toBeDefined();

    fireEvent.click(themeBtn);
    expect(handleToggleTheme).toHaveBeenCalledTimes(1);
  });
});
