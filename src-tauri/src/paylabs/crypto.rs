//! Module: Paylabs Crypto & SNAP Signature
//! Tujuan: Menangani pembacaan RSA Private Key, pembuatan StringToSign SNAP, tanda tangan SHA-256, dan kalkulasi sidik jari.

use chrono::{DateTime, FixedOffset, Utc};
use rsa::pkcs1::DecodeRsaPrivateKey;
use rsa::pkcs1v15::SigningKey;
use rsa::pkcs8::{DecodePrivateKey, EncodePublicKey};
use rsa::signature::{RandomizedSigner, SignatureEncoding};
use rsa::RsaPrivateKey;
use sha2::{Digest, Sha256};

/// Zona waktu Jakarta (WIB +07:00) yang diharapkan oleh Paylabs SNAP API.
pub fn get_jakarta_offset() -> FixedOffset {
    FixedOffset::east_opt(7 * 3600).expect("Valid Jakarta offset +07:00")
}

/// Menghasilkan timestamp format ISO-8601 zona waktu Jakarta WIB (+07:00).
pub fn format_jakarta_timestamp(dt: DateTime<Utc>) -> String {
    let jakarta = get_jakarta_offset();
    dt.with_timezone(&jakarta)
        .format("%Y-%m-%dT%H:%M:%S%:z")
        .to_string()
}

/// Membangun SNAP Asymmetric StringToSign untuk otentikasi API.
pub fn build_string_to_sign(method: &str, path: &str, body: &[u8], timestamp: &str) -> String {
    let mut hasher = Sha256::new();
    hasher.update(body);
    let hash_result = hasher.finalize();
    let body_hex = hex::encode(hash_result).to_lowercase();

    format!("{}:{}:{}:{}", method.to_uppercase(), path, body_hex, timestamp)
}

/// Menghasilkan tanda tangan digital Base64 SHA256withRSA (PKCS#1 v1.5).
pub fn sign_sha256_rsa(key: &RsaPrivateKey, string_to_sign: &str) -> Result<String, String> {
    let signing_key = SigningKey::<Sha256>::new(key.clone());
    let mut rng = rand::thread_rng();
    let signature = signing_key.sign_with_rng(&mut rng, string_to_sign.as_bytes());

    Ok(base64::Engine::encode(
        &base64::engine::general_purpose::STANDARD,
        signature.to_bytes(),
    ))
}

/// Membersihkan string private key dari teks pembungkus PEM dan spasi kosong.
fn clean_private_key_pem(input: &str) -> String {
    let mut cleaned = String::with_capacity(input.len());
    for line in input.lines() {
        let trimmed_line = line.trim();
        // Lewati baris header/footer PEM seperti -----BEGIN ...----- atau -----END ...-----
        if trimmed_line.starts_with("-----") && trimmed_line.ends_with("-----") {
            continue;
        }
        cleaned.push_str(trimmed_line);
    }
    // Buang semua whitespace atau karakter non-base64 yang mungkin tersisa
    cleaned.retain(|c| !c.is_whitespace() && c != '\r' && c != '\n');
    cleaned
}

/// Mengurai DER bytes menjadi RsaPrivateKey (mencoba PKCS#8 lalu PKCS#1).
fn parse_der_bytes(der: &[u8]) -> Result<RsaPrivateKey, String> {
    // 1. Coba decode sebagai PKCS#8 DER
    if let Ok(key) = RsaPrivateKey::from_pkcs8_der(der) {
        return Ok(key);
    }
    // 2. Coba decode sebagai PKCS#1 DER
    RsaPrivateKey::from_pkcs1_der(der)
        .map_err(|e| format!("Bukan format RSA Private Key yang valid (PKCS#8 atau PKCS#1): {}", e))
}

/// Mengurai Private Key RSA yang ditempelkan pengguna dari string PEM atau Base64 mentah.
pub fn parse_rsa_private_key(input: &str) -> Result<RsaPrivateKey, String> {
    let trimmed = input.trim();
    if trimmed.is_empty() {
        return Err("Private key kosong".to_string());
    }

    let mut cleaned = clean_private_key_pem(trimmed);
    if cleaned.is_empty() {
        return Err("Private key tidak memiliki data valid".to_string());
    }

    // Koreksi padding base64 jika terpotong
    let remainder = cleaned.len() % 4;
    if remainder != 0 {
        let padding_needed = 4 - remainder;
        for _ in 0..padding_needed {
            cleaned.push('=');
        }
    }

    let der = base64::Engine::decode(&base64::engine::general_purpose::STANDARD, &cleaned)
        .or_else(|_| base64::Engine::decode(&base64::engine::general_purpose::URL_SAFE, &cleaned))
        .map_err(|e| format!("Private key bukan Base64 valid: {}", e))?;

    parse_der_bytes(&der)
}

