# 🖥️ Workspace Rules: Tauri v2 & Cross-Platform Desktop Styling

Pedoman dan aturan baku pengembangan aplikasi desktop berbasis **Tauri v2 (Rust + React + TypeScript)** dengan **Consistent & Platform-Harmonized Styling (Windows & macOS)** pada proyek ini.

---

## 1. Prinsip Arsitektur Window & Canvas

1. **Canvas Transparan & Konten Solid**:
   - `src-tauri/tauri.conf.json` wajib menyetel:
     ```json
     {
       "decorations": false,
       "transparent": true,
       "shadow": false
     }
     ```
   - Di CSS (`index.css`), `html, body, #root` wajib `background-color: transparent;`.
   - Konten di dalam `.desktop-window-container` wajib **100% SOLID OPAQUE** (`background-color: var(--bg-app);`). Jangan gunakan `backdrop-filter: blur(...)` pada container utama agar teks ClearType tajam dan performa GPU ringan bebas flickering.
2. **Sudut Membulat (Rounded Corners 12px)**:
   - Jendela normal menggunakan `border-radius: 12px;` dan `border: 1px solid var(--border-subtle);`.
   - Saat maximized (`.is-maximized`), sudut wajib `border-radius: 0 !important;` dan `border: none !important;`.
3. **Pemberantasan Garis Border Hitam**:
   - Dilarang mengaktifkan `"shadow": true` pada undecorated window di Windows karena memicu injeksi border hitam 1px dari Windows DWM.
   - Dilarang memberikan border gelap kontras di Light Mode. Gunakan token `--border-subtle: #d0d7de`.

---

## 2. Standar Window Chrome & Interaksi Native

1. **Penempatan Kontrol Window (Adaptive Layout)**:
   - **macOS Style**: Tombol Traffic Lights (🔴🟡🟢) wajib di **kiri atas** dengan micro-icons SVG native Apple HIG (✕, −, ⤢) yang muncul serentak saat container di-hover.
   - **Windows Style**: Tombol Fluent Controls (Minimize, Maximize/Restore, Close) wajib di **kanan atas** dengan hover merah khas Close (`#e81123`).
2. **Click and Drag Window**:
   - Titlebar wajib menyertakan atribut `-webkit-app-region: drag;` dan `data-tauri-drag-region`.
   - Wajib mengikat event handler `onMouseDown` yang memanggil Rust IPC `start_dragging_window` secara programmatic untuk menjamin kompatibilitas Webview2.
   - Teks atau elemen non-interaktif di dalam drag region wajib diberi `pointer-events: none;`.
   - Semua tombol, input, dan link di titlebar wajib diberi class `.no-drag` dan `-webkit-app-region: no-drag;`.
   - Titlebar wajib mendukung **Double-Click** untuk toggle maximize/restore window.
3. **Disabled Browser Context Menu**:
   - Seluruh aplikasi desktop wajib menonaktifkan klik kanan bawaan browser (`contextmenu`) via `setupContextMenuGuard()` di `src/main.tsx` untuk menjaga kesan software desktop native profesional.
4. **Konsistensi Ukuran Action Buttons di Titlebar**:
   - Seluruh tombol aksi di titlebar (Search pill, Theme toggle, Style switcher) WAJIB menggunakan tinggi tetap yang seragam dengan token `--titlebar-btn-height: 26px;`, `box-sizing: border-box;`, dan `display: inline-flex; align-items: center; justify-content: center;`.
   - Dilarang mengandalkan auto-height atau padding vertikal yang tidak konsisten pada tombol titlebar agar tingginya tetap 100% presisi dan tidak melonjak saat beralih antara Mode Terang (*Light Mode*) dan Mode Gelap (*Dark Mode*).

---

## 3. Keyboard Shortcuts & Keybindings

1. **Abstraksi Tombol `Mod`**:
   - Semua pendefinisian shortcut wajib menggunakan token `Mod` (misal: `Mod+K`, `Mod+Shift+P`).
   - Tampilkan shortcut menggunakan utilitas `formatShortcut(shortcut, platform)`:
     - Di macOS: `"⌘K"`, `"⌘⇧P"`
     - Di Windows/Linux: `"Ctrl + K"`, `"Ctrl + Shift + P"`
   - Gunakan elemen `<kbd className="shortcut-badge">` untuk rendering visual yang rapi.

---

## 4. Tema (Light/Dark Mode) & Persistensi Data

1. **CSS Design Tokens Terpusat**:
   - Semua warna wajib diambil dari variabel CSS di `src/styles/tokens.css` (hindari hardcoded hex colors di komponen).
   - Tema dikendalikan oleh atribut `data-theme="dark"` atau `data-theme="light"` pada elemen `document.documentElement`.
2. **Data Persistence**:
   - Preferensi tema wajib disimpan ke persistent storage (`localStorage` via `themeStorage.ts`).
   - Selalu sediakan fallback ke `prefers-color-scheme` sistem operasi jika belum ada preferensi tersimpan.

