//! Module: Paylabs Config & DPAPI Storage
//! Tujuan: Menyimpan kredensial merchant (SIT & Prod) secara terenkripsi menggunakan Windows DPAPI.

use serde::{Deserialize, Serialize};
use std::fs;
use std::path::PathBuf;

pub const ENV_SIT: &str = "SIT";
pub const ENV_PROD: &str = "PROD";

pub const URL_SIT: &str = "https://sit-pay.paylabs.co.id";
pub const URL_PROD: &str = "https://pay.paylabs.co.id";

/// Model kredensial satu environment yang tersimpan di disk.
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct StoredCredential {
    #[serde(default)]
    pub partner_id: String,
    #[serde(default)]
    pub private_key: String,
    #[serde(default)]
    pub private_key_saved_at: String,
}

/// Struktur file config.json yang disimpan di AppData.
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct AppConfig {
    #[serde(default = "default_env")]
    pub environment: String,
    #[serde(default)]
    pub sit: StoredCredential,
    #[serde(default)]
    pub prod: StoredCredential,
}

fn default_env() -> String {
    ENV_SIT.to_string()
}

impl Default for AppConfig {
    fn default() -> Self {
        Self {
            environment: default_env(),
            sit: StoredCredential::default(),
            prod: StoredCredential::default(),
        }
    }
}

impl AppConfig {
    /// Mengambil endpoint URL sesuai environment aktif.
    pub fn get_base_url(&self) -> &'static str {
        if self.environment == ENV_PROD {
            URL_PROD
        } else {
            URL_SIT
        }
    }

    /// Mengambil referensi kredensial environment aktif.
    pub fn current_credential(&self) -> &StoredCredential {
        if self.environment == ENV_PROD {
            &self.prod
        } else {
            &self.sit
        }
    }

    /// Mengambil referensi mutable kredensial environment aktif.
    pub fn current_credential_mut(&mut self) -> &mut StoredCredential {
        if self.environment == ENV_PROD {
            &mut self.prod
        } else {
            &mut self.sit
        }
    }
}

/// Mendapatkan direktori penyimpanan konfigurasi Paylabs (%APPDATA%\PaylabsVA).
pub fn get_paylabs_dir() -> PathBuf {
    let base = dirs::data_dir().unwrap_or_else(|| PathBuf::from("."));
    base.join("PaylabsVA")
}

/// Mendapatkan path file config.json.
pub fn get_config_file_path() -> PathBuf {
    get_paylabs_dir().join("config.json")
}

// -------------------------------------------------------------
// Enkripsi Windows DPAPI Native
// -------------------------------------------------------------
#[cfg(target_os = "windows")]
#[repr(C)]
struct DataBlob {
    cb_data: u32,
    pb_data: *mut u8,
}

#[cfg(target_os = "windows")]
extern "system" {
    fn CryptProtectData(
        p_data_in: *const DataBlob,
        sz_data_descr: *const u16,
        p_optional_entropy: *const DataBlob,
        pv_reserved: *mut std::ffi::c_void,
        p_prompt_struct: *const std::ffi::c_void,
        dw_flags: u32,
        p_data_out: *mut DataBlob,
    ) -> i32;

    fn CryptUnprotectData(
        p_data_in: *const DataBlob,
        ppsz_data_descr: *mut *mut u16,
        p_optional_entropy: *const DataBlob,
        pv_reserved: *mut std::ffi::c_void,
        p_prompt_struct: *const std::ffi::c_void,
        dw_flags: u32,
        p_data_out: *mut DataBlob,
    ) -> i32;

    fn LocalFree(h_mem: *mut std::ffi::c_void) -> *mut std::ffi::c_void;
}

#[cfg(target_os = "windows")]
const CRYPTPROTECT_UI_FORBIDDEN: u32 = 0x1;

