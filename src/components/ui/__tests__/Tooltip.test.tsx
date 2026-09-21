/**
 * @file Tooltip.test.tsx
 * @description Unit test untuk komponen Tooltip desktop adaptif.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { Tooltip } from '../Tooltip';

describe('Tooltip Component', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should_render_children_without_tooltip_popup_initially', () => {
    // Arrange & Act
    render(
      <Tooltip content="Informasi Tombol">
        <button type="button">Action</button>
      </Tooltip>
    );

    // Assert
    expect(screen.getByText('Action')).toBeDefined();
    expect(screen.queryByRole('tooltip')).toBeNull();
  });

  it('should_show_tooltip_after_hover_delay', () => {
    // Arrange
    render(
      <Tooltip content="Tooltip Muncul" delay={150}>
        <button type="button">Hover Me</button>
      </Tooltip>
    );
    const btn = screen.getByText('Hover Me');

    // Act
    fireEvent.mouseEnter(btn);
    act(() => {
      vi.advanceTimersByTime(150);
    });

    // Assert
    const tooltip = screen.getByRole('tooltip');
    expect(tooltip).toBeDefined();
    expect(tooltip.textContent).toContain('Tooltip Muncul');
  });

  it('should_show_tooltip_after_default_delay_of_50ms', () => {
    // Arrange
    render(
      <Tooltip content="Tooltip Default Delay">
        <button type="button">Hover Default</button>
      </Tooltip>
    );
    const btn = screen.getByText('Hover Default');

    // Act
    fireEvent.mouseEnter(btn);
    act(() => {
      vi.advanceTimersByTime(50);
    });

    // Assert
    const tooltip = screen.getByRole('tooltip');
    expect(tooltip).toBeDefined();
    expect(tooltip.textContent).toContain('Tooltip Default Delay');
  });

  it('should_render_shortcut_badge_when_provided', () => {
    // Arrange
    render(
      <Tooltip content="Cari Cepat" shortcut="⌘K" delay={100}>
        <button type="button">Search</button>
      </Tooltip>
    );
    const btn = screen.getByText('Search');

    // Act
    fireEvent.mouseEnter(btn);
    act(() => {
      vi.advanceTimersByTime(100);
    });

    // Assert
    expect(screen.getByText('⌘K')).toBeDefined();
  });

  it('should_hide_tooltip_when_mouse_leaves', () => {
    // Arrange
    render(
      <Tooltip content="Hilang saat leave" delay={100}>
        <button type="button">Leave Me</button>
      </Tooltip>
    );
    const btn = screen.getByText('Leave Me');

    // Act
    fireEvent.mouseEnter(btn);
    act(() => {
      vi.advanceTimersByTime(100);
    });
    expect(screen.getByRole('tooltip')).toBeDefined();

    fireEvent.mouseLeave(btn);

    // Assert
    expect(screen.queryByRole('tooltip')).toBeNull();
  });

  it('should_hide_tooltip_when_element_is_clicked', () => {
    // Arrange
    render(
      <Tooltip content="Buka Dialog" delay={50}>
        <button type="button">Click Me</button>
      </Tooltip>
    );
    const btn = screen.getByText('Click Me');

    // Act 1: Hover hingga tooltip muncul
    fireEvent.mouseEnter(btn);
    act(() => {
      vi.advanceTimersByTime(50);
    });
    expect(screen.getByRole('tooltip')).toBeDefined();

    // Act 2: Klik tombol
    fireEvent.click(btn);

    // Assert: Tooltip langsung hilang seketika saat diklik
    expect(screen.queryByRole('tooltip')).toBeNull();
  });

  it('should_render_with_align_start_class_when_specified', () => {
    // Arrange
    render(
      <Tooltip content="Align Start" align="start" delay={50}>
        <button type="button">Traffic Light</button>
      </Tooltip>
    );
    const btn = screen.getByText('Traffic Light');

    // Act
    fireEvent.mouseEnter(btn);
    act(() => {
      vi.advanceTimersByTime(50);
    });

    // Assert
    const popup = screen.getByRole('tooltip');
    expect(popup.classList.contains('align-start')).toBe(true);
  });

  it('should_render_with_align_end_class_when_specified', () => {
    // Arrange
    render(
      <Tooltip content="Align End" align="end" delay={50}>
        <button type="button">Right Item</button>
      </Tooltip>
    );
    const btn = screen.getByText('Right Item');

    // Act
    fireEvent.mouseEnter(btn);
    act(() => {
      vi.advanceTimersByTime(50);
    });

    // Assert
    const popup = screen.getByRole('tooltip');
    expect(popup.classList.contains('align-end')).toBe(true);
  });

  it('should_hide_tooltip_when_wheel_event_occurs_on_container', () => {
    // Arrange
    render(
      <Tooltip content="Scroll dismiss" delay={50}>
        <button type="button">Scroll Target</button>
      </Tooltip>
    );
    const btn = screen.getByText('Scroll Target');

    // Act 1: Tampilkan tooltip
    fireEvent.mouseEnter(btn);
    act(() => {
      vi.advanceTimersByTime(50);
    });
    expect(screen.getByRole('tooltip')).toBeDefined();

    // Act 2: Gerakkan wheel mouse di container
    fireEvent.wheel(btn);

    // Assert: Tooltip langsung hilang
    expect(screen.queryByRole('tooltip')).toBeNull();
  });

  it('should_hide_tooltip_when_window_scroll_event_occurs', () => {
    // Arrange
    render(
      <Tooltip content="Window scroll dismiss" delay={50}>
        <button type="button">Window Scroll Target</button>
      </Tooltip>
    );
    const btn = screen.getByText('Window Scroll Target');

    // Act 1: Tampilkan tooltip
    fireEvent.mouseEnter(btn);
    act(() => {
      vi.advanceTimersByTime(50);
    });
    expect(screen.getByRole('tooltip')).toBeDefined();

    // Act 2: Trigger scroll di window
    act(() => {
      window.dispatchEvent(new Event('scroll'));
    });

    // Assert: Tooltip langsung ditutup
    expect(screen.queryByRole('tooltip')).toBeNull();
  });

  it('should_suppress_tooltip_appearance_while_scrolling', () => {
    // Arrange
    render(
      <Tooltip content="No display during scroll" delay={50}>
        <button type="button">Fast Scroll Item</button>
      </Tooltip>
    );
    const btn = screen.getByText('Fast Scroll Item');

    // Act 1: Simulasikan wheel/scroll aktif
    act(() => {
      window.dispatchEvent(new Event('wheel'));
    });

    // Act 2: Kursor masuk saat sedang aktif scrolling
    fireEvent.mouseEnter(btn);
    act(() => {
      vi.advanceTimersByTime(50);
    });

    // Assert: Tooltip tidak boleh muncul selama scrolling aktif
    expect(screen.queryByRole('tooltip')).toBeNull();

    // Act 3: Tunggu scrolling selesai (150ms timeout)
    act(() => {
      vi.advanceTimersByTime(160);
    });

    // Act 4: Mouse hover setelah scroll selesai
    fireEvent.mouseEnter(btn);
    act(() => {
      vi.advanceTimersByTime(50);
    });

    // Assert: Tooltip muncul normal kembali
    expect(screen.getByRole('tooltip')).toBeDefined();
  });
});