---

---

## 5. Zero-Shadow Popovers, Dropdowns & Tooltips (Anti-Overlap)

1. **Pemberantasan Bayangan Luar pada Popovers**:
   - Seluruh popovers, dropdown select, dan tooltip dilarang menggunakan bayangan luar tebal (`box-shadow: none !important;`) untuk mencegah bayangan meluber keluar dan bertabrakan (*overlap*) dengan batas melengkung jendela desktop frameless (`border-radius: 12px;`).
   - Batas popover wajib murni didefinisikan oleh garis tepi halus `border: 1px solid var(--border-subtle);`.
2. **Zero-Clipping Tooltip Offset**:
   - Tooltip yang diposisikan di bawah elemen titlebar wajib diberi jarak aman (misal: `top: calc(100% + 10px);`) agar sisi atas tooltip melayang bersih di bawah garis `border-bottom` titlebar (38px) tanpa terpotong (*clipped*).
   - Tooltip hanya boleh dipicu oleh *hover*, dan wajib otomatis tertutup saat elemen diklik (`onClickCapture`).

---

## 6. Spotlight Command Palette & macOS Notification Banner (Toast)

1. **Spotlight Command Palette (⌘K / Ctrl+K)**:
   - Menggunakan material *Visual Vibrancy Translucency* (`backdrop-filter: saturate(190%) blur(32px);`).
   - Latar belakang semi-transparan adaptif (`rgba(255, 255, 255, 0.82)` di Light Mode, `rgba(30, 32, 38, 0.86)` di Dark Mode).
   - *Layered multiple shadows* 4 lapis dengan batas mikro `0 0 0 0.5px`.
   - Sudut membulat `border-radius: 16px;`, input SF Pro Display 18px, dan item terpilih disorot dengan warna aksen biru Apple penuh dan teks putih kontras.
2. **macOS Notification Banner (Toast)**:
   - Wajib diposisikan di **kanan atas (*top-right*)** layar (`top: 48px; right: 16px;`), melayang tepat di bawah titlebar (bukan di pojok kanan bawah gaya Windows).
   - Kapsul melengkung `border-radius: 14px;` dengan efek kaca berembun (`backdrop-filter: saturate(190%) blur(24px);`).
   - Squircle icon badge aplikasi (`32x32px`, `border-radius: 8px`) dengan warna sistem Apple (`success`, `info`, `warning`, `error`).
   - Tombol dismiss mikro bulat (20px, `border-radius: 50%`) dan header identitas aplikasi (`Antigravity • sekarang`).

---

## 7. Sidebar Collapsible: Zero-Shift Geometry & Equal Margins

1. **Zero-Shift Icon Layout (Koordinat Absolut Terkunci)**:
   - Posisi ikon menu DILARANG BERGESER satu pixel pun saat transisi expand atau collapse.
   - **Dilarang keras** menggunakan `justify-content: center;` pada nav-item saat collapsed karena `justify-content` adalah properti *non-animatable* yang menyebabkan ikon meloncat seketika di awal animasi.
   - Selalu gunakan `justify-content: flex-start;` dan `padding-left: 9px;` secara konstan pada kedua mode.
   - Saat collapsed, tombol menyusut menjadi bujur sangkar `38px x 38px`. Dengan slot ikon 20px, ikon otomatis berada di tengah tombol `(38 - 20) / 2 = 9px` secara alami tanpa mengubah koordinat X absolut.
2. **Margin Simetris 4 Sisi saat Collapse**:
   - Container sidebar wajib menggunakan padding seragam `12px` di semua sisi (`padding: 12px;`).
   - Lebar sidebar saat collapsed adalah `63px` (`12px kiri + 38px tombol + 12px kanan + 1px border = 63px`).
   - Menghasilkan margin 12px yang 100% identik di sisi atas, bawah, kiri, dan kanan.
3. **Staged Animation Timeline**:
   - **Saat Collapse**: Teks label meluncur ke kiri dan menghilang instan (0ms - 80ms) terlebih dahulu. Sidebar menunggu teks hilang (`delay: 0.08s - 0.1s`), barulah kemudian lebar sidebar menciut (*collapse*).
   - **Saat Expand**: Sidebar langsung melebar penuh dari 64px ke 220px terlebih dahulu (0ms - 220ms). Tepat saat pelebaran selesai di 220ms, teks label baru meluncur masuk secara halus dari `translateX(-8px)` ke `translateX(0)` (*silky smooth fluid reveal*).

---

## 8. Standar Kode & Kualitas (QA)

1. **Maksimal 30 baris per fungsi**, *early return*, dan *no deep nesting* (maksimal 3 level).
2. **Docstring JSDoc / Rust doc comments lengkap dalam Bahasa Indonesia**.
3. **Setiap fitur baru wajib disertai automated unit test** (Vitest dengan pola AAA).
