---
name: tauri-desktop-style
description: >-
  Skill untuk pengembangan aplikasi desktop Tauri v2 dengan konsistensi styling
  dan UX antara Windows dan macOS. Aktifkan skill ini ketika menambah fitur desktop,
  membuat window baru, mengatur window chrome/titlebar, styling macOS vs Windows,
  mengelola keybindings cross-platform, atau memperbaiki isu rendering desktop.
---

# 🚀 Tauri Desktop & Cross-Platform Styling Guide

Skill ini memandu pengembangan antarmuka desktop modern menggunakan **Tauri v2 (Rust)** dan **React TypeScript + Vite** dengan pendekatan **Consistent & Platform-Harmonized Desktop UX** (Windows & macOS).

---

## 1. Alur Menambah Perintah IPC Rust Baru

Saat membuat interaksi native baru antara Frontend dan Backend Rust:

1. **Buat Fungsi Command di Rust**:
   Buka atau buat file di `src-tauri/src/commands/<nama_modul>.rs`:
   ```rust
   use tauri::Window;

   #[tauri::command]
   pub fn my_desktop_command(window: Window, param: String) -> Result<String, String> {
       // Logika native desktop (maksimal 30 baris)
       Ok(format!("Selesai: {}", param))
   }
   ```
2. **Daftarkan di `src-tauri/src/lib.rs`**:
   Tambahkan fungsi command ke dalam `tauri::generate_handler![..., my_desktop_command]`.
3. **Buat Wrapper TypeScript di `src/services/`**:
   Buat fungsi async dengan penanganan error dan fallback aman saat diuji di browser:
   ```typescript
   export async function callMyDesktopCommand(param: string): Promise<string> {
     if (!isTauriEnvironment()) {
       return `Mock fallback: ${param}`;
     }
     try {
       const { invoke } = await import('@tauri-apps/api/core');
       return await invoke<string>('my_desktop_command', { param });
     } catch (error) {
       console.error('[service] Gagal memanggil my_desktop_command:', error);
       throw error;
     }
   }
   ```

---

## 2. Standar Window Frame & Canvas (Anti-Artefak Hitam)

Konfigurasi window di `src-tauri/tauri.conf.json`:
- `"decorations": false` — Wajib untuk custom window chrome seragam.
- `"transparent": true` — Wajib agar area di luar sudut melengkung tembus pandang tanpa warna hitam.
- `"shadow": false` — Wajib untuk mencegah Windows DWM menginjeksi border hitam 1px pada jendela frameless.

Di CSS (`src/styles/index.css`):
- `html, body, #root`: `background-color: transparent;`
- `.desktop-window-container`:
  - `background-color: var(--bg-app);` (Wajib solid opaque, jangan gunakan backdrop blur pada root container).
  - `border-radius: 12px;`
  - `border: 1px solid var(--border-subtle);`
  - Saat `.is-maximized`: `border-radius: 0 !important; border: none !important;`

---

## 3. Checklist Window Chrome (macOS vs Windows)

Gunakan hook `const { platform, config } = usePlatform()`:

| Fitur | macOS Style | Windows Style |
|---|---|---|
| **Posisi Window Controls** | Kiri atas (`MacTrafficLights`) | Kanan atas (`WinWindowControls`) |
| **Ikon Kontrol** | Bulatan 12px (🔴🟡🟢) dengan micro-icons SVG saat hover | Tombol 46x38px Fluent (Min, Max/Restore, Close) |
| **Hover Close Button** | Dot merah menggelap `#e0443e` | Background merah `#e81123`, teks/ikon putih |
| **Modifier Key** | Simbol Command `⌘` (`formatShortcut('Mod+K', 'macos')` -> `"⌘K"`) | Teks `Ctrl` (`formatShortcut('Mod+K', 'windows')` -> `"Ctrl + K"`) |
| **Drag Region** | `-webkit-app-region: drag` + programmatic IPC `start_dragging_window` saat `onMouseDown` | Sama |
| **Double Click** | Toggle maximize/restore | Sama |

---

---

## 4. Pola Geometri Presisi Desktop (Sidebar, Popover & Toast)

