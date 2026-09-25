//! File: lib.rs
//! Tujuan: Titik masuk utama pustaka Tauri, inisialisasi plugin, dan pendaftaran invoke handler.

mod commands;
mod paylabs;

use commands::window::{
    close_window, get_platform, get_window_size, is_window_maximized, minimize_window,
    resize_window, start_dragging_window, toggle_maximize_window,
};

/// Perintah sapaan sederhana untuk demonstrasi IPC
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

/// Menjalankan aplikasi Tauri dan mengikat seluruh handler perintah
#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    #[allow(unused_mut)]
    let mut builder = tauri::Builder::default();

    #[cfg(debug_assertions)]
    {
        builder = builder.plugin(
            tauri_plugin_mcp_bridge::Builder::new()
                .bind_address("127.0.0.1")
                .build(),
        );
    }

    builder
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_updater::Builder::new().build())
        .plugin(tauri_plugin_process::init())
        .invoke_handler(tauri::generate_handler![
            greet,
            get_platform,
            start_dragging_window,
            minimize_window,
            close_window,
            toggle_maximize_window,
            is_window_maximized,
            get_window_size,
            resize_window,
            paylabs::paylabs_get_settings,
            paylabs::paylabs_save_settings,
            paylabs::paylabs_get_status,
            paylabs::paylabs_get_channels,
            paylabs::paylabs_create_va,
            paylabs::paylabs_get_history,
            paylabs::paylabs_clear_history,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
