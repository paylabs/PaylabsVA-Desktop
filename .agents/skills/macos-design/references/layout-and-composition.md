# Layout & Composition Reference (macOS)

## Daftar Isi
1. The Apple Layout Formula
2. Top Bar Design
3. Sidebar Navigation
4. Content Area
5. Empty States & Progressive Disclosure
6. Window Chrome & Traffic Lights
7. Multi-Window & System Integration

---

## 1. The Apple Layout Formula

Hampir setiap aplikasi utilitas macOS mengikuti pola struktural yang sama:

```
┌─────────────────────────────────────────────────┐
│  Traffic Lights  │      Top Bar (Global Actions) │  ← ~50px, draggable
├──────────────────┼──────────────────────────────┤
│                  │                               │
│    Sidebar       │       Main Content            │
│   (Navigation)   │       (User's Data)           │
│                  │                               │
├──────────────────┴──────────────────────────────┤
│              Bottom Bar (optional)               │
└─────────────────────────────────────────────────┘
```

Aplikasi acuan: Finder, Notes, Reminders, Calendar, Settings, Music, Shortcuts, Mail.

**Prinsip**: Aplikasi adalah wadah data pengguna. Desain berpusat pada konten utama dengan UI pendukung yang efisien dan tidak mengganggu.

---

## 2. Top Bar Design

Top bar melayani aksi tingkat global: pencarian, view switcher, pengaturan.
- Tinggi: ~48-52px (zona ini berfungsi ganda sebagai window drag region).
- Jaga tetap bernapas (*sparse*) — jangan menumpuk terlalu banyak tombol.
- Tombol Traffic Lights terintegrasi di sisi kiri atas dengan padding natural.
- Search bar / Command palette trigger selalu mudah diakses.

---

## 3. Sidebar Navigation

- Lebar standar: 200-260px, collapsible pada jendela berukuran kompak.
- Latar belakang: Translucency vibrancy (`backdrop-filter: saturate(180%) blur(20px)`).
- Status item aktif: highlight lembut dengan kontras teks yang jelas.
- Ikon: Bergaya SF Symbols monoline (16-20px).

---

## 4. Content Area & Slide-out Panels

- Minimalkan window chrome di sekitar konten.
- **Detail / Preview Pattern**: Alih-alih navigasi pindah halaman penuh yang menghilangkan konteks, gunakan slide-out panel dari kanan. Pengguna tetap dapat melihat data utama di latar belakang.
- Sertakan **Floating Action Bar (Pill)** di bagian bawah panel detail untuk aksi cepat (salin token, share, delete).

---

## 5. Window Chrome & Traffic Lights

- Posisi: Kiri atas (🔴 #FF5F57, 🟡 #FEBC2E, 🟢 #28C840).
- Diameter: 12px lingkaran dengan jarak 8px antar tombol.
- Hover: Menampilkan micro-symbol icon (×, −, +).
- Jendela: Border radius 10-12px dengan border halus `0.5px` beropasitas rendah dan layered shadow.
