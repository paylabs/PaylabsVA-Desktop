# 📝 Changelog

Seluruh perubahan dan catatan rilis pada proyek **Paylabs VA Desktop** didokumentasikan di sini mengikuti format [Keep a Changelog](https://keepachangelog.com/id/1.0.0/) dan mematuhi [Semantic Versioning](https://semver.org/).

---

## [0.1.3] - 2026-09-25

### ✨ Fitur Baru (Added)
- **Dukungan Static Bank Mandiri Virtual Account (`StaticMandiriVA`)**:
  - Penambahan channel resmi Bank Mandiri (`008`) untuk skema Static VA (*Open Payment* / transfer bebas nominal tanpa batasan tagihan tetap).
  - Normalisasi otomatis tipe pembayaran SNAP untuk variasi channel `StaticMandiriVA`.
  - Integrasi di UI formulir Static Virtual Account dan sinkronisasi daftar bank channel lintas backend Tauri v2 dan frontend React.

---

## [0.1.2] - 2026-09-25

### ✨ Fitur Baru (Added)
- **In-App Auto-Update via GitHub Releases**:
  - Pemeriksaan otomatis saat aplikasi dibuka (*background silent check*).
  - Banner notifikasi Apple HIG di pojok kanan atas dengan *progress bar* unduhan real-time.
  - Verifikasi keamanan tanda tangan kriptografis berbasis algoritma **Ed25519**.
  - Tombol manual *"Periksa Pembaruan"* pada modal Pengaturan Kredensial.
- **Dukungan 14 Bank Channel Resmi (Dynamic VA)**:
  - BCA (`MultipleBCAVA`), BNI (`MultipleBNIVA`), BRI (`MultipleBRIVA`), BSI (`MultipleBSIVA`), CIMB Niaga (`MultipleCIMBVA`), Danamon (`MultipleDanamonVA`), Bank INA (`MultipleINAVA`), Permata (`MultiplePermataVA`), Mandiri (`MultipleMandiriVA`), Maybank (`MultipleMaybankVA`), Muamalat (`MultipleMuamalatVA`), Sinarmas (`MultipleSinarmasVA`), BNC (`MultipleBNCVA`), dan Nobu (`MultipleNobuVA`).
- **Eksklusif 5 Bank Channel (Static VA)**:
  - BNI (`StaticBNIVA`), BNC (`StaticBNCVA`), Nobu (`StaticNobuVA`), Bank INA (`StaticINAVA`), dan BCA (`StaticBCAVA`).
- **Normalisasi Bank Pintar**:
  - Utilitas `formatBankName` kini mendukung Bank INA, BNC (*Bank Neo Commerce*), dan Nobu (*Bank Nationalnobu*).

### 🛠️ Penyempurnaan (Improved)
- Penyesuaian `tauri.conf.json` dengan `createUpdaterArtifacts: true` dan endpoint GitHub Releases statis.
- Otomasi setup signing key via `scripts/setup-updater.mjs` dan integrasi GitHub CLI (`gh`).
- Peningkatan toleransi offline dan penanganan error jaringan pada pengecekan versi rilis.

---

## [0.1.1] - 2026-09-20

### ✨ Rilis Awal Desktop Multiplatform
- Implementasi arsitektur dasar **Tauri v2 + React 19 TypeScript**.
- Fitur SNAP Virtual Account v4.8.1 (Dynamic & Static VA).
- UI Bergaya macOS Native Apple HIG & Windows Fluent.
- Sistem otentikasi asymmetric SHA-256 with RSA dan integrasi Paylabs API.
