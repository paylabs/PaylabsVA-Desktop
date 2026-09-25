//! Module: Paylabs HTTP Client
//! Tujuan: Mengirimkan request terotentikasi SNAP ke Paylabs API dan mencatat Exchange audit lengkap.

use super::crypto::{build_string_to_sign, format_jakarta_timestamp, sign_sha256_rsa};
use super::models::{Channel, CreateVaRequest, Exchange, ParsedResponse};
use chrono::Utc;
use reqwest::header::{HeaderMap, HeaderName, HeaderValue};
use rsa::RsaPrivateKey;
use std::collections::HashMap;
use std::time::Duration;

pub const API_PREFIX: &str = "/api/v1.0";
pub const PATH_CREATE_VA: &str = "/transfer-va/create-va";
pub const CHANNEL_ID: &str = "95221";
pub const FIXED_CUSTOMER_NO: &str = "00000000000000000000";

const BASE36: &[u8] = b"0123456789abcdefghijklmnopqrstuvwxyz";

/// Daftar Bank Channel Virtual Account resmi yang didukung Paylabs SNAP API.
pub fn get_available_channels() -> Vec<Channel> {
    vec![
        // 14 Multiple Channels (Dynamic VA)
        Channel { id: "MultipleBCAVA".into(), code: "014".into(), name: "BCA".into() },
        Channel { id: "MultipleBNIVA".into(), code: "009".into(), name: "BNI".into() },
        Channel { id: "MultipleBRIVA".into(), code: "002".into(), name: "BRI".into() },
        Channel { id: "MultipleBSIVA".into(), code: "451".into(), name: "BSI".into() },
        Channel { id: "MultipleCIMBVA".into(), code: "022".into(), name: "CIMB Niaga".into() },
        Channel { id: "MultipleDanamonVA".into(), code: "011".into(), name: "Danamon".into() },
        Channel { id: "MultipleINAVA".into(), code: "513".into(), name: "Bank INA".into() },
        Channel { id: "MultiplePermataVA".into(), code: "013".into(), name: "Permata".into() },
        Channel { id: "MultipleMandiriVA".into(), code: "008".into(), name: "Mandiri".into() },
        Channel { id: "MultipleMaybankVA".into(), code: "016".into(), name: "Maybank".into() },
        Channel { id: "MultipleMuamalatVA".into(), code: "147".into(), name: "Muamalat".into() },
        Channel { id: "MultipleSinarmasVA".into(), code: "153".into(), name: "Sinarmas".into() },
        Channel { id: "MultipleBNCVA".into(), code: "490".into(), name: "BNC".into() },
        Channel { id: "MultipleNobuVA".into(), code: "503".into(), name: "Nobu".into() },

        // 6 Static Channels Resmi (Static VA)
        Channel { id: "StaticBNIVA".into(), code: "009".into(), name: "BNI (Static)".into() },
        Channel { id: "StaticBNCVA".into(), code: "490".into(), name: "BNC (Static)".into() },
        Channel { id: "StaticNobuVA".into(), code: "503".into(), name: "Nobu (Static)".into() },
        Channel { id: "StaticINAVA".into(), code: "513".into(), name: "Bank INA (Static)".into() },
        Channel { id: "StaticBCAVA".into(), code: "014".into(), name: "BCA (Static)".into() },
        Channel { id: "StaticMandiriVA".into(), code: "008".into(), name: "Mandiri (Static)".into() },
    ]
}

