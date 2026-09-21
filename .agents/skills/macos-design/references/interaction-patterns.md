# Interaction Patterns Reference (macOS)

## Daftar Isi
1. Keyboard Shortcuts & Badges
2. Command Palette (Spotlight / Raycast Style)
3. Slide-out Detail Panels
4. Floating Action Bars
5. Micro-Animations & Easing
6. Optimistic UI & Toast Feedback

---

## 1. Keyboard Shortcuts & Badges

macOS menjadikan shortcut keyboard sebagai interaksi kelas satu:
- `⌘K` / `⌘Space` — Command Palette / Quick Search
- `⌘,` — Preferences / Customizer
- `⌘N` — Item Baru
- `Esc` — Menutup modal, dropdown, atau panel slide-out
- `Enter` — Konfirmasi / Pilih aksi aktif

### Tampilan Shortcut Hint
Gunakan format badge `<kbd>` native:
```css
.kbd {
  display: inline-flex;
  align-items: center;
  padding: 2px 6px;
  font-size: 11px;
  font-family: -apple-system, BlinkMacSystemFont, sans-serif;
  background: rgba(128, 128, 128, 0.12);
  border-radius: 4px;
  border: 0.5px solid rgba(128, 128, 128, 0.2);
  color: inherit;
  opacity: 0.65;
  gap: 2px;
}
```

---

## 2. Command Palette (Spotlight / Raycast Pattern)

- Dipicu dengan shortcut `⌘K` (atau `Ctrl+K`).
- Berada di posisi tengah mengambang dengan backdrop blur.
- Input pencarian langsung memfilter aksi:
  - Navigasi tab/halaman
  - Mengubah tema / preset warna Sneat
  - Beralih gaya platform desktop
  - Kontrol window (maximize, minimize, customizer)
- Mendukung navigasi panah atas/bawah dan tombol `Enter` untuk mengeksekusi aksi.

---

## 3. Slide-out Detail Panels & Floating Action Bars

- Panel meluncur dari sisi kanan layar (`transform: translateX(0)`).
- Di bagian bawah panel, sertakan **Floating Action Bar**:
  - Berbentuk kapsul / pill dengan backdrop blur `blur(20px)`.
  - Tombol aksi cepat: Salin Snippet, Bagikan Data, Tutup Panel.
  - Memberi feedback visual instan saat tombol ditekan.

---

## 4. Micro-Animations & Easing

- Easing standar macOS:
  ```css
  --ease-out: cubic-bezier(0.25, 0.46, 0.45, 0.94);
  --ease-spring: cubic-bezier(0.34, 1.56, 0.64, 1);
  --duration-fast: 150ms;
  --duration-normal: 250ms;
  ```
- Animasi harus halus, responsif, dan tidak memperlambat pekerjaan pengguna.
