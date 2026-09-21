/**
 * @file scrollbarSeamless.test.ts
 * @description Pengujian regresi otomatis untuk memastikan seluruh aturan scrollbar seamless
 *   (track transparan, corner transparan, tombol stepper disembunyikan, dan thumb 9999px)
 *   terkonfigurasi dengan benar di scrollbar.css dan tokens.css.
 */

import { describe, it, expect } from 'vitest';
import * as fs from 'node:fs';
import * as path from 'node:path';

describe('Seamless Scrollbar Configuration Tests', () => {
  const stylesDir = path.resolve(__dirname, '..');

  it('should_have_transparent_track_and_corner_in_scrollbar_css', () => {
    // Arrange
    const scrollbarPath = path.join(stylesDir, 'scrollbar.css');
    const content = fs.readFileSync(scrollbarPath, 'utf-8');

    // Act & Assert
    expect(content).toContain('::-webkit-scrollbar-track');
    expect(content).toContain('background: transparent !important;');
    expect(content).toContain('::-webkit-scrollbar-corner');
    expect(content).toContain('::-webkit-scrollbar-button');
    expect(content).toContain('display: none !important;');
  });

  it('should_have_capsule_border_radius_for_thumb_in_scrollbar_css', () => {
    // Arrange
    const scrollbarPath = path.join(stylesDir, 'scrollbar.css');
    const content = fs.readFileSync(scrollbarPath, 'utf-8');

    // Act & Assert
    expect(content).toContain('::-webkit-scrollbar-thumb');
    expect(content).toContain('border-radius: 9999px;');
    expect(content).toContain('background-clip: content-box;');
  });

  it('should_have_6px_scrollbar_width_tokens_in_tokens_css', () => {
    // Arrange
    const tokensPath = path.join(stylesDir, 'tokens.css');
    const content = fs.readFileSync(tokensPath, 'utf-8');

    // Act & Assert
    expect(content).toContain('--scrollbar-width: 6px;');
    expect(content).toContain('--scrollbar-thumb:');
    expect(content).toContain('--scrollbar-thumb-hover:');
  });
});