/// Normalisasi paymentType SNAP Paylabs (misal "BCA" -> "MultipleBCAVA", "StaticMandiriVA" -> "StaticMandiriVA").
pub fn normalize_payment_type(channel: &str) -> String {
    let trimmed = channel.trim();
    if (trimmed.starts_with("Multiple") || trimmed.starts_with("Static")) && trimmed.ends_with("VA") {
        return trimmed.to_string();
    }
    match trimmed.to_uppercase().as_str() {
        "BCA" => "MultipleBCAVA".to_string(),
        "BNI" => "MultipleBNIVA".to_string(),
        "BRI" => "MultipleBRIVA".to_string(),
        "BSI" => "MultipleBSIVA".to_string(),
        "CIMB" | "CIMB NIAGA" => "MultipleCIMBVA".to_string(),
        "DANAMON" => "MultipleDanamonVA".to_string(),
        "INA" | "BANK INA" => "MultipleINAVA".to_string(),
        "PERMATA" => "MultiplePermataVA".to_string(),
        "MANDIRI" => "MultipleMandiriVA".to_string(),
        "MAYBANK" => "MultipleMaybankVA".to_string(),
        "MUAMALAT" => "MultipleMuamalatVA".to_string(),
        "SINARMAS" => "MultipleSinarmasVA".to_string(),
        "BNC" | "NEO" | "NEO COMMERCE" => "MultipleBNCVA".to_string(),
        "NOBU" | "BANK NOBU" => "MultipleNobuVA".to_string(),
        "STATIC MANDIRI" | "STATICMANDIRI" => "StaticMandiriVA".to_string(),
        "STATIC BNI" | "STATICBNI" => "StaticBNIVA".to_string(),
        "STATIC BCA" | "STATICBCA" => "StaticBCAVA".to_string(),
        "STATIC BNC" | "STATICBNC" => "StaticBNCVA".to_string(),
        "STATIC NOBU" | "STATICNOBU" => "StaticNobuVA".to_string(),
        "STATIC INA" | "STATICINA" => "StaticINAVA".to_string(),
        other => format!("Multiple{}VA", other),
    }
}

/// Mendapatkan nama bank berdasarkan ID channel.
pub fn get_channel_name(channel_id: &str) -> String {
    get_available_channels()
        .iter()
        .find(|c| c.id.eq_ignore_ascii_case(channel_id) || c.name.eq_ignore_ascii_case(channel_id))
        .map(|c| c.name.clone())
        .unwrap_or_else(|| channel_id.to_string())
}

/// Menghasilkan nomor X-EXTERNAL-ID tepat 12 karakter alfanumerik base36.
pub fn generate_external_id() -> String {
    let mut sb = String::with_capacity(12);
    let mut ms = chrono::Utc::now().timestamp_millis();
    for _ in 0..8 {
        let idx = (ms % 36) as usize;
        sb.push(BASE36[idx] as char);
        ms /= 36;
    }
    let mut rng = rand::thread_rng();
    for _ in 0..4 {
        let r: u8 = rand::Rng::gen(&mut rng);
        let idx = (r % 36) as usize;
        sb.push(BASE36[idx] as char);
    }
    sb
}

/// Melakukan padding partner ID menjadi 8 karakter dengan spasi di depan sesuai SNAP.
pub fn pad_partner_service_id(partner_id: &str) -> String {
    let trimmed = partner_id.trim();
    if trimmed.len() >= 8 {
        trimmed.to_string()
    } else {
        let pad_len = 8 - trimmed.len();
        format!("{}{}", " ".repeat(pad_len), trimmed)
    }
}

/// Melakukan padding customer number menjadi 20 digit dengan angka '0'.
pub fn pad_customer_no(customer_no: &str) -> String {
    let trimmed = customer_no.trim();
    if trimmed.len() >= 20 {
        trimmed.to_string()
    } else {
        let pad_len = 20 - trimmed.len();
        format!("{}{}", "0".repeat(pad_len), trimmed)
    }
}

/// Menyusun virtualAccountNo dari padded partnerServiceId dan padded customerNo.
pub fn compose_va_no(partner_id: &str, customer_no: &str) -> String {
    format!("{}{}", pad_partner_service_id(partner_id), pad_customer_no(customer_no))
}

