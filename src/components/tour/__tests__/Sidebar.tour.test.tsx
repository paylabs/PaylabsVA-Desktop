/**
 * @file Sidebar.tour.test.tsx
 * @description Unit test untuk verifikasi tombol "Take a Tour" dan navigasi "Panduan"
 *   di komponen Sidebar setelah penggantian menu "Tauri v2 Desktop".
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Sidebar } from '../../layout/Sidebar';

describe('Sidebar — Take a Tour & Panduan Navigation', () => {
  it('should_render_take_a_tour_button_instead_of_tauri_v2', () => {
    // Arrange
    render(
      <Sidebar
        activeTab="va-generator"
        onSelectTab={vi.fn()}
        isCollapsed={false}
        onToggleCollapse={vi.fn()}
        onStartTour={vi.fn()}
      />
    );

    // Act
    const tourButton = screen.getByLabelText('Take a Tour');

    // Assert
    expect(tourButton).toBeInTheDocument();
    expect(screen.queryByText('Tauri v2 Desktop')).not.toBeInTheDocument();
  });

  it('should_call_onStartTour_when_take_a_tour_button_is_clicked', () => {
    // Arrange
    const mockOnStartTour = vi.fn();
    render(
      <Sidebar
        activeTab="va-generator"
        onSelectTab={vi.fn()}
        isCollapsed={false}
        onToggleCollapse={vi.fn()}
        onStartTour={mockOnStartTour}
      />
    );

    // Act
    const tourButton = screen.getByLabelText('Take a Tour');
    fireEvent.click(tourButton);

    // Assert
    expect(mockOnStartTour).toHaveBeenCalledTimes(1);
  });

  it('should_render_panduan_nav_item_in_sidebar', () => {
    // Arrange
    render(
      <Sidebar
        activeTab="va-generator"
        onSelectTab={vi.fn()}
        isCollapsed={false}
        onToggleCollapse={vi.fn()}
      />
    );

    // Act
    const panduanButton = screen.getByLabelText('Panduan');

    // Assert
    expect(panduanButton).toBeInTheDocument();
  });

  it('should_call_onSelectTab_with_user_manual_when_panduan_is_clicked', () => {
    // Arrange
    const mockOnSelectTab = vi.fn();
    render(
      <Sidebar
        activeTab="va-generator"
        onSelectTab={mockOnSelectTab}
        isCollapsed={false}
        onToggleCollapse={vi.fn()}
      />
    );

    // Act
    const panduanButton = screen.getByLabelText('Panduan');
    fireEvent.click(panduanButton);

    // Assert
    expect(mockOnSelectTab).toHaveBeenCalledWith('user-manual');
  });

  it('should_show_tooltip_for_tour_button_when_sidebar_is_collapsed', () => {
    // Arrange
    render(
      <Sidebar
        activeTab="va-generator"
        onSelectTab={vi.fn()}
        isCollapsed={true}
        onToggleCollapse={vi.fn()}
        onStartTour={vi.fn()}
      />
    );

    // Act
    const tourButton = screen.getByLabelText('Take a Tour');

    // Assert — tombol tetap ada meskipun collapsed
    expect(tourButton).toBeInTheDocument();
  });
});
