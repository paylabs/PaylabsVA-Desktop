/**
 * @file bankFormatter.test.ts
 * @description Unit tests untuk utilitas penyederhanaan nama bank formatBankName.
 */

import { describe, it, expect } from 'vitest';
import { formatBankName } from '../bankFormatter';

describe('formatBankName', () => {
  it('should_return_bca_when_name_contains_bank_central_asia', () => {
    // Arrange
    const input = 'BCA (Bank Central Asia)';

    // Act
    const result = formatBankName(input);

    // Assert
    expect(result).toBe('BCA');
  });

  it('should_return_bni_when_name_contains_bank_negara_indonesia', () => {
    // Arrange
    const input = 'BNI (Bank Negara Indonesia)';

    // Act
    const result = formatBankName(input);

    // Assert
    expect(result).toBe('BNI');
  });

  it('should_return_bri_when_name_contains_bank_rakyat_indonesia', () => {
    // Arrange
    const input = 'BRI (Bank Rakyat Indonesia)';

    // Act
    const result = formatBankName(input);

    // Assert
    expect(result).toBe('BRI');
  });

  it('should_return_mandiri_when_name_is_bank_mandiri', () => {
    // Arrange
    const input = 'Bank Mandiri';

    // Act
    const result = formatBankName(input);

    // Assert
    expect(result).toBe('Mandiri');
  });

  it('should_return_bsi_when_name_is_bank_syariah_indonesia', () => {
    // Arrange
    const input = 'Bank Syariah Indonesia';

    // Act
    const result = formatBankName(input);

    // Assert
    expect(result).toBe('BSI');
  });

  it('should_use_channel_code_fallback_when_channel_name_is_empty', () => {
    // Arrange & Act
    const result = formatBankName('', 'BCA');

    // Assert
    expect(result).toBe('BCA');
  });

  it('should_return_bank_ina_when_name_contains_ina', () => {
    // Arrange & Act
    const result = formatBankName('Bank INA Perdana');

    // Assert
    expect(result).toBe('Bank INA');
  });

  it('should_return_bnc_when_name_contains_bnc_or_neo', () => {
    // Arrange & Act
    const result = formatBankName('Bank Neo Commerce');

    // Assert
    expect(result).toBe('BNC');
  });

  it('should_return_nobu_when_name_contains_nobu', () => {
    // Arrange & Act
    const result = formatBankName('Nationalnobu');

    // Assert
    expect(result).toBe('Nobu');
  });

  it('should_return_dash_when_both_inputs_are_empty', () => {
    // Arrange & Act
    const result = formatBankName();

    // Assert
    expect(result).toBe('-');
  });
});