/// Menyusun header SNAP dan map string untuk pencatatan Exchange.
fn build_snap_headers(
    timestamp: &str,
    partner_id: &str,
    external_id: &str,
    signature: &str,
) -> (HeaderMap, HashMap<String, String>) {
    let mut map: HashMap<String, String> = HashMap::new();
    map.insert("Content-Type".to_string(), "application/json;charset=utf-8".to_string());
    map.insert("X-TIMESTAMP".to_string(), timestamp.to_string());
    map.insert("X-PARTNER-ID".to_string(), partner_id.to_string());
    map.insert("X-EXTERNAL-ID".to_string(), external_id.to_string());
    map.insert("X-SIGNATURE".to_string(), signature.to_string());
    map.insert("X-IP-ADDRESS".to_string(), "127.0.0.1".to_string());
    map.insert("CHANNEL-ID".to_string(), CHANNEL_ID.to_string());

    let mut header_map = HeaderMap::new();
    for (k, v) in &map {
        if let (Ok(hk), Ok(hv)) = (HeaderName::from_bytes(k.as_bytes()), HeaderValue::from_str(v)) {
            header_map.insert(hk, hv);
        }
    }
    (header_map, map)
}

/// Menjalankan request SNAP API Paylabs secara aman dan mengembalikan catatan Exchange.
pub async fn send_snap_create_va(
    base_url: &str,
    partner_id: &str,
    key: &RsaPrivateKey,
    req: &CreateVaRequest,
) -> Exchange {
    let url = format!("{}{}{}", base_url.trim_end_matches('/'), API_PREFIX, PATH_CREATE_VA);
    let body_bytes = match serde_json::to_vec(req) {
        Ok(b) => b,
        Err(e) => return error_exchange("POST", &url, &format!("Gagal serialize request: {}", e)),
    };

    let ts = format_jakarta_timestamp(Utc::now());
    let sts = build_string_to_sign("POST", PATH_CREATE_VA, &body_bytes, &ts);
    let sig = match sign_sha256_rsa(key, &sts) {
        Ok(s) => s,
        Err(e) => return error_exchange("POST", &url, &format!("Gagal menandatangani request: {}", e)),
    };

    let ext_id = generate_external_id();
    let (header_map, headers_audit) = build_snap_headers(&ts, partner_id, &ext_id, &sig);
    execute_http_call("POST", &url, &sts, headers_audit, header_map, body_bytes).await
}

/// Helper untuk membuat respons Exchange kegagalan awal.
fn error_exchange(method: &str, url: &str, err_msg: &str) -> Exchange {
    Exchange {
        method: method.into(),
        url: url.into(),
        success: false,
        error: Some(err_msg.into()),
        ..Default::default()
    }
}

/// Menjalankan eksekusi panggilan HTTP via reqwest.
async fn execute_http_call(
    method: &str,
    url: &str,
    sts: &str,
    headers_audit: HashMap<String, String>,
    header_map: HeaderMap,
    body: Vec<u8>,
) -> Exchange {
    let client = reqwest::Client::builder()
        .timeout(Duration::from_secs(60))
        .build()
        .unwrap_or_default();

    let req_body_str = String::from_utf8_lossy(&body).to_string();
    let resp_res = client.post(url).headers(header_map).body(body).send().await;

    let response = match resp_res {
        Ok(r) => r,
        Err(e) => {
            return Exchange {
                method: method.into(),
                url: url.into(),
                string_to_sign: sts.into(),
                headers: headers_audit,
                request_body: req_body_str,
                success: false,
                error: Some(format!("Koneksi ke server Paylabs gagal: {}", e)),
                ..Default::default()
            };
        }
    };

    let status = response.status().as_u16();
    let raw_text = response.text().await.unwrap_or_default();
    let parsed: ParsedResponse = serde_json::from_str(&raw_text).unwrap_or_default();
    let is_success = status == 200 && parsed.response_code.starts_with("200");

    Exchange {
        method: method.into(),
        url: url.into(),
        string_to_sign: sts.into(),
        headers: headers_audit,
        request_body: req_body_str,
        status_code: status,
        raw_response: raw_text,
        success: is_success,
        parsed,
        error: None,
    }
}
