# 🚀 Paylabs VA Desktop — SNAP Virtual Account (Tauri v2 + React)

Aplikasi desktop native modern untuk integrasi dan pengujian **Paylabs SNAP Virtual Account (VA)** berbasis **Tauri v2 (Rust)** dan **React 19 + TypeScript + Vite**. Dirancang dengan arsitektur aman dan filosofi desain **Platform-Harmonized Desktop UX** (Windows & macOS).

---

## 🌟 Fitur Utama

1. **Paylabs SNAP VA Engine (v4.8.1)**:
   - **Pembuatan VA Instan**: Generator Virtual Account multi-bank (BCA, BRI, BNI, Mandiri, Permata, Danamon, CIMB, BSI, dll.) sesuai standar SNAP Bank Indonesia.
   - **Kolom Payer Number (`virtualAccountPhone`)**: Dukungan pemetaan nomor HP pembayar pada payload SNAP, tabel riwayat, dan rincian transaksi.
   - **Enkripsi Kredensial Lokal**: Penyimpanan Private Key RSA dan Merchant Partner ID terlindungi secara lokal dengan enkripsi AES-GCM di level OS (`%APPDATA%\PaylabsVA\`).
   - **Audit SNAP Inspector**: Pencatatan jejak transaksi lengkap (*method, URL, headers, stringToSign, request body, raw response*) untuk kemudahan debugging developer.

2. **Konsistensi Visual & Ergonomi Lintas Platform**:
   - **macOS Style**: Titlebar Traffic Lights di kiri atas (🔴🟡🟢) dengan micro-symbols, Spotlight Command Palette (`⌘K`), dan slide-out detail drawer bergaya Apple HIG Inset Grouped.
   - **Windows Style**: Titlebar Fluent Controls di kanan atas (Minimize, Maximize, Close dengan hover merah khas) dan shortcut berbasis `Ctrl`.
   - **Live Style Switcher**: Beralih instan antara tampilan macOS dan Windows untuk visual testing responsif.

3. **Safe IPC Architecture**:
   - Handlers Rust native di `src-tauri` untuk komunikasi aman, crypto signature SHA256withRSA, window management, dan persistensi riwayat dengan fallback otomatis saat diuji di web browser.

---

## 📁 Struktur Direktori

```
paylabs-va-desktop/
├── src-tauri/                     # Backend Rust & Engine Tauri v2
│   ├── src/
│   │   ├── commands/              # Modul IPC Commands
│   │   │   ├── mod.rs
│   │   │   └── window.rs          # Handlers kontrol window & deteksi platform
│   │   ├── lib.rs                 # Pendaftaran handler & konfigurasi runtime
│   │   └── main.rs                # Entrypoint binary Rust
│   ├── Cargo.toml                 # Dependensi Rust
│   └── tauri.conf.json            # Konfigurasi window frameless & izin
│
├── src/                           # Frontend React & TypeScript
│   ├── components/
│   │   ├── chrome/                # Window Chrome Adaptif
│   │   │   ├── AdaptiveTitlebar.tsx
│   │   │   ├── MacTrafficLights.tsx
│   │   │   └── WinWindowControls.tsx
│   │   ├── demo/
│   │   │   └── PlatformComparisonView.tsx # Showcase perbandingan gaya
│   │   └── layout/
│   │       ├── AppShell.tsx       # Layout container desktop
│   │       └── Sidebar.tsx        # Navigasi sidebar
│   ├── hooks/
│   │   ├── usePlatform.ts         # Hook deteksi & simulasi platform
│   │   └── useWindowState.ts      # Hook status maximize/minimize
│   ├── services/
│   │   └── windowService.ts       # IPC wrapper & safe browser fallback
│   ├── styles/
│   │   ├── tokens.css             # Variabel CSS tema & material
│   │   ├── typography.css         # Font stack harmonized
│   │   ├── scrollbar.css          # Modern scrollbar konsisten
│   │   ├── titlebar.css           # Styling titlebar adaptif
│   │   └── index.css              # Entry stylesheet
│   ├── types/
│   │   └── platform.ts            # Tipe platform & config
│   └── utils/
│       └── shortcutFormatter.ts   # Formatting shortcut Mod -> ⌘ / Ctrl
│
├── package.json
└── vite.config.ts
```

---

## 🛠️ Panduan Menjalankan Proyek

### 1. Menjalankan di Mode Browser (Dev Server)
Aplikasi dapat dijalankan dan diuji langsung melalui browser tanpa memerlukan compiler C++ native:
```bash
npm run dev
```
Buka browser di `http://localhost:1420`. Anda dapat menggunakan tombol toggle di titlebar untuk berpindah antara tampilan macOS dan Windows.

### 2. Menjalankan Automated Test (QA)
Menjalankan unit test Vitest untuk verifikasi komponen dan logika pemformat:
```bash
npm run test
```

### 3. Membangun Bundle Frontend
```bash
npm run build
```

### 4. Menjalankan sebagai Aplikasi Desktop Native (Tauri)
```bash
npm run tauri dev
```
> **Catatan Windows**: Untuk mengkompilasi binary desktop `.exe` melalui Rust di Windows, pastikan **Visual Studio C++ Build Tools** (atau Desktop Development with C++) telah terpasang di sistem.
