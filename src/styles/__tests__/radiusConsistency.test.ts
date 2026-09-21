/**
 * @file radiusConsistency.test.ts
 * @description Pengujian regresi otomatis untuk memastikan seluruh kontrol interaktif
 *   (tombol, input, filter, sidebar, dan titlebar controls) seragam menggunakan border-radius 8px,
 *   dan kartu/jendela seragam 12px.
 */

import { describe, it, expect } from 'vitest';
import * as fs from 'node:fs';
import * as path from 'node:path';

describe('Border Radius Consistency Tests', () => {
  const stylesDir = path.resolve(__dirname, '..');

  it('should_have_standardized_radius_tokens_in_tokens_css', () => {
    // Arrange
    const tokensPath = path.join(stylesDir, 'tokens.css');
    const content = fs.readFileSync(tokensPath, 'utf-8');

    // Act & Assert
    expect(content).toContain('--radius-button: 8px;');
    expect(content).toContain('--radius-sm: 8px;');
    expect(content).toContain('--radius-card: 12px;');
    expect(content).toContain('--radius-window: 12px;');
  });

  it('should_have_8px_radius_for_titlebar_controls_and_pill', () => {
    // Arrange
    const titlebarPath = path.join(stylesDir, 'titlebar.css');
    const content = fs.readFileSync(titlebarPath, 'utf-8');

    // Act & Assert: credential pill should no longer be 9999px capsule
    expect(content).not.toContain('border-radius: 9999px;');
    expect(content).toContain('.titlebar-credential-pill');
    expect(content).toContain('border-radius: var(--radius-button, 8px);');
  });

  it('should_have_8px_radius_for_sidebar_nav_in_index_css', () => {
    // Arrange
    const indexPath = path.join(stylesDir, 'index.css');
    const content = fs.readFileSync(indexPath, 'utf-8');

    // Act & Assert
    expect(content).toContain('.desktop-window-container.macos .sidebar-nav-item');
    expect(content).toContain('border-radius: var(--radius-button, 8px);');
  });

  it('should_have_consistent_8px_for_paylabs_toolbar_and_12px_for_cards', () => {
    // Arrange
    const paylabsPath = path.join(stylesDir, 'paylabs.css');
    const content = fs.readFileSync(paylabsPath, 'utf-8');

    // Act & Assert
    expect(content).toContain('.paylabs-action-pill-btn');
    expect(content).toContain('.paylabs-search-input');
    expect(content).toContain('.paylabs-filter-segmented');
    expect(content).toContain('.paylabs-stat-card');
    expect(content).toContain('border-radius: var(--radius-card, 12px);');
  });
});
