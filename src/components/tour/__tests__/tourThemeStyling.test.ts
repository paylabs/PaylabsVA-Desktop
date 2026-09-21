/**
 * @file tourThemeStyling.test.ts
 * @description Unit test untuk memverifikasi konsistensi tema, kontras warna,
 *   dan integrasi selector Dark/Light Mode pada tourStyles.css dan tokens.css.
 */

import { describe, it, expect } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';

describe('Tour Theme Styling & Contrast Verification', () => {
  const tourStylesPath = path.resolve(__dirname, '../tourStyles.css');
  const tokensPath = path.resolve(__dirname, '../../../styles/tokens.css');

  it('should_contain_solid_backgrounds_for_both_dark_and_light_modes_in_tourStyles', () => {
    // Arrange
    const tourStylesContent = fs.readFileSync(tourStylesPath, 'utf-8');

    // Assert: Dark mode popover background solid (#1c2331 - elevated dark surface)
    expect(tourStylesContent).toContain('#1c2331 !important');

    // Assert: Light mode popover background solid white (#ffffff)
    expect(tourStylesContent).toContain('[data-theme="light"] .driver-popover');
    expect(tourStylesContent).toContain('#ffffff !important');
  });

  it('should_contain_high_contrast_text_colors_for_both_modes', () => {
    // Arrange
    const tourStylesContent = fs.readFileSync(tourStylesPath, 'utf-8');

    // Assert: Dark mode title color (#ffffff) and description (#e2e8f0)
    expect(tourStylesContent).toContain('.driver-popover-title');
    expect(tourStylesContent).toContain('#ffffff !important');
    expect(tourStylesContent).toContain('#e2e8f0 !important');

    // Assert: Light mode title color (#0f172a - dark slate)
    expect(tourStylesContent).toContain('[data-theme="light"] .driver-popover-title');
    expect(tourStylesContent).toContain('#0f172a !important');

    // Assert: Light mode description color (#334155 - readable dark grey)
    expect(tourStylesContent).toContain('[data-theme="light"] .driver-popover-description');
    expect(tourStylesContent).toContain('#334155 !important');
  });

  it('should_have_proper_arrow_border_colors_for_both_themes', () => {
    // Arrange
    const tourStylesContent = fs.readFileSync(tourStylesPath, 'utf-8');

    // Assert: Dark mode arrows use elevated dark background color (#1c2331)
    expect(tourStylesContent).toContain('.driver-popover-arrow-side-top');
    expect(tourStylesContent).toContain('border-top-color: #1c2331 !important');

    // Assert: Light mode arrows use white background color
    expect(tourStylesContent).toContain('[data-theme="light"] .driver-popover-arrow-side-top');
    expect(tourStylesContent).toContain('border-top-color: #ffffff !important');
  });

  it('should_have_surface_aliases_defined_in_tokens_css', () => {
    // Arrange
    const tokensContent = fs.readFileSync(tokensPath, 'utf-8');

    // Assert: :root defines --bg-primary and --bg-secondary aliases
    expect(tokensContent).toContain('--bg-primary: var(--bg-surface-1);');
    expect(tokensContent).toContain('--bg-secondary: var(--bg-surface-2);');
  });

  it('should_support_explicit_data_theme_dark_selectors', () => {
    // Arrange
    const tourStylesContent = fs.readFileSync(tourStylesPath, 'utf-8');

    // Assert: explicit dark theme support
    expect(tourStylesContent).toContain('[data-theme="dark"] .driver-popover');
    expect(tourStylesContent).toContain('[data-theme="dark"] .driver-popover-title');
  });

  it('should_have_zero_shadow_on_popovers_to_prevent_window_overlap', () => {
    // Arrange
    const tourStylesContent = fs.readFileSync(tourStylesPath, 'utf-8');

    // Assert: Zero-shadow popovers to prevent overlapping window outline (GEMINI.md rule 6)
    expect(tourStylesContent).toContain('box-shadow: none !important');
  });

  it('should_clip_overlay_to_match_window_rounded_corners', () => {
    // Arrange
    const tourStylesContent = fs.readFileSync(tourStylesPath, 'utf-8');

    // Assert: Overlay backdrop clipped to window 12px border radius
    expect(tourStylesContent).toContain('clip-path: inset(1px round var(--radius-window, 12px)) !important');
    expect(tourStylesContent).toContain('border-radius: var(--radius-window, 12px) !important');
  });
});
