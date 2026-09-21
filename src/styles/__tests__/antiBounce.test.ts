/**
 * @file antiBounce.test.ts
 * @description Pengujian regresi otomatis untuk memastikan seluruh modul CSS
 *   telah mengonfigurasi `overscroll-behavior: none` dan menonaktifkan elastic bounce.
 */

import { describe, it, expect } from 'vitest';
import * as fs from 'node:fs';
import * as path from 'node:path';

describe('Anti-Bounce Scroll Configuration Tests', () => {
  const stylesDir = path.resolve(__dirname, '..');

  it('should_have_overscroll_behavior_none_on_root_in_index_css', () => {
    // Arrange
    const indexPath = path.join(stylesDir, 'index.css');
    const content = fs.readFileSync(indexPath, 'utf-8');

    // Act & Assert
    expect(content).toContain('overscroll-behavior: none;');
  });

  it('should_have_overscroll_behavior_none_on_scrollbar_css_for_all_elements', () => {
    // Arrange
    const scrollbarPath = path.join(stylesDir, 'scrollbar.css');
    const content = fs.readFileSync(scrollbarPath, 'utf-8');

    // Act & Assert
    expect(content).toContain('overscroll-behavior: none;');
  });

  it('should_have_overscroll_behavior_none_on_main_content_scroll_in_responsive_css', () => {
    // Arrange
    const responsivePath = path.join(stylesDir, 'responsive.css');
    const content = fs.readFileSync(responsivePath, 'utf-8');

    // Act & Assert
    expect(content).toContain('.main-content-scroll');
    expect(content).toContain('overscroll-behavior: none;');
  });

  it('should_not_have_webkit_overflow_scrolling_touch_in_paylabs_css', () => {
    // Arrange
    const paylabsPath = path.join(stylesDir, 'paylabs.css');
    const content = fs.readFileSync(paylabsPath, 'utf-8');

    // Act & Assert
    expect(content).not.toContain('-webkit-overflow-scrolling: touch;');
    expect(content).toContain('overscroll-behavior: none;');
  });

  it('should_have_overscroll_behavior_none_in_modal_dialog_css', () => {
    // Arrange
    const modalPath = path.join(stylesDir, 'modalDialog.css');
    const content = fs.readFileSync(modalPath, 'utf-8');

    // Act & Assert
    expect(content).toContain('overscroll-behavior: none;');
  });
});
