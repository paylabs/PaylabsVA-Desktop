/**
 * @file MacDetailPanel.test.tsx
 * @description Unit test untuk komponen MacDetailPanel (Apple HIG slide-out inspector).
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MacDetailPanel } from '../MacDetailPanel';

describe('MacDetailPanel Component (Apple HIG)', () => {
  it('should_not_render_when_isOpen_is_false', () => {
    // Arrange & Act
    render(
      <MacDetailPanel
        isOpen={false}
        title="Button Spec"
        description="Detail deskripsi"
        onClose={vi.fn()}
      />
    );

    // Assert
    expect(screen.queryByRole('complementary')).toBeNull();
  });

  it('should_render_content_and_tokens_when_isOpen_is_true', () => {
    // Arrange
    const tokens = [
      { label: '--radius', value: '8px' },
      { label: '--accent', value: '#696cff' },
    ];

    // Act
    render(
      <MacDetailPanel
        isOpen={true}
        title="Button Component Spec"
        subtitle="Sneat Spec"
        description="Deskripsi detail spesifikasi token"
        codeSnippet="const Button = styled.button``;"
        tokens={tokens}
        onClose={vi.fn()}
      />
    );

    // Assert
    expect(screen.getByRole('complementary')).toBeDefined();
    expect(screen.getByText('Button Component Spec')).toBeDefined();
    expect(screen.getByText('Sneat Spec')).toBeDefined();
    expect(screen.getByText('--radius')).toBeDefined();
    expect(screen.getByText('8px')).toBeDefined();
  });

  it('should_trigger_onClose_when_close_button_clicked', () => {
    // Arrange
    const handleClose = vi.fn();
    render(
      <MacDetailPanel
        isOpen={true}
        title="Inspector"
        description="Testing close button"
        onClose={handleClose}
      />
    );

    // Act
    const closeBtn = screen.getByLabelText('Tutup panel detail');
    fireEvent.click(closeBtn);

    // Assert
    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it('should_trigger_onCopySnippet_when_copy_button_clicked', () => {
    // Arrange
    const handleCopy = vi.fn();
    render(
      <MacDetailPanel
        isOpen={true}
        title="Snippet Inspector"
        description="Testing snippet copy"
        codeSnippet="export const theme = 'macos';"
        onClose={vi.fn()}
        onCopySnippet={handleCopy}
      />
    );

    // Act
    const copyBtn = screen.getByText('Salin Kode');
    fireEvent.click(copyBtn);

    // Assert
    expect(handleCopy).toHaveBeenCalledWith("export const theme = 'macos';");
  });

  it('should_trigger_onClose_when_Escape_key_pressed', () => {
    // Arrange
    const handleClose = vi.fn();
    render(
      <MacDetailPanel
        isOpen={true}
        title="Escape test"
        description="Testing escape key"
        onClose={handleClose}
      />
    );

    // Act
    fireEvent.keyDown(window, { key: 'Escape' });

    // Assert
    expect(handleClose).toHaveBeenCalledTimes(1);
  });
});
