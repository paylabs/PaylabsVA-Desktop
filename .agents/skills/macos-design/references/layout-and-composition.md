# 📐 macOS Layout & Composition Reference

Dokumen ini menjelaskan struktur tata letak (layout), geometri frame window, dan pembagian area aplikasi desktop native macOS yang diterapkan pada **Base App**.

---

## 1. The macOS Window Anatomy

Setiap aplikasi utilitas macOS mengikuti pola struktural tiga tingkat:

```
┌────────────────────────────────────────────────────────────────────────┐
│  🔴 🟡 🟢  Adaptive Titlebar (Global Search Pill, Theme, Drag Area)   │  ← 38px
├──────────────┬─────────────────────────────────────────────────────────┤
│              │                                                         │
│  Collapsible │  Main Content Area (`.main-content-scroll`)             │
│  Sidebar     │                                                         │
│  (Navigasi)  │  - Header & Action Bar                                  │
│              │  - Inset Grouped Cards / Data Tables                    │
│  Lebar:      │  - Slide-out Inspector Detail Panel (Opsional)          │
│  220px /     │                                                         │
│  63px        │                                                         │
│              │                                                         │
├──────────────┴─────────────────────────────────────────────────────────┤
│  Status Bar (Environment info, Updater pill, Versi app)                │  ← 24px
└────────────────────────────────────────────────────────────────────────┘
```

### Karakteristik Struktur:
1. **Window Frame**:
   - `decorations: false` dan `transparent: true` di Tauri backend.
   - Root HTML & body `background-color: transparent`.
   - Container terluar `.desktop-window-container` solid opaque (`var(--bg-app)`) dengan `border-radius: 12px;` dan `border: 1px solid var(--border-subtle);`.
   - Saat state `.is-maximized`: `border-radius: 0 !important; border: none !important;`.
2. **Scroll Isolation**:
   - Scrollbar diisolasi eksklusif pada `.main-content-scroll` dengan styling halus (`--scrollbar-width: 6px`).
   - Titlebar, sidebar, dan status bar terkunci rapat bebas efek overscroll (*rubber-band bounce*).

---

## 2. Adaptive Titlebar & Window Controls

Titlebar melayani navigasi global, status, serta kontrol jendela native:

```html
<header className="adaptive-titlebar" onMouseDown={handleMouseDown} onDoubleClick={handleToggleMaximize}>
  {/* macOS Traffic Lights di kiri atas */}
  <div className="titlebar-left">
    <MacTrafficLights onClose={handleClose} onMinimize={handleMinimize} onMaximize={handleToggleMaximize} />
  </div>

  {/* Drag Region & Page Title */}
  <div className="titlebar-center" data-tauri-drag-region>
    <span className="titlebar-title">{title}</span>
  </div>

  {/* Action Controls seragam 26px */}
  <div className="titlebar-right no-drag">
    <button className="titlebar-search-pill" onClick={onOpenCommandPalette}>
      <Search size={12} />
      <span>Cari aksi...</span>
      <kbd className="shortcut-badge">⌘K</kbd>
    </button>
    <button className="titlebar-icon-btn" onClick={onToggleTheme}>
      {theme === 'dark' ? <Sun size={14} /> : <Moon size={14} />}
    </button>
  </div>
</header>
```

### Standar Geometri Titlebar:
- **Tinggi Tetap**: `38px` (`--titlebar-height`).
- **Tinggi Action Controls**: Wajib seragam `26px` (`--titlebar-btn-height`), `box-sizing: border-box;`, `display: inline-flex; align-items: center; justify-content: center;`.
- **Drag Handling**: Gunakan `-webkit-app-region: drag` dan event listener `onMouseDown` yang memanggil Rust IPC command `start_dragging_window`:
  ```typescript
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.button === 0 && !(e.target as HTMLElement).closest('.no-drag')) {
      invoke('start_dragging_window').catch(() => {});
    }
  };
  ```
