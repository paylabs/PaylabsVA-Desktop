//! Module: Paylabs Models
//! Tujuan: Menyediakan struktur data untuk SNAP API Paylabs, pengaturan kredensial, dan riwayat transaksi.

use serde::{Deserialize, Serialize};

/// Form input pembuatan Virtual Account dari frontend.
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct CreateVaForm {
    pub name: String,
    pub email: Option<String>,
    pub phone: Option<String>,
    pub amount: String,
    pub channel: String,
    pub expiry_days: Option<i32>,
    pub trx_id: Option<String>,
}

/// Struktur nilai nominal transaksi SNAP API.
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
pub struct Amount {
    pub value: String,
    pub currency: String,
}

/// Informasi tambahan pembayaran untuk SNAP API.
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct AdditionalInfo {
    #[serde(rename = "paymentType")]
    pub payment_type: String,
}

/// Payload permohonan pembuatan Virtual Account ke endpoint SNAP Paylabs.
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct CreateVaRequest {
    pub partner_service_id: String,
    pub customer_no: String,
    pub virtual_account_no: String,
    pub virtual_account_name: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub virtual_account_email: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub virtual_account_phone: Option<String>,
    pub trx_id: String,
    pub total_amount: Amount,
    pub virtual_account_trx_type: String,
    pub additional_info: AdditionalInfo,
    pub expired_date: String,
}

/// Data Virtual Account yang dikembalikan oleh Paylabs SNAP API.
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct VirtualAccountData {
    #[serde(default)]
    pub virtual_account_no: String,
    #[serde(default)]
    pub virtual_account_name: String,
    #[serde(default)]
    pub virtual_account_email: String,
    #[serde(default)]
    pub virtual_account_phone: String,
    #[serde(default)]
    pub trx_id: String,
    #[serde(default)]
    pub total_amount: Amount,
    #[serde(default)]
    pub expired_date: String,
}

/// Respons terurai dari endpoint SNAP Paylabs.
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct ParsedResponse {
    #[serde(default)]
    pub response_code: String,
    #[serde(default)]
    pub response_message: String,
    #[serde(default)]
    pub virtual_account_data: VirtualAccountData,
}

/// Catatan jejak lengkap (audit log) komunikasi SNAP API untuk inspeksi merchant.
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct Exchange {
    pub method: String,
    pub url: String,
    pub string_to_sign: String,
    pub headers: std::collections::HashMap<String, String>,
    pub request_body: String,
    pub status_code: u16,
    pub raw_response: String,
    pub parsed: ParsedResponse,
    pub success: bool,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub error: Option<String>,
}

/// Definisi Bank Channel yang didukung Paylabs SNAP VA.
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Channel {
    pub id: String,
    pub code: String,
    pub name: String,
}

/// Informasi sidik jari dan status Private Key RSA tersimpan.
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct KeyInfo {
    pub stored: bool,
    pub bits: usize,
    pub fingerprint: String,
    pub saved_at: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub problem: Option<String>,
}

/// Tampilan kredensial satu environment pada dialog Pengaturan.
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct CredentialView {
    pub partner_id: String,
    pub private_key: String,
    pub key: KeyInfo,
}

/// Model seluruh pengaturan yang dikirim ke frontend.
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct Settings {
    pub environment: String,
    pub sit: CredentialView,
    pub prod: CredentialView,
}

/// Input penyimpanan kredensial dari modal Pengaturan frontend.
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct SettingsInput {
    pub environment: String,
    pub partner_id: String,
    pub private_key: String,
}

/// Status ringkasan environment aktif untuk indikator status bar/banner.
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct Status {
    pub environment: String,
    pub base_url: String,
    pub configured: bool,
    pub production: bool,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub problem: Option<String>,
}

/// Catatan riwayat Virtual Account lokal di history.json.
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct HistoryRecord {
    pub id: String,
    pub environment: String,
    pub channel: String,
    pub channel_name: String,
    pub virtual_account_no: String,
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub virtual_account_phone: Option<String>,
    pub name: String,
    pub amount: String,
    pub trx_id: String,
    pub expired_date: String,
    pub created_at: String,
}
