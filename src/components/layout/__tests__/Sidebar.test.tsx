/**
 * @file Sidebar.test.tsx
 * @description Unit test untuk komponen Sidebar (pengujian navigasi tab dan mode responsif/collapsible).
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { Sidebar } from '../Sidebar';

describe('Sidebar Component', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should_render_all_nav_items_when_expanded', () => {
    // Arrange
    const handleSelectTab = vi.fn();

    // Act
    render(
      <Sidebar
        activeTab="va-generator"
        onSelectTab={handleSelectTab}
        isCollapsed={false}
      />
    );

    // Assert
    expect(screen.getByText('Generate VA')).toBeDefined();
    expect(screen.getByText('Riwayat VA')).toBeDefined();
    expect(screen.getByText('Navigation')).toBeDefined();
  });

  it('should_apply_collapsed_class_when_isCollapsed_is_true', () => {
    // Arrange
    const handleSelectTab = vi.fn();

    // Act
    const { container } = render(
      <Sidebar
        activeTab="va-generator"
        onSelectTab={handleSelectTab}
        isCollapsed={true}
      />
    );


    // Assert
    const aside = container.querySelector('aside');
    expect(aside?.classList.contains('is-collapsed')).toBe(true);
  });

  it('should_call_onToggleCollapse_when_toggle_button_is_clicked', () => {
    // Arrange
    const handleSelectTab = vi.fn();
    const handleToggleCollapse = vi.fn();

    // Act
    render(
      <Sidebar
        activeTab="va-generator"
        onSelectTab={handleSelectTab}
        isCollapsed={false}
        onToggleCollapse={handleToggleCollapse}
      />
    );


    const toggleButton = screen.getByLabelText('Ciutkan Sidebar');
    fireEvent.click(toggleButton);

    // Assert
    expect(handleToggleCollapse).toHaveBeenCalledTimes(1);
  });

  it('should_call_onSelectTab_when_nav_item_is_clicked', () => {
    // Arrange
    const handleSelectTab = vi.fn();

    // Act
    render(
      <Sidebar
        activeTab="va-generator"
        onSelectTab={handleSelectTab}
        isCollapsed={false}
      />
    );

    const historyButton = screen.getByText('Riwayat VA');
    fireEvent.click(historyButton);

    // Assert
    expect(handleSelectTab).toHaveBeenCalledWith('va-history');
  });

  it('should_show_tooltip_when_hovering_toggle_button', () => {
    // Arrange
    const handleToggleCollapse = vi.fn();
    render(
      <Sidebar
        activeTab="va-generator"
        onSelectTab={vi.fn()}
        isCollapsed={true}
        onToggleCollapse={handleToggleCollapse}
      />
    );

    const toggleButton = screen.getByLabelText('Perluas Sidebar');

    // Act
    fireEvent.mouseEnter(toggleButton);
    act(() => {
      vi.advanceTimersByTime(150);
    });

    // Assert
    const tooltip = screen.getByRole('tooltip');
    expect(tooltip).toBeDefined();
    expect(tooltip.textContent).toContain('Perluas Sidebar');
  });

  it('should_show_tooltip_when_hovering_nav_item_in_collapsed_mode', () => {
    // Arrange
    render(
      <Sidebar
        activeTab="va-generator"
        onSelectTab={vi.fn()}
        isCollapsed={true}
      />
    );

    const generateVaButton = screen.getByLabelText('Generate VA');

    // Act
    fireEvent.mouseEnter(generateVaButton);
    act(() => {
      vi.advanceTimersByTime(150);
    });

    // Assert
    const tooltip = screen.getByRole('tooltip');
    expect(tooltip).toBeDefined();
    expect(tooltip.textContent).toContain('Generate VA');
  });
});

