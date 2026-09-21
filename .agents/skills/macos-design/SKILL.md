---
name: macos-design
description: Skill panduan merancang dan membangun antarmuka aplikasi macOS native (Apple Design Patterns). Aktifkan skill ini ketika merancang tata letak desktop app, window chrome & traffic lights, command palette ⌘K, top bar drag zone, visual vibrancy translucency (saturate 180% blur), layered shadows 0.5px, dan keyboard shortcuts.
metadata:
  mcpmarket-version: 1.0.0
---
# macOS Native App Design Skill

Membangun antarmuka desktop yang terasa menyatu secara native pada komputer pengguna (Apple macOS Standards) — bukan sekadar website yang dimasukkan ke dalam window.

## Filosofi Utama

Aplikasi native bukanlah sebuah destinasi halaman statis, melainkan **alat sistem (system tool)** yang hadir saat dibutuhkan dan memberi jalan saat tugas selesai (*get out of the way immediately after*).

## Acuan Teknis (References)

Pelajari referensi teknis berikut sesuai kebutuhan fitur:
- **Semua aplikasi macOS** → Baca `references/layout-and-composition.md` (Tata letak ~50px top bar, traffic lights terintegrasi, sidebar navigasi, detail panels)
- **Keyboard shortcuts, command palette, toast & panels** → Baca `references/interaction-patterns.md` (Shortcut ⌘ conventions, Spotlight-style Command Palette ⌘K, slide-out panels, floating action bars)
- **Vibrancy, tipografi SF Pro, warna, layered shadows** → Baca `references/visual-design.md` (Translucency saturate 180% blur 20px, layered shadows dengan 0.5px boundary border, SF Pro type scale)

## Checklist Cepat Sebelum Menulis Kode

1. **Layout**: Top bar (~50px) untuk aksi global & window drag region bebas hambatan, sidebar untuk navigasi, center untuk konten utama.
2. **Traffic lights**: Terintegrasi rapi di kiri atas (🔴🟡🟢) dengan micro-symbol icon saat di-hover.
3. **Command Palette & Search**: Akses pencarian cepat dan aksi terpusat melalui shortcut `⌘K` / `⌘Space`.
4. **Vibrancy & Translucency**: Sidebar dan floating panels menggunakan `backdrop-filter: saturate(180%) blur(20px)` dan border `0.5px`.
5. **Layered Shadows**: Jangan gunakan single shadow tebal. Gunakan multiple layered shadows dengan batas definisi halus `0 0 0 0.5px`.
6. **Keyboard Shortcuts**: Setiap aksi primer wajib memiliki shortcut keyboard dengan hint visual `<kbd>`.
7. **Detail Views**: Gunakan slide-out panel dari kanan daripada berpindah halaman penuh untuk mempertahankan konteks data.
8. **Floating Action Bar**: Pill-shaped action bar mengambang di bawah detail preview untuk aksi cepat.
9. **Micro-animations**: Transisi halus pada setiap perubahan state menggunakan easing native `--ease-out: cubic-bezier(0.25, 0.46, 0.45, 0.94)`.
10. **Optimistic UI**: Eksekusi aksi seketika dengan feedback toast notifikasi instan.
