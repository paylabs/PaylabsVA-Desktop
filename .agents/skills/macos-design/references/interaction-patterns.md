# ⚡ macOS Interaction Patterns Reference

Dokumen ini menjelaskan pola interaksi native macOS yang diimplementasikan pada **Base App**, termasuk Spotlight Command Palette, Notification Banner (Toast), Slide-out Inspector Panel, dan sistem Keyboard Shortcuts.

---

## 1. Spotlight Command Palette (⌘K)

Command Palette adalah pusat kendali dan navigasi cepat yang terinspirasi oleh **Apple Spotlight** dan **Raycast**.

### A. Fitur & Karakteristik:
1. **Shortcut Universal**: `⌘K` (macOS) atau `Ctrl+K` (Windows/Linux), serta klik tombol Search Pill di Titlebar.
2. **Backdrop Translucency**:
   - `background-color: rgba(0, 0, 0, 0.35); backdrop-filter: blur(8px);`
3. **Modal Surface Vibrancy**:
   - Lebar 620px (responsif mengecil di jendela kompak `< 860px`).
   - `backdrop-filter: saturate(190%) blur(36px);`
   - Border radius 16px dengan border halus `0 0 0 1px`.
4. **Navigasi Keyboard Penuh**:
   - `ArrowDown` & `ArrowUp`: Memindahkan sorotan item aktif.
   - `Enter`: Menjalankan aksi dari item yang sedang terpilih.
   - `Esc`: Menutup Command Palette seketika.
5. **Auto-Focus & Instant Filter**: Input teks otomatis terfokus saat palette terbuka.

### B. Registrasi Perintah & Tindakan Baru
Daftar perintah didefinisikan secara terstruktur di `src/components/macos/palette/commandPaletteItems.ts`:

```typescript
export interface CommandPaletteAction {
  id: string;
  title: string;
  category: 'Navigasi' | 'Tema' | 'Jendela' | 'Aksi';
  shortcut?: string;
  icon: React.ReactNode;
  onExecute: () => void;
  keywords?: string[];
}
```

Contoh menambah perintah baru untuk aplikasi turunan:
```typescript
{
  id: 'action-export-pdf',
  title: 'Export Laporan ke PDF',
  category: 'Aksi',
  shortcut: 'Mod+Shift+E',
  icon: <FileText size={16} />,
  onExecute: () => handleExportPdf(),
  keywords: ['download', 'cetak', 'unduh', 'document'],
}
```

---

## 2. macOS Notification Banner (Toast)

Notifikasi pada base app ini mengadopsi standar **Apple Notification Banner** di macOS Monterey / Sonoma / Sequoia:

```
┌────────────────────────────────────────────────────────┐
│ [Icon]  NAMA APLIKASI • sekarang                   (✕) │
│         Judul Notifikasi                               │
│         Pesan detail keterangan ringkas aksi berhasil   │
└────────────────────────────────────────────────────────┘
```

### A. Spesifikasi Geometri & Letak:
- **Posisi**: Wajib di **Kanan Atas (*top-right*)** (`top: 48px; right: 16px;`), melayang tepat di bawah garis titlebar.
- **Kapsul Melengkung**: `border-radius: 14px;` dengan border tipis `1px solid var(--border-subtle);`.
- **Translucency Vibrancy**: `backdrop-filter: saturate(190%) blur(24px);`.
- **Squircle Icon Box**: Ukuran `32px x 32px` dengan radius `8px`, diberi warna aksen latar belakang Apple System Tint beropasitas 16% (`rgba(52, 199, 89, 0.16)` untuk Success).
- **Tombol Dismiss Mikro**: Bulatan diameter 20px di kanan atas kartu notifikasi dengan hover halus.

### B. Cara Menggunakan Hook `useToast`:
```typescript
import { useToast } from '../hooks/useToast';

const { showToast } = useToast();

// Menampilkan notifikasi sukses
showToast(
  'Data Tersimpan',
  'Konfigurasi akun berhasil diperbarui ke server.',
  'success',
  4000 // Durasi auto-dismiss (ms)
);
```

