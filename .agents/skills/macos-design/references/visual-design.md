# Visual Design Reference (macOS)

## Daftar Isi
1. Vibrancy, Translucency & Blur
2. Layered Shadows & Depth
3. SF Pro Typography Scale
4. Color Hierarchy & Dark Mode

---

## 1. Vibrancy, Translucency & Blur

Karakter visual utama macOS adalah latar belakang tembus pandang lembut:
```css
.sidebar {
  background: rgba(246, 246, 246, 0.72);
  backdrop-filter: saturate(180%) blur(20px);
  -webkit-backdrop-filter: saturate(180%) blur(20px);
}

[data-theme="dark"] .sidebar {
  background: rgba(30, 30, 30, 0.72);
}
```
> **Catatan**: Gunakan `saturate(180%)` bersama `blur(20px)` agar warna tidak pucat di belakang efek blur.

---

## 2. Layered Shadows & Depth

macOS menggunakan bayangan berlapis (bukan bayangan tunggal pekat) dengan border definisi `0.5px`:
```css
/* Card & Button Subtle */
box-shadow: 0 0 0 0.5px var(--border-subtle), 0 1px 3px rgba(0, 0, 0, 0.06);

/* Popovers & Floating Bars */
box-shadow: 0 0 0 0.5px var(--border-subtle), 0 4px 16px rgba(0, 0, 0, 0.12);

/* Modal & Command Palette */
box-shadow: 0 0 0 0.5px var(--border-subtle), 0 12px 40px rgba(0, 0, 0, 0.25);
```

---

## 3. SF Pro Typography Scale

- **Large Title**: 26px Bold (Letter spacing -0.03em)
- **Title 1**: 22px Regular
- **Title 2**: 17px Regular
- **Title 3**: 15px Semibold
- **Body**: 13px Regular (Line height 18px)
- **Caption / Footnote**: 11-12px Regular

---

## 4. Spacing 8px Grid & Corner Radii

- Window: `10-12px`
- Panel / Modal: `12-14px`
- Card: `8-10px`
- Button: `6-8px`
- Input: `6px`
- Pill / Badge: `9999px`