### A. Sidebar Collapsible: Zero-Shift Geometry & Margin 4 Sisi Simetris
- **Masalah umum**: Ikon meloncat/bergeser saat expand/collapse karena pergantian `justify-content` dari `flex-start` ke `center`.
- **Solusi Baku**:
  1. `justify-content: flex-start;` dan `padding-left: 9px;` **selalu konstan** di kedua mode.
  2. Bungkus ikon dengan slot dimensi tetap `20px x 20px; flex-shrink: 0;`.
  3. Saat collapsed, tombol menyusut menjadi bujur sangkar `38px x 38px`. Ikon otomatis berada tepat di tengah tombol `(38 - 20) / 2 = 9px` tanpa memindahkan koordinat X absolut (selalu di `21px`).
  4. Container sidebar menggunakan padding seragam `12px` di semua sisi, dengan lebar collapsed `63px` (`12px + 38px + 12px + 1px border = 63px`), menghasilkan margin 12px yang identik di sisi atas, bawah, kiri, dan kanan.
  5. **Staged Animation**: Saat collapse teks fade-out instan (80ms) baru sidebar menciut (delay 100ms); saat expand sidebar melebar penuh dulu baru teks meluncur masuk (delay 220ms).

### B. Zero-Shadow Popovers, Dropdowns & Tooltips
- Dilarang keras menggunakan bayangan luar (`box-shadow: none !important;`) pada popovers, dropdown select, dan tooltip agar tidak menabrak batas melengkung jendela desktop frameless.
- Tooltip titlebar wajib diberi offset vertikal aman (`top: calc(100% + 10px);`) agar sisi atasnya tidak terpotong garis `border-bottom` titlebar.

### C. macOS Notification Banner (Toast)
- Diposisikan di kanan atas (*top-right*, `top: 48px; right: 16px;`) di bawah titlebar.
- Mengadopsi sudut membulat 14px, efek kaca berembun (`saturate(190%) blur(24px)`), squircle icon 32x32px dengan warna Apple HIG, dan tombol close mikro bulat 20px.

---

## 5. Integrasi MCP Server Tauri (`tauri-plugin-mcp-bridge`)

Protokol integrasi Model Context Protocol (MCP) untuk aplikasi Tauri v2 menggunakan `@hypothesi/tauri-mcp-server` dan crate Rust `tauri-plugin-mcp-bridge`.

### A. Arsitektur & Kemampuan Utama
1. **UI Automation**:
   - Webview screenshot capture secara langsung.
   - Simulasi click, typing, scrolling, dan query elemen DOM native desktop.
2. **IPC Monitoring**:
   - Menangkap dan menginspeksi panggilan IPC Tauri (`invoke`, `emit`, parameter payload, return data, dan latency) secara real-time.
3. **Window State & Environment**:
   - Memeriksa koordinat jendela (`x`, `y`, `width`, `height`), status fokus, maximize, minimize, versi Tauri, OS arch, dan debug state.
4. **Console & System Logs**:
   - Streaming webview console logs dan log Rust backend via WebSocket bridge.

### B. Konfigurasi Backend Rust (Development Safe)
Tambahkan crate ke `src-tauri/Cargo.toml`:
```toml
[dependencies]
tauri-plugin-mcp-bridge = "0.2"
```

Daftarkan plugin di `src-tauri/src/lib.rs` dengan pembatas `#[cfg(debug_assertions)]` agar hanya aktif pada environment dev:
```rust
use tauri_plugin_mcp_bridge::Builder as McpBridgeBuilder;

pub fn run() {
    let mut builder = tauri::Builder::default();

    #[cfg(debug_assertions)]
    {
        // Bind ke 127.0.0.1 untuk keamanan isolasi lokal
        builder = builder.plugin(
            McpBridgeBuilder::new()
                .bind_address("127.0.0.1")
                .build(),
        );
    }

    builder
        .plugin(tauri_plugin_opener::init())
        // ... handlers lainnya
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
```

### C. Menjalankan MCP Server
AI Assistant atau CLI terhubung melalui:
```bash
npx -y @hypothesi/tauri-mcp-server
```
Atau via terminal CLI runner:
```bash
npx -y @hypothesi/tauri-mcp-cli driver-session start --port 9223
```

---

## 6. Checklist Kualitas & QA Wajib

Sebelum menyerahkan kode fitur baru ke user, pastikan:

```bash
# 1. Jalankan automated test (wajib 100% pass)
bun run test

# 2. Periksa tipe TypeScript (wajib 0 error)
npx tsc --noEmit

# 3. Periksa kompilasi backend Rust (wajib lulus)
cargo check --manifest-path src-tauri/Cargo.toml

# 4. Validasi bundle produksi frontend
bun run build
```
