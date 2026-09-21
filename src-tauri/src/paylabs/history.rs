//! Module: Paylabs History Storage
//! Tujuan: Menyimpan dan memuat riwayat pembuatan Virtual Account di %APPDATA%\PaylabsVA\history.json.

use super::config::get_paylabs_dir;
use super::models::HistoryRecord;
use std::fs;
use std::path::PathBuf;

/// Mendapatkan path file history.json.
pub fn get_history_file_path() -> PathBuf {
    get_paylabs_dir().join("history.json")
}

/// Membaca daftar riwayat transaksi dari disk (terbaru di posisi pertama).
pub fn load_history() -> Result<Vec<HistoryRecord>, String> {
    let path = get_history_file_path();
    if !path.exists() {
        return Ok(Vec::new());
    }
    let content = fs::read_to_string(&path)
        .map_err(|e| format!("Gagal membaca history.json: {}", e))?;
    serde_json::from_str::<Vec<HistoryRecord>>(&content)
        .map_err(|e| format!("Format JSON riwayat tidak valid: {}", e))
}

/// Menambahkan satu catatan riwayat transaksi ke disk.
pub fn append_history(record: HistoryRecord) -> Result<(), String> {
    let dir = get_paylabs_dir();
    if !dir.exists() {
        fs::create_dir_all(&dir)
            .map_err(|e| format!("Gagal membuat direktori history Paylabs: {}", e))?;
    }

    let mut records = load_history().unwrap_or_default();
    records.insert(0, record);

    let json = serde_json::to_string_pretty(&records)
        .map_err(|e| format!("Gagal serialize JSON riwayat: {}", e))?;
    let path = get_history_file_path();
    fs::write(&path, json).map_err(|e| format!("Gagal menyimpan riwayat ke disk: {}", e))
}

/// Menghapus seluruh catatan riwayat transaksi di disk.
pub fn clear_history() -> Result<(), String> {
    let path = get_history_file_path();
    if path.exists() {
        fs::remove_file(&path).map_err(|e| format!("Gagal menghapus file riwayat: {}", e))?;
    }
    Ok(())
}
