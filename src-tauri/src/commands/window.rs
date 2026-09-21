//! Module: Window Commands
//! Tujuan: Menyediakan perintah IPC Tauri untuk manipulasi window, deteksi platform, dan native drag.

use tauri::Window;

/// Mengambil nama platform sistem operasi saat ini secara akurat dari Rust runtime.
///
/// # Return
/// * `String` - Identifikasi platform: "macos", "windows", atau "linux"
#[tauri::command]
pub fn get_platform() -> String {
    #[cfg(target_os = "macos")]
    return "macos".to_string();

    #[cfg(target_os = "windows")]
    return "windows".to_string();

    #[cfg(target_os = "linux")]
    return "linux".to_string();

    #[cfg(not(any(target_os = "macos", target_os = "windows", target_os = "linux")))]
    return "unknown".to_string();
}

/// Memulai drag window secara native saat mouse ditekan di area drag.
///
/// # Arguments
/// * `window` - Handle window pemanggil
#[tauri::command]
pub fn start_dragging_window(window: Window) -> Result<(), String> {
    window
        .start_dragging()
        .map_err(|e| format!("Gagal memulai drag window: {}", e))
}

/// Meminimalkan window aplikasi ke taskbar / dock.
///
/// # Arguments
/// * `window` - Handle window pemanggil
#[tauri::command]
pub fn minimize_window(window: Window) -> Result<(), String> {
    window.minimize().map_err(|e| format!("Gagal meminimalkan window: {}", e))
}

/// Menutup window aplikasi.
///
/// # Arguments
/// * `window` - Handle window pemanggil
#[tauri::command]
pub fn close_window(window: Window) -> Result<(), String> {
    window.close().map_err(|e| format!("Gagal menutup window: {}", e))
}

/// Beralih antara mode maximize dan restore window.
///
/// # Arguments
/// * `window` - Handle window pemanggil
#[tauri::command]
pub fn toggle_maximize_window(window: Window) -> Result<bool, String> {
    let is_maximized = window
        .is_maximized()
        .map_err(|e| format!("Gagal memeriksa status maximize: {}", e))?;

    if is_maximized {
        window
            .unmaximize()
            .map_err(|e| format!("Gagal mengembalikan ukuran window: {}", e))?;
        Ok(false)
    } else {
        window
            .maximize()
            .map_err(|e| format!("Gagal memaksimalkan window: {}", e))?;
        Ok(true)
    }
}

/// Memeriksa apakah window saat ini sedang dalam status maximized.
///
/// # Arguments
/// * `window` - Handle window pemanggil
#[tauri::command]
pub fn is_window_maximized(window: Window) -> Result<bool, String> {
    window
        .is_maximized()
        .map_err(|e| format!("Gagal membaca status maximize: {}", e))
}

/// Representasi dimensi logical ukuran window (lebar dan tinggi dalam piksel logical).
#[derive(Debug, Clone, Copy, serde::Serialize, serde::Deserialize)]
pub struct WindowDimensions {
    pub width: f64,
    pub height: f64,
}

/// Mendapatkan ukuran jendela saat ini dalam logical pixel.
///
/// # Arguments
/// * `window` - Handle window pemanggil
///
/// # Returns
/// * `Result<WindowDimensions, String>` - Dimensi logical window saat ini
#[tauri::command]
pub fn get_window_size(window: Window) -> Result<WindowDimensions, String> {
    let factor = window
        .scale_factor()
        .map_err(|e| format!("Gagal membaca scale factor: {}", e))?;

    let physical_size = window
        .inner_size()
        .map_err(|e| format!("Gagal membaca ukuran window: {}", e))?;

    let logical_size = physical_size.to_logical::<f64>(factor);
    Ok(WindowDimensions {
        width: logical_size.width,
        height: logical_size.height,
    })
}

/// Mengubah ukuran jendela secara presisi ke dimensi logical dan memusatkannya jika diminta.
///
/// # Arguments
/// * `window` - Handle window pemanggil
/// * `width` - Lebar target dalam logical pixel
/// * `height` - Tinggi target dalam logical pixel
/// * `center` - Apakah window harus dipusatkan di layar monitor setelah resize
#[tauri::command]
pub fn resize_window(
    window: Window,
    width: f64,
    height: f64,
    center: Option<bool>,
) -> Result<(), String> {
    // Unmaximize terlebih dahulu jika jendela sedang dalam mode maximized
    if window.is_maximized().unwrap_or(false) {
        let _ = window.unmaximize();
    }

    let target_size = tauri::Size::Logical(tauri::LogicalSize { width, height });
    window
        .set_size(target_size)
        .map_err(|e| format!("Gagal mengubah ukuran window: {}", e))?;

    if center.unwrap_or(true) {
        let _ = window.center();
    }

    Ok(())
}