- **Traffic Lights**:
  - Diameter bulatan `12px` dengan margin antar tombol `8px`.
  - Warna: Close `#ff5f56`, Minimize `#ffbd2e`, Maximize `#27c93f`.
  - Simbol mikro SVG (✕, −, ⤢) muncul serentak saat container traffic lights di-hover.

---

## 3. Sidebar Collapsible: Zero-Shift Geometry & Equal Margins

Sidebar yang dapat diciutkan (*collapsible*) seringkali mengalami glitch visual di mana ikon meloncat ke tengah saat animasi. Base app ini menerapkan formula matematika **Zero-Shift Geometry**:

### A. Formula Koordinat Absolut Terkunci (21px)
```
Sidebar Container Padding: 12px (Semua sisi: Atas, Bawah, Kiri, Kanan)
Collapsed Button Dimension: 38px x 38px
Icon Wrapper Dimension: 20px x 20px
Icon Internal Left Margin: (38px - 20px) / 2 = 9px

Koordinat X Ikon (Expanded)  : 12px (padding sidebar) + 9px (padding-left item) = 21px
Koordinat X Ikon (Collapsed) : 12px (padding sidebar) + 9px (padding-left item) = 21px
Selisih Pergeseran: TEPAT 0 PIXEL (ZERO-SHIFT)
```

### B. Aturan Implementasi CSS:
1. **Dilarang Keras** mengubah `justify-content` menjadi `center` saat collapsed. Gunakan `justify-content: flex-start;` dan `padding-left: 9px;` **secara konstan** di kedua mode.
2. Slot ikon wajib diberi ukuran pasti `width: 20px; height: 20px; flex-shrink: 0;`.
3. Lebar sidebar saat collapsed adalah **63px**:
   `12px (kiri) + 38px (tombol) + 12px (kanan) + 1px (border) = 63px`.
4. Menghasilkan margin simetris 12px yang identik di 4 sisi (atas, bawah, kiri, kanan).

### C. Staged Animation Timeline:
- **Saat Menciut (Collapse)**:
  1. Teks label menu memudar instan dan meluncur ke kiri (`opacity: 0; transform: translateX(-8px)`) dalam **80ms**.
  2. Sidebar menunggu teks hilang (`transition-delay: 80ms`), barulah kemudian lebar sidebar menciut dari 220px ke 64px dalam **180ms**.
- **Saat Melebar (Expand)**:
  1. Sidebar langsung melebar penuh dari 64px ke 220px (**220ms**).
  2. Tepat saat lebar selesai di 220ms, teks label baru meluncur masuk secara halus ke posisinya (**150ms**).

---

## 4. Main Content Area & Inset Grouped Pattern

Area konten utama menyajikan informasi dengan pola **Apple Inset Grouped**:

1. **Inset Grouped Cards**:
   - `background-color: var(--bg-surface-1);`
   - `border-radius: 12px;`
   - `border: 1px solid var(--border-subtle);`
   - `padding: 20px;`
2. **Segmented Controls (Tab Filter)**:
   - Tinggi 32px, `border-radius: 8px;`, latar belakang `var(--bg-surface-2)`.
   - Item aktif memiliki latar belakang solid `var(--bg-surface-1)` dengan border halus dan bayangan mikro `0 1px 2px rgba(0,0,0,0.06)`.
3. **Detail Data Inspector**:
   - Tampilkan detail baris atau transaksi menggunakan **Slide-Out Panel** dari kanan (`380px`), bukan membuka jendela baru atau me-replace seluruh halaman.

---

## 5. Desktop Status Bar

Status bar di bagian bawah jendela (tinggi 24px) melengkapi nuansa software desktop native:
- **Kiri**: Informasi runtime / status koneksi (Environment, API status, Tema).
- **Kanan**: Updater pill (`status-bar-updater-pill`) yang mengindikasikan status versi dan kemampuan auto-update via GitHub Releases.
