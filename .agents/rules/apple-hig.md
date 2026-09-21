---
description: Pedoman aturan desain antarmuka Apple Human Interface Guidelines (HIG) untuk komponen iOS, iPadOS, dan macOS
globs: src/**/*.tsx, src/**/*.css
always_on: true
---

# 📐 Aturan Desain Apple Human Interface Guidelines (HIG)

Setiap pembuatan atau modifikasi antarmuka wajib mematuhi standar desain Apple:

1. **Tipografi & Hierarki**:
   - Utamakan font native `-apple-system, BlinkMacSystemFont, "SF Pro Text", "SF Pro Display"`.
   - Gunakan skala Dynamic Type standar Apple (Large Title 34px, Title 22px, Body 17px, Footnote 13px).

2. **Inset Grouped Layout**:
   - Komponen card atau list pada mode Apple wajib menggunakan format **Inset Grouped** dengan radius `12px` - `14px` dan padding horizontal `16px`.
   - Latar belakang sub-permukaan menggunakan kontras halus, bukan gradient berlebihan.

3. **Interaktivitas & Saklar**:
   - Saklar (toggle switch) iOS wajib menggunakan warna hijau `#34c759` saat aktif dan animasi spring halus.
   - Tombol klik/sentuh harus memiliki target area minimal `44x44px`.

4. **Karakteristik Platform**:
   - **macOS**: Titlebar Traffic Lights di kiri atas (🔴🟡🟢), Sidebar navigasi vertikal di kiri, shortcut `⌘`.
   - **iOS / iPadOS**: Large Title navigation, Bottom Tab Bar di bawah, Inset Grouped cards, Bottom Action Sheets.
   - **Windows**: Titlebar Controls di kanan atas (Fluent Min/Max/Close), shortcut `Ctrl`.
