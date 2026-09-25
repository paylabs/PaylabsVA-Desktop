/**
 * @file paylabsService.test.ts
 * @description Unit tests untuk paylabsService IPC wrapper & mock fallback logic (pola AAA).
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  getPaylabsSettings,
  savePaylabsSettings,
  getPaylabsStatus,
  getPaylabsChannels,
  createVirtualAccount,
  getPaylabsHistory,
  clearPaylabsHistory,
} from '../paylabsService';

describe('paylabsService', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  describe('getPaylabsSettings', () => {
    it('should_return_mock_settings_when_running_in_browser_mode', async () => {
      // Arrange & Act
      const settings = await getPaylabsSettings();

      // Assert
      expect(settings).toBeDefined();
      expect(settings.environment).toBe('SIT');
      expect(settings.sit).toBeDefined();
      expect(settings.prod).toBeDefined();
    });
  });

  describe('getPaylabsChannels', () => {
    it('should_return_bank_channel_list_with_all_14_channels', async () => {
      // Arrange & Act
      const channels = await getPaylabsChannels();

      // Assert
      expect(channels.length).toBe(19); // 14 dynamic + 5 static (BNI, BNC, Nobu, INA, BCA)
      const bcaMultiple = channels.find((c) => c.id === 'MultipleBCAVA');
      expect(bcaMultiple).toBeDefined();
      expect(bcaMultiple?.name).toBe('BCA');

      const bcaStatic = channels.find((c) => c.id === 'StaticBCAVA');
      expect(bcaStatic).toBeDefined();

      const inaMultiple = channels.find((c) => c.id === 'MultipleINAVA');
      expect(inaMultiple).toBeDefined();
      expect(inaMultiple?.name).toBe('Bank INA');

      const nobuStatic = channels.find((c) => c.id === 'StaticNobuVA');
      expect(nobuStatic).toBeDefined();
    });
  });

  describe('getPaylabsStatus', () => {
    it('should_return_configured_status_with_base_url', async () => {
      // Arrange & Act
      const status = await getPaylabsStatus();

      // Assert
      expect(status).toBeDefined();
      expect(status.baseUrl).toBeDefined();
      expect(status.environment).toBeDefined();
    });
  });

  describe('createVirtualAccount', () => {
    it('should_generate_virtual_account_when_valid_input_provided', async () => {
      // Arrange
      const formInput = {
        channel: 'BCA',
        name: 'Budi Santoso',
        amount: '150000',
        expiryDays: 14,
      };


      // Act
      const response = await createVirtualAccount(formInput);

      // Assert
      expect(response).toBeDefined();
      expect(response.success).toBe(true);
      expect(response.parsed?.responseCode).toBe('2002700');
      expect(response.parsed?.virtualAccountData?.virtualAccountName).toBe('Budi Santoso');
      expect(response.parsed?.virtualAccountData?.virtualAccountNo).toBeDefined();
    });
  });

  describe('savePaylabsSettings', () => {
    it('should_execute_successfully_when_credentials_provided', async () => {
      // Arrange
      const input = {
        environment: 'SIT',
        partnerId: '88899911',
        privateKey: '-----BEGIN RSA PRIVATE KEY-----\nMOCK\n-----END RSA PRIVATE KEY-----',
      };

      // Act & Assert
      await expect(savePaylabsSettings(input)).resolves.toBeUndefined();
    });
  });

  describe('getPaylabsHistory and clearPaylabsHistory', () => {
    it('should_fetch_history_records_in_browser_mode', async () => {
      // Arrange & Act
      const history = await getPaylabsHistory();

      // Assert
      expect(Array.isArray(history)).toBe(true);
    });

    it('should_clear_history_records_without_throwing', async () => {
      // Arrange & Act & Assert
      await expect(clearPaylabsHistory()).resolves.toBeUndefined();
    });
  });
});
