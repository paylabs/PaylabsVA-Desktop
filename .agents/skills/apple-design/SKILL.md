---
name: apple-design
description: >-
  Skill panduan desain dan audit antarmuka berbasis Apple Human Interface Guidelines (HIG).
  Aktifkan skill ini untuk merancang atau mereview komponen, tipografi, warna, tata letak,
  dan interaksi agar mematuhi standar desain resmi Apple (iOS, iPadOS, dan macOS).
---

# 🍏 Apple Design System & HIG Guidelines

Skill ini memandu perancangan dan audit UI/UX antarmuka desktop dan mobile agar mematuhi standar **Apple Human Interface Guidelines (HIG)** yang otentik, elegan, dan aksesibel.

---

## 1. Delapan Prinsip Desain Utama Apple (Eight Core Principles)

1. **Purpose (Tujuan)**: Setiap layar dan elemen harus memiliki tujuan yang jelas bagi pengguna.
2. **Agency (Kendali Pengguna)**: Pengguna memegang kendali penuh atas navigasi, keputusan, dan data mereka.
3. **Responsibility (Tanggung Jawab)**: Desain harus aman, melindungi privasi, dan memberikan konfirmasi sebelum aksi destruktif.
4. **Familiarity (Keakraban)**: Menggunakan pola standar platform (Tab Bars, Segmented Controls, Inset Grouped Lists) agar pengguna langsung memahami cara pakainya.
5. **Flexibility (Fleksibilitas)**: Desain beradaptasi dengan mulus terhadap berbagai ukuran layar, rotasi, mode terang/gelap, dan Dynamic Type.
6. **Simplicity (Kesederhanaan)**: Hapus elemen visual yang berlebihan. Utamakan konten, bukan dekorasi tiruan.
7. **Craft (Ketelitian & Kerapihan)**: Penataan jarak pixel-perfect (grid 4pt/8pt), sudut membulat harmonis (continuous curvature / squircle), dan tipografi tajam.
8. **Delight (Kepuasan Pengguna)**: Sentuhan mikro-interaksi yang halus, haptic feedback responsif, dan animasi fluid tanpa jeda.

---

## 2. Fondasi Visual iOS & iPadOS

### A. Tipografi SF Pro Hierarchy
- **Large Title**: 34pt, Bold, tracking -0.4pt (khas halaman utama iOS)
- **Title 1**: 28pt, Bold, tracking -0.3pt
- **Title 2**: 22pt, Bold, tracking -0.2pt
- **Headline**: 17pt, Semi-Bold, tracking -0.4pt
- **Body**: 17pt, Regular, tracking -0.4pt (tinggi baris 22pt)
- **Callout**: 16pt, Regular
- **Subheadline**: 15pt, Regular
- **Footnote**: 13pt, Regular
- **Caption 1**: 12pt, Regular
- **Caption 2**: 11pt, Regular

### B. Warna & Kontras Apple HIG
- **System Blue**: `#007aff` (Light) / `#0a84ff` (Dark)
- **System Green**: `#34c759` (Light) / `#30d158` (Dark) — warna aktif saklar iOS Switch
- **System Red**: `#ff3b30` (Light) / `#ff453a` (Dark)
- **System Orange**: `#ff9500` (Light) / `#ff9f0a` (Dark)
- **System Gray 6 (Inset Grouped Canvas)**: `#f2f2f7` (Light) / `#1c1c1e` (Dark)
- **Secondary System Background (Card Surface)**: `#ffffff` (Light) / `#2c2c2e` (Dark)

---

## 3. Komponen Utama iOS Style

### 1. Inset Grouped Table / Cards
- Sudut membulat `border-radius: 10px` hingga `14px`.
- Margin kiri dan kanan dari tepi layar (16px).
- Pembatas baris memiliki inset kiri 16px dari teks (tidak memotong dari tepi paling kiri).

### 2. iOS Bottom Tab Bar
- Berada di posisi paling bawah layar dengan tinggi 49pt (atau 56pt dengan padding aman).
- Ikon 24x24pt dengan label 10pt di bawahnya.
- Warna aktif menggunakan System Tint, warna non-aktif System Gray.

### 3. iOS Switch Toggle
- Ukuran standar 51x31pt.
- Latar belakang hijau `#34c759` saat aktif, abu-abu `#e9e9ea` saat mati.
- Bulatan putih (thumb) bergerak halus dengan pegas elastis (*spring animation*).

### 4. iOS Action Sheet
- Meluncur dari tepi bawah dengan sudut membulat atas 14px.
- Tombol aksi terpisah jelas dengan tombol **Batal / Cancel** yang memiliki jarak pembatas.

---

## 4. Checklist Audit Desain Apple HIG
- [ ] Apakah kontras teks terhadap latar belakang memenuhi minimal 4.5:1 (WCAG AA)?
- [ ] Apakah elemen sentuh/klik memiliki target minimal 44x44pt?
- [ ] Apakah sudut kartu menggunakan radius squircle konsisten (10px - 14px)?
- [ ] Apakah animasi terasa halus (0.2s - 0.3s cubic-bezier)?
- [ ] Apakah warna hijau `#34c759` digunakan khusus untuk status sukses/switch aktif?
