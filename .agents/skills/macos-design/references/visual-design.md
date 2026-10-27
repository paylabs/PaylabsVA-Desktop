# 🎨 macOS Visual Design & Design Tokens Reference

Dokumen ini menjelaskan sistem visual, palet warna, tipografi Apple SF Pro, material vibrancy translucency, dan aturan penanganan bayangan (*shadows*) yang diterapkan pada **Base App**.

---

## 1. Material Vibrancy & Translucency

Karakter visual paling khas dari sistem operasi Apple macOS adalah material **Vibrancy (Kaca Berembun / Frosted Glass)** yang membiarkan warna di latar belakang terpancar secara elegan tanpa mengaburkan keterbacaan teks.

### A. Formula CSS Kunci:
```css
/* Sidebar Vibrancy (macOS Profile) */
.desktop-window-container.macos .sidebar-container {
  background-color: rgba(246, 246, 246, 0.82);
  backdrop-filter: saturate(180%) blur(20px);
  -webkit-backdrop-filter: saturate(180%) blur(20px);
  border-right: 1px solid var(--border-subtle);
}

[data-theme="dark"] .desktop-window-container.macos .sidebar-container {
  background-color: rgba(30, 30, 30, 0.82);
}

/* Command Palette Vibrancy */
.macos-command-modal {
  background: rgba(255, 255, 255, 0.90);
  backdrop-filter: saturate(190%) blur(36px);
  -webkit-backdrop-filter: saturate(190%) blur(36px);
}

[data-theme="dark"] .macos-command-modal {
  background: rgba(22, 27, 34, 0.90);
}
```

> **Mengapa wajib menggunakan `saturate(180%)` bersama `blur(...)`?**  
> Efek `blur` murni tanpa saturasi akan memudarkan saturasi warna menjadi abu-abu kusam. Penambahan `saturate(180% - 190%)` mengembalikan kehangatan dan ketajaman kontras khas macOS.

---

## 2. Layered Shadows & Boundary Definition (0.5px)

macOS menghindari bayangan tebal tunggal yang kotor. Sebagai gantinya, digunakan kombinasi **0.5px boundary definition** bersama bayangan bertingkat multi-lapis (*layered shadows*):

```css
/* 1. Subtle (Kartu & Tombol Biasa) */
.macos-shadow-subtle {
  box-shadow: 0 0 0 0.5px var(--border-subtle), 0 1px 3px rgba(0, 0, 0, 0.06);
}

/* 2. Medium (Floating Action Bars & Popovers Inset) */
.macos-shadow-medium {
  box-shadow: 0 0 0 0.5px var(--border-subtle), 0 4px 16px rgba(0, 0, 0, 0.12);
}

/* 3. Floating (Modal Dialog & Command Palette) */
.macos-shadow-floating {
  box-shadow: 
    0 0 0 0.5px var(--border-subtle),
    0 12px 32px rgba(15, 23, 42, 0.12),
    0 28px 64px rgba(15, 23, 42, 0.16);
}
```

---

## 3. Aturan Mutlak: Zero-Shadow pada Popovers, Dropdowns & Tooltips

Dalam aplikasi desktop frameless dengan sudut membulat `border-radius: 12px;`, **bayangan luar (*outer drop-shadow*) pada menu dropdown atau tooltip akan menyebabkan glitch visual fatal**:
- Bayangan meluber keluar dari batas lengkung jendela desktop.
- Terjadi clipping aneh dan garis patah saat container utama memiliki `overflow: hidden`.

### Solusi Baku Base App:
```css
/* Aturan Zero-Shadow untuk Elemen Melayang Internal */
.custom-select-popover,
.dropdown-menu,
.tooltip-bubble {
  box-shadow: none !important;
  border: 1px solid var(--border-subtle) !important;
}
```
Definisi kedalaman popover diberikan murni oleh:
1. Garis tepi mikro `border: 1px solid var(--border-subtle)`.
2. Latar belakang solid opaque berjarak (`var(--bg-surface-1)`).
3. Offset vertikal aman untuk tooltip titlebar:
   ```css
   .titlebar-tooltip {
     top: calc(100% + 10px); /* Melayang aman di bawah border-bottom 38px titlebar */
   }
   ```

---

## 4. Tipografi SF Pro Hierarchy

Base app menggunakan keluarga font sistem Apple (`-apple-system`, `BlinkMacSystemFont`, `"SF Pro Display"`, `"SF Pro Text"`, `system-ui`, `sans-serif`):

| Tingkat Tipografi | Ukuran Font | Weight | Tracking (Letter Spacing) | Penggunaan |
|---|---|---|---|---|
| **Large Title** | 26px - 34px | Bold (700) | `-0.03em` | Judul utama halaman landing |
| **Title 1** | 22px | Bold (700) | `-0.02em` | Header bagian besar |
| **Title 2** | 17px | Semibold (600) | `-0.015em` | Judul kartu atau modal |
| **Headline** | 14px - 15px | Semibold (600) | `-0.01em` | Judul kolom, label grup form |
| **Body** | 13px | Regular (400) | `0` | Teks konten, baris data, paragraf |
| **Callout** | 12px | Regular (400) | `0` | Keterangan tambahan di bawah input |
| **Footnote** | 11.5px | Regular (400) | `+0.01em` | Info status bar, hint shortcut |
| **Caption 1** | 10.5px | Semibold (600) | `+0.06em` | Label kategori UPPERCASE |

---

## 5. Apple HIG Color Palette & Token Mapping

Design tokens terpusat di `src/styles/tokens.css` mendukung pergantian tema Light/Dark instan:

```css
:root {
  /* Dark Mode (Default Desktop Elegan) */
  --bg-app: #0d1117;
  --bg-surface-1: #161b22;
  --bg-surface-2: #21262d;
  --border-subtle: rgba(255, 255, 255, 0.08);
  --text-primary: #f0f6fc;
  --text-secondary: #9da7b3;
  --accent-primary: #6366f1; /* Brand tint */
  --accent-success: #22c55e; /* Apple System Green */
  --accent-warning: #eab308; /* Apple System Yellow */
  --accent-danger: #ef4444;  /* Apple System Red */
  --radius-window: 12px;
  --radius-card: 12px;
  --radius-button: 8px;
}

[data-theme="light"] {
  /* Light Mode (Tinggi Kontras & Bersih) */
  --bg-app: #f1f5f9;
  --bg-surface-1: #ffffff;
  --bg-surface-2: #e8ecf2;
  --border-subtle: #cbd5e1;
  --text-primary: #0f172a;
  --text-secondary: #334155;
  --accent-primary: #4f46e5;
  --accent-success: #16a34a;
  --accent-warning: #d97706;
  --accent-danger: #dc2626;
}
```

### Kustomisasi untuk Aplikasi Baru:
Saat menggunakan base app ini untuk proyek baru, Anda cukup mengubah nilai `--accent-primary` dan `--accent-secondary` di `tokens.css` untuk mengubah identitas visual ke seluruh aplikasi secara otomatis!
