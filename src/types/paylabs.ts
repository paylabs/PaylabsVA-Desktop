/**
 * @file paylabs.ts
 * @description Definisi tipe data TypeScript untuk integrasi Paylabs SNAP VA API.
 */

export type VaMode = 'dynamic' | 'static';

export interface Channel {
  id: string;
  code: string;
  name: string;
}

export interface Amount {
  value: string;
  currency: string;
}

export interface VirtualAccountData {
  virtualAccountNo: string;
  virtualAccountName: string;
  virtualAccountEmail?: string;
  virtualAccountPhone?: string;
  trxId: string;
  totalAmount: Amount;
  expiredDate: string;
}

export interface ParsedResponse {
  responseCode: string;
  responseMessage: string;
  virtualAccountData: VirtualAccountData;
}

export interface Exchange {
  method: string;
  url: string;
  stringToSign: string;
  headers: Record<string, string>;
  requestBody: string;
  statusCode: number;
  rawResponse: string;
  parsed: ParsedResponse;
  success: boolean;
  error?: string;
}

export interface CreateVaFormInput {
  name: string;
  email?: string;
  phone?: string;
  amount: string;
  channel: string;
  expiryDays?: number;
  trxId?: string;
}

export interface KeyInfo {
  stored: boolean;
  bits: number;
  fingerprint: string;
  savedAt: string;
  problem?: string;
}

export interface CredentialView {
  partnerId: string;
  privateKey: string;
  key: KeyInfo;
}

export interface Settings {
  environment: 'SIT' | 'PROD' | string;
  sit: CredentialView;
  prod: CredentialView;
}

export interface SettingsInput {
  environment: 'SIT' | 'PROD' | string;
  partnerId: string;
  privateKey: string;
}

export interface Status {
  environment: 'SIT' | 'PROD' | string;
  baseUrl: string;
  configured: boolean;
  production: boolean;
  problem?: string;
}

export interface HistoryRecord {
  id: string;
  environment: string;
  channel: string;
  channelName: string;
  virtualAccountNo: string;
  virtualAccountPhone?: string;
  name: string;
  amount: string;
  trxId: string;
  expiredDate: string;
  createdAt: string;
}

