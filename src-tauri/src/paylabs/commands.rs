//! Module: Paylabs IPC Commands
//! Tujuan: Handler perintah Tauri IPC untuk integrasi frontend dengan Paylabs SNAP backend.

use super::client::{
    compose_va_no, generate_external_id, get_available_channels, get_channel_name,
    normalize_payment_type, pad_customer_no, pad_partner_service_id, send_snap_create_va,
    FIXED_CUSTOMER_NO,
};
use super::config::{
    decrypt_secret, encrypt_secret, load_config, save_config, StoredCredential, ENV_PROD, ENV_SIT,
};
use super::crypto::{calculate_public_key_fingerprint, parse_rsa_private_key};
use super::history::{append_history, clear_history, load_history};
use super::models::{
    AdditionalInfo, Amount, Channel, CreateVaForm, CreateVaRequest, CredentialView, Exchange,
    HistoryRecord, KeyInfo, Settings, SettingsInput, Status,
};
use chrono::{Duration, Utc};
use rsa::traits::PublicKeyParts;

/// Mengambil informasi fingerprint dari kredensial tersimpan.
fn get_key_info(cred: &StoredCredential, decrypted_key: &str) -> KeyInfo {
    let mut info = KeyInfo {
        saved_at: cred.private_key_saved_at.clone(),
        ..Default::default()
    };

    if decrypted_key.trim().is_empty() {
        if !cred.private_key.is_empty() {
            info.problem = Some("Tersimpan namun gagal didekripsi".into());
        }
        return info;
    }

    match parse_rsa_private_key(decrypted_key) {
        Ok(key) => {
            info.stored = true;
            info.bits = key.size() * 8;
            info.fingerprint = calculate_public_key_fingerprint(&key).unwrap_or_default();
        }
        Err(e) => {
            info.problem = Some(format!("Kunci tersimpan korup: {}", e));
        }
    }
    info
}

/// IPC: Mengambil data konfigurasi kredensial Paylabs (SIT & Production).
#[tauri::command]
pub fn paylabs_get_settings() -> Result<Settings, String> {
    let cfg = load_config().unwrap_or_default();

    let sit_key = decrypt_secret(&cfg.sit.private_key).unwrap_or_default();
    let prod_key = decrypt_secret(&cfg.prod.private_key).unwrap_or_default();

    let sit_info = get_key_info(&cfg.sit, &sit_key);
    let prod_info = get_key_info(&cfg.prod, &prod_key);

    Ok(Settings {
        environment: cfg.environment,
        sit: CredentialView {
            partner_id: cfg.sit.partner_id,
            private_key: sit_key,
            key: sit_info,
        },
        prod: CredentialView {
            partner_id: cfg.prod.partner_id,
            private_key: prod_key,
            key: prod_info,
        },
    })
}

/// Helper untuk validasi dan pembaruan kredensial spesifik.
fn update_env_credential(
    cred: &mut StoredCredential,
    partner_id: &str,
    private_key: &str,
) -> Result<(), String> {
    cred.partner_id = partner_id.trim().to_string();

    let trimmed_key = private_key.trim();
    if !trimmed_key.is_empty() {
        parse_rsa_private_key(trimmed_key)?;
        cred.private_key = encrypt_secret(trimmed_key)?;
        cred.private_key_saved_at = Utc::now().to_rfc3339();
    } else if cred.private_key.is_empty() {
        return Err("Private key RSA wajib diisi".into());
    }

    if cred.partner_id.is_empty() {
        return Err("Partner ID wajib diisi".into());
    }
    Ok(())
}

/// IPC: Menyimpan pengaturan kredensial environment tertentu.
#[tauri::command]
pub fn paylabs_save_settings(input: SettingsInput) -> Result<(), String> {
    let mut cfg = load_config().unwrap_or_default();
    let target_env = if input.environment == ENV_PROD {
        ENV_PROD
    } else {
        ENV_SIT
    };
    cfg.environment = target_env.to_string();

    {
        let cred = cfg.current_credential_mut();
        update_env_credential(cred, &input.partner_id, &input.private_key)?;
    }

    save_config(&cfg)
}

/// IPC: Mengambil status ringkasan konfigurasi Paylabs yang aktif.
#[tauri::command]
pub fn paylabs_get_status() -> Result<Status, String> {
    let cfg = load_config().unwrap_or_default();
    let current = cfg.current_credential();
    let is_prod = cfg.environment == ENV_PROD;
    let is_configured = !current.partner_id.is_empty() && !current.private_key.is_empty();

    Ok(Status {
        environment: cfg.environment.clone(),
        base_url: cfg.get_base_url().to_string(),
        configured: is_configured,
        production: is_prod,
        problem: None,
    })
}

/// IPC: Mengambil daftar bank channel yang tersedia.
#[tauri::command]
pub fn paylabs_get_channels() -> Result<Vec<Channel>, String> {
    Ok(get_available_channels())
}

