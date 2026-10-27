# 🏗️ Base App Scaffolding & Rebranding Guide

Panduan praktis langkah demi langkah untuk menyalin basis kode (*base app*) **Paylabs VA Desktop** dan menggunakannya sebagai fondasi (*starter template*) untuk membangun aplikasi desktop macOS native baru.

---

## 1. Ikhtisar Arsitektur yang Diwarisi

Ketika Anda menduplikasi proyek ini sebagai starter template, aplikasi baru Anda langsung mendapatkan kapabilitas produksi berikut secara cuma-cuma:
- 🟢 **Custom Frameless Window** dengan sudut membulat 12px bebas artefak garis hitam Windows DWM.
- 🟢 **macOS Adaptive Titlebar** dengan Traffic Lights terintegrasi (🔴🟡🟢), SVG micro-icons saat hover, dan IPC window drag.
- 🟢 **Collapsible Sidebar dengan Zero-Shift Geometry**: Ikon terkunci absolut di koordinat 21px tanpa glitch meloncat, margin simetris 12px di 4 sisi.
- 🟢 **Spotlight Command Palette (⌘K / Ctrl+K)**: Pencarian aksi instan, navigasi keyboard lengkap, dan glassmorphism translucency.
- 🟢 **Apple HIG Notification Banner (Toast)**: Notifikasi kaca berembun di kanan atas (*top-right*) dengan squircle icon.
- 🟢 **Slide-Out Inspector Detail Panel & Floating Action Bar Pill**: Untuk preview detail data tanpa reload halaman.
- 🟢 **Sistem Tema Persisten**: Dark / Light mode terpusat dengan token CSS dan fallback otomatis.
- 🟢 **Proteksi Native Desktop**: Disabled browser right-click context menu dan disabled text-selection pada window chrome.
- 🟢 **Tauri v2 MCP Bridge**: Siap terhubung dengan tool AI assistant untuk automasi UI dan inspeksi IPC di mode debug.

---

## 2. Checklist Rebranding Aplikasi Baru

Lakukan perubahan pada file konfigurasi berikut untuk mengubah identitas aplikasi:

### Langkah A: `package.json`
Ubah metadata proyek:
```json
{
  "name": "nama-aplikasi-anda",
  "version": "1.0.0",
  "description": "Deskripsi aplikasi desktop baru Anda"
}
```

### Langkah B: `src-tauri/tauri.conf.json`
Perbarui identitas bundle Tauri dan window:
```json
{
  "$schema": "https://schema.tauri.app/config/2",
  "productName": "Nama Aplikasi Anda",
  "version": "1.0.0",
  "identifier": "com.perusahaan.namaaplikasi",
  "app": {
    "windows": [
      {
        "label": "main",
        "title": "Nama Aplikasi Anda",
        "width": 1024,
        "height": 700,
        "minWidth": 800,
        "minHeight": 540,
        "decorations": false,
        "transparent": true,
        "shadow": false
      }
    ]
  }
}
```
> **Penting**: Pertahankan `"decorations": false`, `"transparent": true`, dan `"shadow": false` agar window chrome macOS tetap bekerja sempurna.

### Langkah C: `src-tauri/Cargo.toml`
Perbarui paket Rust:
```toml
[package]
name = "nama-aplikasi-anda"
version = "1.0.0"
description = "Deskripsi backend aplikasi desktop"
```

### Langkah D: Ganti Ikon Aplikasi
Ganti file logo aplikasi di direktori `src-tauri/icons/`:
- `32x32.png`
- `128x128.png`
- `128x128@2x.png`
- `icon.icns` (untuk macOS Dock)
- `icon.ico` (untuk Windows Taskbar)

> **Tips**: Anda dapat menghasilkan semua icon di atas secara otomatis menggunakan perintah Tauri CLI:
> `npx @tauri-apps/cli icon path/to/app-icon.png`

---

## 3. Menyesuaikan Brand Tint & Palet Warna

Buka `src/styles/tokens.css` dan cukup ubah warna aksen utama sesuai identitas brand Anda:

