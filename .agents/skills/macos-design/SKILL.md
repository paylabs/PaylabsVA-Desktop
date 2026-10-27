---
name: macos-design
description: >-
  Skill panduan komprehensif perancangan, arsitektur, dan implementasi antarmuka macOS native
  berbasis Tauri v2 + React TypeScript. Digunakan untuk merancang window chrome & traffic lights,
  vibrancy translucency, collapsible sidebar zero-shift, command palette ⌘K, top-right toast banner,
  serta sebagai panduan menggunakan base app ini untuk membangun aplikasi desktop baru.
metadata:
  mcpmarket-version: 1.1.0
---

# 🍏 macOS Native Desktop App Skill & Base App Architecture

Skill ini adalah acuan arsitektur dan panduan desain resmi untuk membangun aplikasi desktop native bergaya **macOS (Apple Human Interface Guidelines)** menggunakan stack **Tauri v2 (Rust backend) + React 19 + TypeScript + Vite**.

Aplikasi ini dirancang sebagai **Base App (Boilerplate / Starter Template)** berkualitas tinggi yang siap digunakan ulang untuk berbagai aplikasi desktop lainnya tanpa harus membangun fondasi window chrome, interaksi, dan styling dari nol.

---

## 🏛️ Fondasi Arsitektur Base App

Base app ini mengadopsi pemisahan modular antara platform chrome, navigasi, interaksi modal, dan konten domain:

```
┌────────────────────────────────────────────────────────────────────────┐
│  🔴 🟡 🟢   Adaptive Titlebar (Drag Region, Quick Search, Theme Toggle)│ ← 38px
├──────────────┬─────────────────────────────────────────────────────────┤
│              │                                                         │
│  Collapsible │  Main Content Area (`.main-content-scroll`)             │
│  Sidebar     │  - Scroll terisolasi bebas window bounce                │
│  (Zero-Shift │  - Kartu & tabel bergaya macOS Inset Grouped            │
│  Geometry)   │  - Slide-out Inspector Detail Panel (opsional)          │
│              │                                                         │
├──────────────┴─────────────────────────────────────────────────────────┤
│  Status Bar (Environment info, Updater pill, Versi app)                │ ← 24px
└────────────────────────────────────────────────────────────────────────┘
  ▲ Overlays Terintegrasi:
    • Spotlight Command Palette (⌘K)
    • Apple HIG Toast Notification Banner (Top-Right)
    • Modal Dialogs & Tooltips (Zero-Shadow Boundary)
```

---

## 📂 Struktur Modul Base App untuk Digunakan Ulang

Ketika menduplikasi atau mengadaptasi base app ini untuk aplikasi desktop baru:

| Folder / File | Fungsi & Peran | Tindakan Saat Menggunakan Base App |
|---|---|---|
| `src-tauri/tauri.conf.json` | Konfigurasi window Tauri (frameless, transparan, dimensi) | Ubah `productName`, `identifier`, dan ukuran awal window |
| `src/styles/tokens.css` | Design tokens terpusat (warna, radius, font, light/dark) | Sesuaikan `--accent-primary` dengan identitas brand baru |
| `src/styles/macosVibrancy.css`| Translucency, Command Palette, Toast banner, Inspector | Gunakan langsung (komponen inti macOS) |
| `src/components/chrome/` | `AdaptiveTitlebar`, `MacTrafficLights`, `WinWindowControls` | Gunakan langsung (otomatis deteksi platform) |
| `src/components/layout/` | `AppShell`, `Sidebar`, `ContentLayout` | Sesuaikan navigasi tab dan ikon sidebar di `Sidebar.tsx` |
| `src/components/macos/` | `MacCommandPalette`, `MacDetailPanel` | Sesuaikan daftar perintah dan aksi di `commandPaletteItems.ts` |
| `src/components/ui/` | `Toast`, `Modal`, `CustomSelect`, `Tooltip` | Gunakan langsung sebagai komponen primitif UI |
| `src/hooks/` | `useWindowState`, `useTheme`, `useToast`, `usePlatform` | Gunakan langsung untuk state window dan tema |
| `src/services/` | `windowService.ts`, `themeStorage.ts` | Gunakan langsung untuk IPC Tauri dan penyimpanan tema |
| `src/components/paylabs/` | Tampilan spesifik bisnis (contoh: generator VA) | **Ganti** dengan tampilan/fitur aplikasi baru Anda |

---

## 💎 Sepuluh Aturan Emas macOS Native Style

1. **Window Canvas Transparan & Solid Container**:
   - `tauri.conf.json`: `"decorations": false`, `"transparent": true`, `"shadow": false`.
   - `html, body, #root`: `background: transparent;`.
   - `.desktop-window-container`: Solid opaque `background-color: var(--bg-app);` dengan `border-radius: 12px;` dan border tipis `1px solid var(--border-subtle);`.
   - Mencegah artefak sudut hitam Windows DWM dan flickering GPU.

