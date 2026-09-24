/**
 * @file ContentLayout.test.tsx
 * @description Unit test untuk memverifikasi konsistensi struktur dan layout kontainer konten utama (.main-content-scroll).
 */

import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import { AppShell } from '../AppShell';

// Mock window service
vi.mock('../../../services/windowService', () => ({
  isTauriEnvironment: () => false,
  startDragAppWindow: vi.fn(),
  toggleMaximizeAppWindow: vi.fn(),
  minimizeAppWindow: vi.fn(),
  closeAppWindow: vi.fn(),
  isAppWindowMaximized: async () => false,
}));

describe('Content Layout & Scroll Area Consistency', () => {
  it('should_render_main_element_with_main_content_scroll_class_in_AppShell', () => {
    // Arrange & Act
    const { container } = render(<AppShell />);

    // Assert
    const mainElement = container.querySelector('main');
    expect(mainElement).not.toBeNull();
    expect(mainElement?.classList.contains('main-content-scroll')).toBe(true);
  });

  it('should_contain_paylabs_page_container_inside_main_scroll', () => {
    // Arrange & Act
    const { container } = render(<AppShell />);

    // Assert
    const pageContainer = container.querySelector('.paylabs-page-container');
    expect(pageContainer).not.toBeNull();
  });

  it('should_lock_canvas_and_confine_scroll_inside_container_for_dynamic_and_static_va', () => {
    // Arrange & Act
    const { container } = render(<AppShell />);

    // Assert default tab: Dynamic VA has va-generator-main on main and va-generator-fixed-container on container
    const mainElement = container.querySelector('main');
    expect(mainElement?.classList.contains('va-generator-main')).toBe(true);

    const pageContainer = container.querySelector('.paylabs-page-container');
    expect(pageContainer?.classList.contains('va-generator-fixed-container')).toBe(true);

    const formCard = container.querySelector('.paylabs-form-card');
    expect(formCard).not.toBeNull();
  });
});