```css
:root {
  /* Ubah warna aksen utama ke warna brand Anda */
  --accent-primary: #0284c7;        /* Contoh: Cyan / Sky Blue */
  --accent-primary-hover: #0369a1;
  --accent-secondary: #0d9488;      /* Teal */
  --accent-gradient: linear-gradient(135deg, #0284c7 0%, #0d9488 100%);
}

[data-theme="light"] {
  --accent-primary: #0284c7;
  --accent-primary-hover: #0369a1;
}
```
Seluruh komponen (Titlebar, Command Palette, Active Nav Item, Toast, Toggle Switch) akan langsung beradaptasi secara otomatis!

---

## 4. Mengganti Navigasi & Membuat Halaman Baru

### Langkah 1: Definisikan Tab Baru di `src/components/layout/Sidebar.tsx`
Ubah tipe `ActiveTab` dan daftar `menuItems`:
```typescript
// 1. Tipe tab aplikasi Anda
export type ActiveTab = 'dashboard' | 'analytics' | 'settings';

// 2. Daftar navigasi dengan icon Lucide
const menuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'analytics', label: 'Analitik', icon: BarChart3 },
  { id: 'settings', label: 'Pengaturan', icon: Settings },
];
```

### Langkah 2: Buat Komponen Tampilan Baru di `src/components/<domain>/`
Contoh membuat `DashboardView.tsx`:
```tsx
import React from 'react';

interface DashboardViewProps {
  onShowToast: (title: string, message: string, type?: 'success' | 'info' | 'warning' | 'error') => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({ onShowToast }) => {
  return (
    <div className="view-container" style={{ padding: '24px' }}>
      <header style={{ marginBottom: '20px' }}>
        <h1 style={{ fontSize: '22px', fontWeight: 700, margin: 0 }}>Executive Dashboard</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '13px', margin: '4px 0 0' }}>
          Ringkasan operasional dan analitik sistem real-time.
        </p>
      </header>

      {/* Inset Grouped Card */}
      <div style={{
        backgroundColor: 'var(--bg-surface-1)',
        border: '1px solid var(--border-subtle)',
        borderRadius: '12px',
        padding: '20px'
      }}>
        <p>Konten dashboard aplikasi baru Anda di sini.</p>
      </div>
    </div>
  );
};
```

### Langkah 3: Hubungkan View ke `AppShell.tsx`
Buka `src/components/layout/AppShell.tsx`:
1. Import `DashboardView` yang baru dibuat.
2. Ganti blok conditional rendering di dalam `<div id="workspace-canvas">`:
```tsx
<main className="main-content-scroll">
  {activeTab === 'dashboard' && <DashboardView onShowToast={showToast} />}
  {activeTab === 'analytics' && <AnalyticsView onShowToast={showToast} />}
  {activeTab === 'settings' && <SettingsView onShowToast={showToast} />}
</main>
```

---

## 5. Mendaftarkan Perintah Baru ke Command Palette (⌘K)

Buka `src/components/macos/palette/commandPaletteItems.ts`:
Tambahkan aksi baru yang sesuai dengan fitur aplikasi Anda:

```typescript
export const getCommandPaletteItems = (...): CommandPaletteItem[] => [
  // Navigasi
  {
    id: 'nav-dashboard',
    title: 'Buka Dashboard',
    category: 'Navigasi',
    icon: <LayoutDashboard size={16} />,
    onExecute: () => onSelectTab('dashboard'),
    keywords: ['home', 'utama', 'dashboard', 'ringkasan'],
  },
  // Aksi Cepat
  {
    id: 'action-sync-data',
    title: 'Sinkronisasi Data Server',
    category: 'Aksi',
    shortcut: 'Mod+R',
    icon: <RefreshCw size={16} />,
    onExecute: () => handleSyncData(),
    keywords: ['refresh', 'tarik', 'update', 'fetch'],
  },
];
```

---

## 6. Verifikasi & Pengujian Sebelum Deploy

Jalankan suite verifikasi kualitas penuh:

```bash
# 1. Jalankan automated unit tests
bun run test

# 2. Periksa static typing
npx tsc --noEmit

# 3. Test compile Tauri backend Rust
cargo check --manifest-path src-tauri/Cargo.toml

# 4. Jalankan aplikasi desktop secara lokal
bun run tauri dev
```
Dengan mengikuti panduan ini, Anda dapat merilis aplikasi desktop baru dengan kualitas antarmuka macOS native Apple HIG dalam hitungan jam!
