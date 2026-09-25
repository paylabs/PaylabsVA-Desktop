/**
 * @file paylabsService.ts
 * @description Layanan komunikasi IPC Tauri untuk operasi Paylabs SNAP VA API, kredensial, dan riwayat transaksi.
 */

import {
  Channel,
  CreateVaFormInput,
  Exchange,
  HistoryRecord,
  Settings,
  SettingsInput,
  Status,
} from '../types/paylabs';
import { isTauriEnvironment } from './windowService';

export const DYNAMIC_CHANNELS: readonly Channel[] = [
  { id: 'MultipleBCAVA', code: '014', name: 'BCA' },
  { id: 'MultipleBNIVA', code: '009', name: 'BNI' },
  { id: 'MultipleBRIVA', code: '002', name: 'BRI' },
  { id: 'MultipleBSIVA', code: '451', name: 'BSI' },
  { id: 'MultipleCIMBVA', code: '022', name: 'CIMB Niaga' },
  { id: 'MultipleDanamonVA', code: '011', name: 'Danamon' },
  { id: 'MultipleINAVA', code: '513', name: 'Bank INA' },
  { id: 'MultiplePermataVA', code: '013', name: 'Permata' },
  { id: 'MultipleMandiriVA', code: '008', name: 'Mandiri' },
  { id: 'MultipleMaybankVA', code: '016', name: 'Maybank' },
  { id: 'MultipleMuamalatVA', code: '147', name: 'Muamalat' },
  { id: 'MultipleSinarmasVA', code: '153', name: 'Sinarmas' },
  { id: 'MultipleBNCVA', code: '490', name: 'BNC' },
  { id: 'MultipleNobuVA', code: '503', name: 'Nobu' },
];

export const STATIC_CHANNELS: readonly Channel[] = [
  { id: 'StaticBNIVA', code: '009', name: 'BNI' },
  { id: 'StaticBNCVA', code: '490', name: 'BNC' },
  { id: 'StaticNobuVA', code: '503', name: 'Nobu' },
  { id: 'StaticINAVA', code: '513', name: 'Bank INA' },
  { id: 'StaticBCAVA', code: '014', name: 'BCA' },
  { id: 'StaticMandiriVA', code: '008', name: 'Mandiri' },
];

const MOCK_CHANNELS: Channel[] = [
  ...DYNAMIC_CHANNELS,
  ...STATIC_CHANNELS,
];

/**
 * Mengambil seluruh pengaturan kredensial SIT dan Production.
 */
export async function getPaylabsSettings(): Promise<Settings> {
  if (!isTauriEnvironment()) {
    return {
      environment: 'SIT',
      sit: { partnerId: 'TEST_MERCHANT_SIT', privateKey: '', key: { stored: false, bits: 0, fingerprint: '', savedAt: '' } },
      prod: { partnerId: '', privateKey: '', key: { stored: false, bits: 0, fingerprint: '', savedAt: '' } },
    };
  }
  const { invoke } = await import('@tauri-apps/api/core');
  return invoke<Settings>('paylabs_get_settings');
}

/**
 * Menyimpan kredensial environment ke penyimpanan aman (%APPDATA%\PaylabsVA).
 */
export async function savePaylabsSettings(input: SettingsInput): Promise<void> {
  if (!isTauriEnvironment()) {
    console.info('[paylabsService] Mock saveSettings:', input.environment);
    return;
  }
  const { invoke } = await import('@tauri-apps/api/core');
  return invoke<void>('paylabs_save_settings', { input });
}

/**
 * Mengambil ringkasan status konfigurasi Paylabs aktif.
 */
export async function getPaylabsStatus(): Promise<Status> {
  if (!isTauriEnvironment()) {
    return {
      environment: 'SIT',
      baseUrl: 'https://sit-pay.paylabs.co.id',
      configured: true,
      production: false,
    };
  }
  const { invoke } = await import('@tauri-apps/api/core');
  return invoke<Status>('paylabs_get_status');
}

/**
 * Mengambil daftar bank channel yang didukung.
 */
export async function getPaylabsChannels(): Promise<Channel[]> {
  if (!isTauriEnvironment()) {
    return MOCK_CHANNELS;
  }
  const { invoke } = await import('@tauri-apps/api/core');
  return invoke<Channel[]>('paylabs_get_channels');
}

/**
 * Membuat Virtual Account multiple-use melalui SNAP API.
 */
export async function createVirtualAccount(form: CreateVaFormInput): Promise<Exchange> {
  if (!isTauriEnvironment()) {
    return createMockExchange(form);
  }
  const { invoke } = await import('@tauri-apps/api/core');
  return invoke<Exchange>('paylabs_create_va', { form });
}

/**
 * Mengambil daftar riwayat pembuatan VA lokal.
 */
export async function getPaylabsHistory(): Promise<HistoryRecord[]> {
  if (!isTauriEnvironment()) {
    return [];
  }
  const { invoke } = await import('@tauri-apps/api/core');
  return invoke<HistoryRecord[]>('paylabs_get_history');
}

/**
 * Menghapus seluruh riwayat pembuatan VA lokal.
 */
export async function clearPaylabsHistory(): Promise<void> {
  if (!isTauriEnvironment()) {
    return;
  }
  const { invoke } = await import('@tauri-apps/api/core');
  return invoke<void>('paylabs_clear_history');
}

/**
 * Helper mock exchange untuk pengujian di browser.
 */
function createMockExchange(form: CreateVaFormInput): Exchange {
  const vaNo = `0000123400000000`;
  return {
    method: 'POST',
    url: 'https://sit-pay.paylabs.co.id/api/v1.0/transfer-va/create-va',
    stringToSign: 'POST:/transfer-va/create-va:mockhash:2026-01-30T10:00:00+07:00',
    headers: { 'X-PARTNER-ID': 'TEST_MERCHANT_SIT', 'CHANNEL-ID': '95221' },
    requestBody: JSON.stringify(form),
    statusCode: 200,
    rawResponse: JSON.stringify({ responseCode: '2002700', responseMessage: 'Successful' }),
    success: true,
    parsed: {
      responseCode: '2002700',
      responseMessage: 'Successful',
      virtualAccountData: {
        virtualAccountNo: vaNo,
        virtualAccountName: form.name,
        virtualAccountPhone: form.phone || '6281234567890',
        trxId: form.trxId || 'TRX-MOCK-123456',
        totalAmount: { value: form.amount, currency: 'IDR' },
        expiredDate: '2026-03-30T10:00:00+07:00',
      },
    },
  };
}