Tipe notifikasi yang didukung: `'success'` (Hijau), `'info'` (Biru), `'warning'` (Kuning), `'error'` (Merah).

---

## 3. Slide-Out Inspector Detail Panel & Floating Action Bar

Saat pengguna mengklik item pada tabel atau daftar data, **jangan arahkan ke halaman baru**. Gunakan panel inspektur yang meluncur dari sisi kanan layar (`MacDetailPanel`):

### A. Fitur Panel:
- **Lebar**: `380px` (maksimal 85vw pada layar kompak).
- **Animasi**: Meluncur mulus dari tepi kanan (`animation: slideLeft 0.26s cubic-bezier(0.25, 0.46, 0.45, 0.94)`).
- **Header**: Judul panel, subtitle, dan tombol close bulat dengan shortcut hint `Esc`.
- **Body**: Scroll terisolasi untuk data properti dengan pola Inset Grouped.

### B. Floating Action Bar (Pill):
Di bagian bawah panel detail, sertakan bar aksi mengambang:
```html
<div className="macos-floating-action-bar">
  <button className="macos-floating-action-btn primary" onClick={handlePrimaryAction}>
    <Copy size={13} />
    <span>Salin Token</span>
  </button>
  <button className="macos-floating-action-btn" onClick={handleSecondaryAction}>
    <ExternalLink size={13} />
    <span>Buka di Web</span>
  </button>
</div>
```
- Berbentuk kapsul / pill dengan radius `9999px`.
- Mengambang 20px di atas tepi bawah dengan `backdrop-filter: blur(20px)`.

---

## 4. Keyboard Shortcuts & Token `Mod`

macOS memperlakukan keyboard sebagai perangkat kendali utama (*first-class citizen*).

### A. Abstraksi Token `Mod`:
Gunakan token `Mod` pada seluruh deklarasi shortcut:
```typescript
import { formatShortcut } from '../utils/shortcutFormatter';

formatShortcut('Mod+K', 'macos');       // Hasil: "⌘K"
formatShortcut('Mod+Shift+P', 'macos'); // Hasil: "⌘⇧P"
formatShortcut('Mod+K', 'windows');     // Hasil: "Ctrl + K"
```

### B. Komponen Badge `<kbd>`:
Render petunjuk tombol menggunakan styling visual badge:
```html
<kbd className="macos-kbd">⌘K</kbd>
```
Atribut CSS kunci:
```css
.macos-kbd {
  display: inline-flex;
  align-items: center;
  padding: 2px 6px;
  font-size: 10.5px;
  font-family: -apple-system, BlinkMacSystemFont, "SF Pro Text", system-ui, sans-serif;
  font-weight: 500;
  background-color: rgba(128, 128, 128, 0.14);
  border: 0.5px solid var(--border-subtle);
  border-radius: 4px;
  color: var(--text-secondary);
}
```

---

## 5. Proteksi Software Desktop Native

Untuk menjaga aplikasi terasa seperti software desktop native profesional (bukan sekadar halaman web):

1. **Suppression Context Menu Browser**:
   Modul `src/utils/disableContextMenu.ts` menonaktifkan klik kanan browser default pada elemen non-input:
   ```typescript
   export function setupContextMenuGuard(): () => void {
     const handleContextMenu = (e: MouseEvent) => {
       const target = e.target as HTMLElement | null;
       const isInput = target?.tagName === 'INPUT' || target?.tagName === 'TEXTAREA';
       if (!isInput) {
         e.preventDefault();
       }
     };
     window.addEventListener('contextmenu', handleContextMenu);
     return () => window.removeEventListener('contextmenu', handleContextMenu);
   }
   ```
2. **Text Selection Guard**:
   Elemen antarmuka chrome, titlebar, sidebar, dan tombol diberi `user-select: none;` agar tidak ter-highlight biru secara tidak sengaja saat pengguna mengklik atau mendrag window.