/// Enkripsi data menggunakan Windows DPAPI.
#[cfg(target_os = "windows")]
pub fn dpapi_protect(bytes: &[u8]) -> Result<Vec<u8>, String> {
    if bytes.is_empty() {
        return Ok(Vec::new());
    }
    let in_blob = DataBlob {
        cb_data: bytes.len() as u32,
        pb_data: bytes.as_ptr() as *mut u8,
    };
    let mut out_blob = DataBlob {
        cb_data: 0,
        pb_data: std::ptr::null_mut(),
    };

    let res = unsafe {
        CryptProtectData(
            &in_blob,
            std::ptr::null(),
            std::ptr::null(),
            std::ptr::null_mut(),
            std::ptr::null(),
            CRYPTPROTECT_UI_FORBIDDEN,
            &mut out_blob,
        )
    };

    if res == 0 {
        return Err("Windows DPAPI gagal mengenkripsi kredensial".to_string());
    }

    let slice = unsafe { std::slice::from_raw_parts(out_blob.pb_data, out_blob.cb_data as usize) };
    let output = slice.to_vec();
    unsafe { LocalFree(out_blob.pb_data as *mut _) };
    Ok(output)
}

/// Dekripsi data menggunakan Windows DPAPI.
#[cfg(target_os = "windows")]
pub fn dpapi_unprotect(bytes: &[u8]) -> Result<Vec<u8>, String> {
    if bytes.is_empty() {
        return Ok(Vec::new());
    }
    let in_blob = DataBlob {
        cb_data: bytes.len() as u32,
        pb_data: bytes.as_ptr() as *mut u8,
    };
    let mut out_blob = DataBlob {
        cb_data: 0,
        pb_data: std::ptr::null_mut(),
    };

    let res = unsafe {
        CryptUnprotectData(
            &in_blob,
            std::ptr::null_mut(),
            std::ptr::null(),
            std::ptr::null_mut(),
            std::ptr::null(),
            CRYPTPROTECT_UI_FORBIDDEN,
            &mut out_blob,
        )
    };

    if res == 0 {
        return Err("Windows DPAPI gagal mendekripsi kredensial".to_string());
    }

    let slice = unsafe { std::slice::from_raw_parts(out_blob.pb_data, out_blob.cb_data as usize) };
    let output = slice.to_vec();
    unsafe { LocalFree(out_blob.pb_data as *mut _) };
    Ok(output)
}

/// Fallback enkripsi untuk non-Windows OS (transparent).
#[cfg(not(target_os = "windows"))]
pub fn dpapi_protect(bytes: &[u8]) -> Result<Vec<u8>, String> {
    Ok(bytes.to_vec())
}

/// Fallback dekripsi untuk non-Windows OS (transparent).
#[cfg(not(target_os = "windows"))]
pub fn dpapi_unprotect(bytes: &[u8]) -> Result<Vec<u8>, String> {
    Ok(bytes.to_vec())
}

/// Enkripsi string private key ke Base64 DPAPI blob.
pub fn encrypt_secret(plain: &str) -> Result<String, String> {
    if plain.trim().is_empty() {
        return Ok(String::new());
    }
    let protected = dpapi_protect(plain.as_bytes())?;
    Ok(base64::Engine::encode(
        &base64::engine::general_purpose::STANDARD,
        protected,
    ))
}

/// Dekripsi Base64 DPAPI blob ke teks asli.
pub fn decrypt_secret(cipher_b64: &str) -> Result<String, String> {
    if cipher_b64.trim().is_empty() {
        return Ok(String::new());
    }
    let der = base64::Engine::decode(&base64::engine::general_purpose::STANDARD, cipher_b64.trim())
        .map_err(|e| format!("Base64 secret corrupt: {}", e))?;
    let unprotected = dpapi_unprotect(&der)?;
    String::from_utf8(unprotected).map_err(|e| format!("UTF-8 decrypt error: {}", e))
}

/// Membaca konfigurasi dari disk file.
pub fn load_config() -> Result<AppConfig, String> {
    let path = get_config_file_path();
    if !path.exists() {
        return Ok(AppConfig::default());
    }
    let content = fs::read_to_string(&path)
        .map_err(|e| format!("Gagal membaca file config.json: {}", e))?;
    serde_json::from_str::<AppConfig>(&content)
        .map_err(|e| format!("Format JSON config tidak valid: {}", e))
}

/// Menyimpan konfigurasi ke disk file.
pub fn save_config(cfg: &AppConfig) -> Result<(), String> {
    let dir = get_paylabs_dir();
    if !dir.exists() {
        fs::create_dir_all(&dir)
            .map_err(|e| format!("Gagal membuat direktori config Paylabs: {}", e))?;
    }
    let path = get_config_file_path();
    let json = serde_json::to_string_pretty(cfg)
        .map_err(|e| format!("Gagal serialize config JSON: {}", e))?;
    fs::write(&path, json).map_err(|e| format!("Gagal menulis file config.json: {}", e))
}