/// Format nominal desimal dengan trailing '.00' sesuai spesifikasi SNAP.
fn format_amount_decimal(amount_str: &str) -> Result<String, String> {
    let clean = amount_str.replace(',', "").trim().to_string();
    let val: f64 = clean
        .parse()
        .map_err(|_| "Format nominal tidak valid".to_string())?;
    if val <= 0.0 {
        return Err("Nominal harus lebih besar dari 0".into());
    }
    Ok(format!("{:.2}", val))
}

/// Menghitung tanggal kadaluarsa ISO-8601 di zona Jakarta.
fn calculate_expiry_date(days: i32) -> String {
    let valid_days = if days <= 0 { 30 } else { days };
    let expiry_time = Utc::now() + Duration::days(valid_days as i64);
    super::crypto::format_jakarta_timestamp(expiry_time)
}

/// Membangun CreateVaRequest dari form dan kredensial aktif.
fn build_va_request(
    form: &CreateVaForm,
    partner_id: &str,
    amount_formatted: &str,
) -> CreateVaRequest {
    let padded_partner = pad_partner_service_id(partner_id);
    let padded_customer = pad_customer_no(FIXED_CUSTOMER_NO);
    let va_number = compose_va_no(partner_id, FIXED_CUSTOMER_NO);
    let expiry_str = calculate_expiry_date(form.expiry_days.unwrap_or(30));
    let trx_id_val = form
        .trx_id
        .clone()
        .filter(|t| !t.trim().is_empty())
        .unwrap_or_else(|| format!("VA{}", Utc::now().format("%Y%m%d%H%M%S")));

    CreateVaRequest {
        partner_service_id: padded_partner,
        customer_no: padded_customer,
        virtual_account_no: va_number,
        virtual_account_name: form.name.trim().to_string(),
        virtual_account_email: form.email.clone().filter(|s| !s.trim().is_empty()),
        virtual_account_phone: form.phone.clone().filter(|s| !s.trim().is_empty()),
        trx_id: trx_id_val,
        total_amount: Amount {
            value: amount_formatted.to_string(),
            currency: "IDR".to_string(),
        },
        virtual_account_trx_type: "1".to_string(),
        additional_info: AdditionalInfo {
            payment_type: normalize_payment_type(&form.channel),
        },
        expired_date: expiry_str,
    }
}

/// IPC: Membuat Virtual Account multiple-use lewat SNAP API.
#[tauri::command]
pub async fn paylabs_create_va(form: CreateVaForm) -> Result<Exchange, String> {
    if form.name.trim().is_empty() {
        return Err("Nama pemilik VA wajib diisi".into());
    }
    let formatted_amount = format_amount_decimal(&form.amount)?;

    let cfg = load_config().unwrap_or_default();
    let cred = cfg.current_credential();
    if cred.partner_id.is_empty() || cred.private_key.is_empty() {
        return Err(format!(
            "Buka Pengaturan dan lengkapi kredensial untuk environment {}",
            cfg.environment
        ));
    }

    let dec_key = decrypt_secret(&cred.private_key)?;
    let rsa_key = parse_rsa_private_key(&dec_key)?;
    let request_payload = build_va_request(&form, &cred.partner_id, &formatted_amount);

    let exchange = send_snap_create_va(
        cfg.get_base_url(),
        &cred.partner_id,
        &rsa_key,
        &request_payload,
    )
    .await;

    if exchange.success {
        save_success_record(&cfg.environment, &form, &formatted_amount, &exchange);
    }
    Ok(exchange)
}

/// Helper untuk menyimpan riwayat transaksi yang sukses ke file lokal.
fn save_success_record(env: &str, form: &CreateVaForm, amount: &str, ex: &Exchange) {
    let d = &ex.parsed.virtual_account_data;
    let phone_val = if !d.virtual_account_phone.trim().is_empty() {
        Some(d.virtual_account_phone.clone())
    } else {
        form.phone.clone().filter(|p| !p.trim().is_empty())
    };

    let rec = HistoryRecord {
        id: generate_external_id(),
        environment: env.to_string(),
        channel: form.channel.clone(),
        channel_name: get_channel_name(&form.channel),
        virtual_account_no: d.virtual_account_no.clone(),
        virtual_account_phone: phone_val,
        name: if d.virtual_account_name.is_empty() {
            form.name.clone()
        } else {
            d.virtual_account_name.clone()
        },
        amount: amount.to_string(),
        trx_id: d.trx_id.clone(),
        expired_date: d.expired_date.clone(),
        created_at: Utc::now().to_rfc3339(),
    };
    let _ = append_history(rec);
}

/// IPC: Mengambil daftar riwayat transaksi dari disk.
#[tauri::command]
pub fn paylabs_get_history() -> Result<Vec<HistoryRecord>, String> {
    load_history()
}

/// IPC: Menghapus seluruh riwayat transaksi di disk.
#[tauri::command]
pub fn paylabs_clear_history() -> Result<(), String> {
    clear_history()
}