/// Menghitung sidik jari SHA-256 (8-byte pertama) yang kompatibel dengan OpenSSL.
pub fn calculate_public_key_fingerprint(key: &RsaPrivateKey) -> Result<String, String> {
    let pub_key = key.to_public_key();
    let doc = pub_key
        .to_public_key_der()
        .map_err(|e| format!("Gagal mengekspor DER public key: {}", e))?;

    let mut hasher = Sha256::new();
    hasher.update(doc.as_bytes());
    let hash_result = hasher.finalize();

    // Ambil 8 byte pertama dan format ke pola xx:xx:xx:xx:xx:xx:xx:xx
    let hex_pairs: Vec<String> = hash_result[..8]
        .iter()
        .map(|byte| format!("{:02x}", byte))
        .collect();

    Ok(hex_pairs.join(":"))
}

#[cfg(test)]
mod tests {
    use super::*;
    use rsa::traits::PublicKeyParts;
    use rsa::pkcs1::EncodeRsaPrivateKey;
    use rsa::pkcs8::EncodePrivateKey;

    #[test]
    fn test_jakarta_timestamp_format() {
        let dt = chrono::DateTime::parse_from_rfc3339("2026-01-30T10:00:00Z")
            .unwrap()
            .with_timezone(&Utc);
        let formatted = format_jakarta_timestamp(dt);
        assert!(formatted.ends_with("+07:00"));
        assert_eq!(formatted, "2026-01-30T17:00:00+07:00");
    }

    #[test]
    fn test_string_to_sign() {
        let method = "POST";
        let path = "/transfer-va/create-va";
        let body = b"{\"test\":\"value\"}";
        let ts = "2026-01-30T17:00:00+07:00";
        let sts = build_string_to_sign(method, path, body, ts);
        assert!(sts.starts_with("POST:/transfer-va/create-va:"));
        assert!(sts.ends_with(":2026-01-30T17:00:00+07:00"));
    }

    #[test]
    fn test_rsa_key_generation_and_fingerprint() {
        let mut rng = rand::thread_rng();
        let key = RsaPrivateKey::new(&mut rng, 2048).expect("Generate 2048-bit RSA");
        let fp = calculate_public_key_fingerprint(&key).expect("Calculate fingerprint");
        // Format xx:xx:xx:xx:xx:xx:xx:xx memiliki panjang 23 karakter
        assert_eq!(fp.len(), 23);
        assert_eq!(fp.matches(':').count(), 7);
    }

    #[test]
    fn test_parse_rsa_key_with_and_without_headers_pkcs1_and_pkcs8() {
        let mut rng = rand::thread_rng();
        let key = RsaPrivateKey::new(&mut rng, 2048).expect("Generate key");

        // 1. Test PKCS#1 dengan header PEM
        let pkcs1_pem = key.to_pkcs1_pem(rsa::pkcs1::LineEnding::LF).expect("PKCS1 PEM");
        let parsed_pkcs1_pem = parse_rsa_private_key(&pkcs1_pem).expect("Parse PKCS1 PEM");
        assert_eq!(parsed_pkcs1_pem.n(), key.n());

        // 2. Test PKCS#1 tanpa header (Base64 mentah)
        let pkcs1_der = key.to_pkcs1_der().expect("PKCS1 DER");
        let pkcs1_raw_b64 = base64::Engine::encode(&base64::engine::general_purpose::STANDARD, pkcs1_der.as_bytes());
        let parsed_pkcs1_raw = parse_rsa_private_key(&pkcs1_raw_b64).expect("Parse PKCS1 Raw Base64");
        assert_eq!(parsed_pkcs1_raw.n(), key.n());

        // 3. Test PKCS#8 dengan header PEM
        let pkcs8_pem = key.to_pkcs8_pem(rsa::pkcs8::LineEnding::LF).expect("PKCS8 PEM");
        let parsed_pkcs8_pem = parse_rsa_private_key(&pkcs8_pem).expect("Parse PKCS8 PEM");
        assert_eq!(parsed_pkcs8_pem.n(), key.n());

        // 4. Test PKCS#8 tanpa header (Base64 mentah)
        let pkcs8_der = key.to_pkcs8_der().expect("PKCS8 DER");
        let pkcs8_raw_b64 = base64::Engine::encode(&base64::engine::general_purpose::STANDARD, pkcs8_der.as_bytes());
        let parsed_pkcs8_raw = parse_rsa_private_key(&pkcs8_raw_b64).expect("Parse PKCS8 Raw Base64");
        assert_eq!(parsed_pkcs8_raw.n(), key.n());
    }
}
