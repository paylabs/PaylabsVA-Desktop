/**
 * @file tourSteps.test.ts
 * @description Unit test untuk validasi definisi langkah-langkah tour onboarding.
 *   Memastikan setiap step memiliki target element, popover title profesional bebas emoji,
 *   dan mencakup flow Generate VA serta Riwayat VA.
 */

import { describe, it, expect } from 'vitest';
import { TOUR_STEPS, TOUR_COMPLETED_STORAGE_KEY } from '../tourSteps';

describe('Tour Steps Definition', () => {
  it('should_have_at_least_one_step_defined', () => {
    // Arrange & Act — steps sudah didefinisikan sebagai konstanta
    // Assert
    expect(TOUR_STEPS.length).toBeGreaterThan(0);
  });

  it('should_have_valid_element_selector_for_each_step', () => {
    // Arrange
    const validSelectorPattern = /^[.#][a-zA-Z][\w-]*$/;

    // Act & Assert
    TOUR_STEPS.forEach((step, index) => {
      expect(
        step.element,
        `Step ${index + 1} harus memiliki CSS selector yang valid`
      ).toBeDefined();
      expect(
        typeof step.element === 'string' && validSelectorPattern.test(step.element),
        `Step ${index + 1} selector "${step.element}" harus dimulai dengan . atau # diikuti karakter valid`
      ).toBe(true);
    });
  });

  it('should_have_title_and_description_for_each_step_popover', () => {
    // Arrange & Act & Assert
    TOUR_STEPS.forEach((step, index) => {
      expect(
        step.popover?.title,
        `Step ${index + 1} harus memiliki popover title`
      ).toBeDefined();
      expect(
        step.popover?.description,
        `Step ${index + 1} harus memiliki popover description`
      ).toBeDefined();
      expect(
        (step.popover?.title as string).length,
        `Step ${index + 1} title tidak boleh kosong`
      ).toBeGreaterThan(0);
      expect(
        (step.popover?.description as string).length,
        `Step ${index + 1} description tidak boleh kosong`
      ).toBeGreaterThan(0);
    });
  });

  it('should_not_have_duplicate_element_selectors', () => {
    // Arrange
    const selectors = TOUR_STEPS.map((step) => step.element);

    // Act
    const uniqueSelectors = new Set(selectors);

    // Assert
    expect(uniqueSelectors.size).toBe(selectors.length);
  });

  it('should_have_correct_localStorage_key_constant', () => {
    // Assert
    expect(TOUR_COMPLETED_STORAGE_KEY).toBe('antigravity_tour_completed');
  });

  it('should_have_fourteen_steps_covering_all_ui_areas', () => {
    // Assert: 14 langkah mencakup Generator VA, Static VA, dan Riwayat VA
    expect(TOUR_STEPS).toHaveLength(14);
  });

  it('should_not_contain_informal_emojis_in_step_titles', () => {
    // Regex deteksi emoji Unicode
    const emojiRegex = /[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]/u;

    TOUR_STEPS.forEach((step, index) => {
      const title = step.popover?.title as string;
      expect(
        emojiRegex.test(title),
        `Step ${index + 1} title "${title}" tidak boleh mengandung emoji informal`
      ).toBe(false);
    });
  });

  it('should_cover_both_generator_and_history_tabs', () => {
    const tabs = TOUR_STEPS.map((step) => step.targetTab).filter(Boolean);
    expect(tabs).toContain('va-generator');
    expect(tabs).toContain('va-history');
  });

  it('should_have_static_va_nav_step_defined', () => {
    expect(TOUR_STEPS[5].element).toBe('#sidebar-nav-static-va');
    expect(TOUR_STEPS[5].popover?.title).toContain('Static VA');
  });

  it('should_have_advanceOnClick_on_history_nav_step_for_seamless_tab_transition', () => {
    // Step 10 adalah tombol Riwayat VA di sidebar
    expect(TOUR_STEPS[9].element).toBe('#sidebar-nav-va-history');
    expect(TOUR_STEPS[9].advanceOnClick).toBe(true);
  });

  it('should_have_correct_target_ids_for_history_steps', () => {
    expect(TOUR_STEPS[10].element).toBe('#va-history-stats');
    expect(TOUR_STEPS[11].element).toBe('#va-history-toolbar');
    expect(TOUR_STEPS[12].element).toBe('#va-history-table');
  });
});
