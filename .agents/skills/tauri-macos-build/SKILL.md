---
name: tauri-macos-build
description: >-
  Skill panduan kompilasi, packaging (.app dan .dmg), arsitektur universal binary,
  penanganan Apple Gatekeeper, dan CI/CD automated build macOS untuk aplikasi Tauri v2.
  Gunakan skill ini untuk build aplikasi agar dapat dijalankan di komputer Mac (Apple Silicon & Intel).
---

# 🍏 Tauri v2 macOS Build & Distribution Guide

Skill ini menyediakan panduan standar untuk mengompilasi, memaketkan (*packaging*), dan mendistribusikan aplikasi **Tauri v2** agar dapat dijalankan dengan mulus di sistem operasi **macOS (Apple Silicon M1/M2/M3/M4 & Intel)**.

---

## 1. Tantangan Arsitektur & Solusi Kompilasi

### Mengapa Tidak Bisa Cross-Compile Langsung di Windows?
Tauri v2 mengikat library native macOS (`Cocoa`, `WebKit`, `Security framework`). Apple tidak mendistribusikan macOS SDK untuk sistem operasi non-Apple.

### Dua Metode Resmi untuk Membangun Binary macOS:
1. **Metode CI/CD GitHub Actions (Direkomendasikan dari Windows)**:
   Menggunakan cloud runner Apple Silicon/Intel resmi GitHub (`macos-latest`) dengan `tauri-apps/tauri-action`. Menghasilkan `.dmg` dan `.app` siap pakai secara otomatis dan gratis.
2. **Metode Lokal (Bila Memiliki Mesin Mac)**:
   Menjalankan perintah kompilasi langsung di terminal macOS.

---

## 2. Persiapan Konfigurasi Bundle macOS (`tauri.conf.json`)

Pastikan konfigurasi bundle macOS di `src-tauri/tauri.conf.json` telah siap:

```json
{
  "bundle": {
    "active": true,
    "targets": ["dmg", "app"],
    "icon": [
      "icons/32x32.png",
      "icons/128x128.png",
      "icons/128x128@2x.png",
      "icons/icon.icns",
      "icons/icon.ico"
    ],
    "macOS": {
      "frameworks": [],
      "minimumSystemVersion": "10.15",
      "exceptionDomain": "",
      "signingIdentity": null,
      "providerShortName": null,
      "entitlements": null
    },
    "dmg": {
      "background": null,
      "windowPosition": {
        "x": 400,
        "y": 200
      },
      "windowSize": {
        "width": 600,
        "height": 400
      },
      "appPosition": {
        "x": 180,
        "y": 170
      },
      "applicationFolderPosition": {
        "x": 420,
        "y": 170
      }
    }
  }
}
```

---

## 3. Kompilasi Lokal di Komputer Mac

Jika Anda atau rekan tim memiliki perangkat Mac:

### A. Prasyarat Sistem Mac
```bash
# 1. Pasang Xcode Command Line Tools
xcode-select --install

# 2. Pasang Rust melalui rustup
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
source "$HOME/.cargo/env"

# 3. Tambahkan target arsitektur (Apple Silicon & Intel)
rustup target add aarch64-apple-darwin
rustup target add x86_64-apple-darwin
```

### B. Perintah Build

#### Opsi 1: Universal Binary (Bisa jalan di SEMUA Mac Intel & M1/M2/M3/M4) — Sangat Direkomendasikan
```bash
bun run tauri build --target universal-apple-darwin
# atau
npm run tauri build -- --target universal-apple-darwin
```

#### Opsi 2: Khusus Mac Pengguna (Native architecture saat ini)
```bash
bun run tauri build
# atau
npm run tauri build
```

Hasil build akan berada di folder:
- **Installer DMG**: `src-tauri/target/universal-apple-darwin/release/bundle/dmg/*.dmg`
- **Aplikasi .app**: `src-tauri/target/universal-apple-darwin/release/bundle/macos/*.app`

---

## 4. Build Otomatis dari Windows via GitHub Actions

Karena komputer utama menggunakan Windows, gunakan workflow GitHub Actions yang mengompilasi binary macOS di server Apple resmi GitHub:

### Template File Workflow: `.github/workflows/build-macos.yml`

```yaml
name: Build macOS Release

on:
  workflow_dispatch: # Dapat dipicu manual dari tab Actions di GitHub
  push:
    tags:
      - 'v*'

jobs:
  build-mac:
    runs-on: macos-latest
    steps:
      - name: Checkout repository
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'npm'

      - name: Setup Rust toolchain
        uses: dtolnay/rust-toolchain@stable
        with:
          targets: aarch64-apple-darwin,x86_64-apple-darwin

      - name: Install Frontend Dependencies
        run: npm ci

      - name: Build Tauri macOS App (Universal DMG)
        uses: tauri-apps/tauri-action@v0
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
        with:
          args: --target universal-apple-darwin

      - name: Upload macOS Artifacts
        uses: actions/upload-artifact@v4
        with:
          name: PaylabsMultipleVA-macOS
          path: |
            src-tauri/target/universal-apple-darwin/release/bundle/dmg/*.dmg
            src-tauri/target/universal-apple-darwin/release/bundle/macos/*.app
```

---

## 5. Mengatasi Apple Gatekeeper di Mac Pengguna

Aplikasi macOS yang tidak ditandatangani dengan sertifikat Apple Developer berbayar ($99/tahun) akan memicu peringatan Gatekeeper:
> *"PaylabsMultipleVA.app is damaged and can't be opened"* atau *"Apple cannot check it for malicious software"*.

### Cara Menjalankan di Mac Pengguna (Solusi Resmi):

#### Solusi 1: Melalui Klik Kanan (Paling Mudah)
1. Buka folder `/Applications` (atau file `.app` yang telah diekstrak).
2. Tahan tombol `Control (Ctrl)` pada keyboard, lalu **Klik Kanan** pada icon aplikasi.
3. Pilih **Open**.
4. Pada pop-up peringatan, klik tombol **Open** (tombol ini hanya muncul jika dibuka lewat klik kanan).

#### Solusi 2: Melalui Terminal Mac (Bebas Masalah Selamanya)
Buka aplikasi **Terminal** di Mac dan jalankan perintah:
```bash
sudo xattr -cr /Applications/PaylabsMultipleVA.app
```
*(Perintah ini menghapus atribut karantina `com.apple.quarantine` yang disematkan macOS pada file unduhan dari internet).*

---

## 6. Checklist Verifikasi Rilis macOS

Sebelum membagikan file `.dmg` / `.app` ke pengguna Mac:
- [ ] File dikompilasi dengan target `universal-apple-darwin` agar kompatibel untuk Mac Intel maupun Apple Silicon.
- [ ] File `.dmg` dapat dibuka dan memiliki shortcut *drag-and-drop* ke folder `/Applications`.
- [ ] Jendela aplikasi menampilkan Traffic Lights (🔴🟡🟢) native di kiri atas.
- [ ] Shortcut keyboard `⌘K` (Command Palette) dan `⌘` modifiers berfungsi normal.
- [ ] Klik kanan context menu webview dinonaktifkan (`setupContextMenuGuard`).