2. **Traffic Lights Terintegrasi (Kiri Atas)**:
   - Tiga bulatan 12px (🔴 Close `#ff5f56`, 🟡 Minimize `#ffbd2e`, 🟢 Maximize `#27c93f`).
   - Micro-icons SVG Apple HIG (✕, −, ⤢) muncul serentak saat container di-hover.

3. **Titlebar Drag Region & Tombol Presisi**:
   - Titlebar tinggi tetap 38px (`--titlebar-height`).
   - Drag region `-webkit-app-region: drag` dipadukan dengan IPC programmatic `start_dragging_window` pada `onMouseDown`.
   - Seluruh action buttons di titlebar wajib memiliki tinggi tetap seragam 26px (`--titlebar-btn-height`) bebas pergeseran saat ganti tema.

4. **Sidebar Collapsible Zero-Shift Geometry**:
   - Koordinat X ikon terkunci absolut di `21px` (`padding-left: 9px` konstan).
   - Dimensi slot ikon tetap `20x20px`, tombol menyusut menjadi bujur sangkar `38x38px`.
   - Margin 4 sisi simetris `12px` (lebar collapsed tepat `63px`).
   - Staged animation: Teks fade-out lebih dulu saat collapse; saat expand, sidebar melebar dulu baru teks meluncur masuk.

5. **Spotlight Command Palette (⌘K / Ctrl+K)**:
   - Shortcut universal `⌘K` untuk membuka palette pencarian dan aksi cepat.
   - Material translucency `backdrop-filter: saturate(190%) blur(36px);`.
   - Navigasi keyboard penuh (`ArrowUp`, `ArrowDown`, `Enter`, `Esc`).

6. **macOS Notification Banner (Toast di Kanan Atas)**:
   - Terletak di kanan atas (`top: 48px; right: 16px;`), melayang tepat di bawah titlebar.
   - Kapsul melengkung 14px, translucency `blur(24px)`, squircle icon 32x32px berlatar belakang Apple system tint, dan tombol dismiss mikro bulat 20px.

7. **Zero-Shadow Popovers & Tooltips (Anti-Clipping)**:
   - Dilarang keras menggunakan bayangan luar (`box-shadow: none !important;`) pada popovers, dropdown, dan tooltip agar tidak meluber menabrak batas melengkung jendela 12px.
   - Batas didefinisikan murni oleh garis tepi halus `border: 1px solid var(--border-subtle);`.

8. **Slide-Out Inspector Detail Panel & Floating Pill**:
   - Untuk inspeksi data atau detail transaksi, gunakan panel geser dari kanan (`transform: translateX(0)`) agar pengguna tidak kehilangan konteks halaman utama.
   - Sertakan **Floating Action Bar (Pill)** di bagian bawah dengan `backdrop-filter: blur(20px)` untuk aksi cepat.

9. **Abstraksi Keyboard Shortcuts (Mod)**:
   - Gunakan format token `Mod` (`Mod+K`, `Mod+,`).
   - Tampilkan dengan utilitas `formatShortcut`: di macOS menjadi `⌘K`, di Windows/Linux menjadi `Ctrl + K`.
   - Render badge rapi dengan elemen `<kbd className="macos-kbd">`.

10. **Disabled Right-Click Context Menu**:
    - Nonaktifkan klik kanan browser default via `disableContextMenu.ts` agar aplikasi terasa 100% seperti software desktop native profesional.

---

## 📚 Dokumen Referensi Teknis Lengkap

Pelajari detail spesifikasi implementasi pada folder `references/`:

1. [`references/layout-and-composition.md`](file:///c:/project/PaylabsVA-Desktop-main/.agents/skills/macos-design/references/layout-and-composition.md):
   - Layout formula macOS, geometri frame window, Adaptive Titlebar, dan Sidebar Zero-Shift formula.
2. [`references/interaction-patterns.md`](file:///c:/project/PaylabsVA-Desktop-main/.agents/skills/macos-design/references/interaction-patterns.md):
   - Kontrak komponen Command Palette, Apple HIG Notification Banner, Slide-out Inspector, dan Keyboard shortcuts.
3. [`references/visual-design.md`](file:///c:/project/PaylabsVA-Desktop-main/.agents/skills/macos-design/references/visual-design.md):
   - Design tokens terpusat, Apple SF Pro typography scale, sistem warna Light/Dark, dan aturan Zero-Shadow.
4. [`references/base-app-scaffolding.md`](file:///c:/project/PaylabsVA-Desktop-main/.agents/skills/macos-design/references/base-app-scaffolding.md):
   - Panduan praktis langkah demi langkah untuk menyalin base app ini, mengubah branding, mengganti tampilan domain, dan merilis aplikasi desktop baru.

---

## 🚀 Perintah Verifikasi Kualitas

Setiap kali melakukan adaptasi atau menambah fitur baru pada base app:

```bash
# 1. Jalankan automated test (wajib 100% pass)
bun run test

# 2. Periksa tipe TypeScript (wajib 0 error)
npx tsc --noEmit

# 3. Validasi bundle produksi frontend
bun run build

# 4. Validasi kompilasi backend Rust
cargo check --manifest-path src-tauri/Cargo.toml
```
