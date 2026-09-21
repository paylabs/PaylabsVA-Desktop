# 🍎 macOS Native Guidelines & Standards

Pedoman baku perancangan dan implementasi antarmuka macOS native untuk proyek **Antigravity Desktop** berbasis Tauri v2 + React.

---

## 1. Tata Letak & Window Frame (Apple Formula)
- **Top Bar Drag Zone**: Area setinggi ~48-52px dengan atribut `data-tauri-drag-region` yang bersih dan bebas halangan.
- **Traffic Lights**: Berada di kiri atas (🔴🟡🟢) dengan micro-symbol icon saat di-hover.
- **Translucency & Vibrancy**: Menggunakan `backdrop-filter: saturate(180%) blur(20px)` pada sidebar dan floating overlays.
- **Border & Shadows**: Menggunakan layered shadows halus dengan batas tepi `0.5px` solid (`box-shadow: 0 0 0 0.5px var(--border-subtle)`).

---

## 2. Navigasi & Pola Interaksi
- **Command Palette (`⌘K` / `Ctrl+K`)**: Modal mengambang Spotlight-style untuk akses instan ke navigasi tab, pengaturan tema, dan kontrol platform.
- **Slide-out Detail Panels**: Inspeksi detail data meluncur dari sisi kanan layar tanpa menghilangkan konteks halaman utama.
- **Floating Action Bar**: Kapsul mengambang (*pill-shaped*) di bagian bawah panel inspeksi untuk aksi cepat (*Copy, Share, Close*).
- **Shortcut Hints**: Semua aksi primer menampilkan indikator shortcut keyboard dengan format `<kbd>`.

---

## 3. Tipografi & Skala Spacing
- Menggunakan font stack Apple: `-apple-system, BlinkMacSystemFont, "SF Pro Text", "SF Pro Display", sans-serif`.
- Skala basis grid 8px untuk padding dan margin.
- Corner radii: Jendela `12px`, Panel `12px`, Kartu `8px`, Tombol `6px`.
