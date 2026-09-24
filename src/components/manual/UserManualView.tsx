/**
 * @file UserManualView.tsx
 * @description Dokumentasi operasional profesional untuk Paylabs SNAP VA Desktop.
 *   Menyajikan 9 bab spesifikasi teknis, tabel parameter SNAP BI, kode respon resmi,
 *   dan panduan desktop client bebas AI slop.
 */

import React, { useRef, useCallback } from 'react';
import {
  BookOpen,
  Key,
  CreditCard,
  History,
  Search,
  Moon,
  AlertTriangle,
  Info,
  Sliders,
  List,
  ShieldCheck,
  Keyboard,
  Terminal,
} from 'lucide-react';
import './manualStyles.css';

/**
 * Metadata navigasi section panduan
 */
interface ManualSection {
  id: string;
  number: string;
  title: string;
  icon: React.ReactNode;
}

/**
 * Daftar 9 bab dokumentasi operasional
 */
const MANUAL_SECTIONS: readonly ManualSection[] = [
  { id: 'intro', number: '01', title: 'Arsitektur & Lingkungan', icon: <BookOpen size={15} /> },
  { id: 'credentials', number: '02', title: 'Kredensial & Autentikasi', icon: <Key size={15} /> },
  { id: 'configuration', number: '03', title: 'Konfigurasi Endpoint', icon: <Sliders size={15} /> },
  { id: 'generate-va', number: '04', title: 'Spesifikasi Pembuatan VA', icon: <CreditCard size={15} /> },
  { id: 'history', number: '05', title: 'Monitoring & Audit Riwayat', icon: <History size={15} /> },
  { id: 'command-palette', number: '06', title: 'Spotlight Command Palette', icon: <Search size={15} /> },
  { id: 'theme', number: '07', title: 'Sistem Desain & Tampilan', icon: <Moon size={15} /> },
  { id: 'shortcuts', number: '08', title: 'Pintasan Keyboard Native', icon: <Keyboard size={15} /> },
  { id: 'troubleshooting', number: '09', title: 'Status Respon & Diagnostik', icon: <AlertTriangle size={15} /> },
];

/**
 * Scroll halus ke section target
 */
function scrollToSection(sectionId: string): void {
  const targetElement = document.getElementById(sectionId);
  if (targetElement) {
    targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

/**
 * Komponen Daftar Isi berbentuk Inset Card
 */
const TableOfContents: React.FC = () => {
  const handleSectionClick = useCallback((sectionId: string) => {
    scrollToSection(sectionId);
  }, []);

  return (
    <nav className="manual-toc" aria-label="Daftar Isi Dokumentasi">
      <h2 className="manual-toc-title">
        <List size={15} />
        <span>Daftar Isi Dokumentasi</span>
      </h2>
      <ul className="manual-toc-list">
        {MANUAL_SECTIONS.map((section) => (
          <li key={section.id}>
            <button
              type="button"
              className="manual-toc-item"
              onClick={() => handleSectionClick(section.id)}
            >
              <span className="manual-toc-number">{section.number}</span>
              {section.icon}
              <span>{section.title}</span>
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
};

/**
 * Header dokumentasi formal
 */
const ManualHeader: React.FC = () => {
  return (
    <header className="manual-page-header">
      <div>
        <div className="manual-header-badge-row">
          <span className="manual-badge badge-accent">Standar SNAP BI</span>
          <span className="manual-badge">Tauri v2 Native</span>
          <span className="manual-badge">Versi 0.1.1</span>
        </div>
        <h1 className="manual-page-title">
          <BookOpen size={22} style={{ color: 'var(--accent-primary)' }} />
          <span>Dokumentasi Operasional Paylabs VA</span>
        </h1>
        <p className="manual-page-subtitle">
          Pedoman integrasi antarmuka, spesifikasi Bank Indonesia SNAP Open Banking, dan tata kelola transaksi.
        </p>
      </div>
    </header>
  );
};

/**
 * Bab 1: Arsitektur & Lingkungan
 */
const SectionArchitecture: React.FC = () => (
  <section id="intro" className="manual-section">
    <h2 className="manual-section-title">
      <span className="section-number">01</span>
      Arsitektur & Lingkungan Operasional
    </h2>
    <p>
      Paylabs VA Desktop dibangun di atas runtime <strong>Tauri v2</strong> dengan lapisan backend Rust
      dan frontend React TypeScript. Arsitektur IPC (Inter-Process Communication) memastikan
      seluruh pemanggilan jaringan dan pengelolaan kredensial terisolasi secara native dari celah webview.
    </p>
    <div className="manual-table-wrapper">
      <table className="manual-table">
        <thead>
          <tr>
            <th>Environment</th>
            <th>Base URL Endpoint</th>
            <th>Tujuan Penggunaan</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>SIT (Sandbox)</strong></td>
            <td><code className="manual-code">https://sit-pay.paylabs.co.id</code></td>
            <td>Pengujian fungsionalitas, simulasi pembayaran, dan verifikasi alur integrasi tanpa dana riil.</td>
          </tr>
          <tr>
            <td><strong>Production</strong></td>
            <td><code className="manual-code">https://pay.paylabs.co.id</code></td>
            <td>Operasional transaksi perbankan aktif dengan pemotongan saldo dan dana riil.</td>
          </tr>
        </tbody>
      </table>
    </div>
    <div className="manual-callout callout-info">
      <span className="manual-callout-icon"><Info size={16} /></span>
      <span>
        Badge profil aktif pada titlebar menunjukkan lingkungan yang sedang terhubung. Warna ungu menandakan
        SIT, dan warna merah tegas menandakan koneksi langsung ke Production.
      </span>
    </div>
  </section>
);

/**
 * Bab 2: Kredensial & Autentikasi
 */
const SectionCredentials: React.FC = () => (
  <section id="credentials" className="manual-section">
    <h2 className="manual-section-title">
      <span className="section-number">02</span>
      Kredensial & Autentikasi SNAP
    </h2>
    <p>
      Sesuai spesifikasi Bank Indonesia SNAP (Standar Nasional Open API Pembayaran), setiap pertukaran
      data membutuhkan tiga parameter identitas utama dan kalkulasi tanda tangan digital HMAC:
    </p>
    <ul>
      <li>
        <strong>Client ID</strong> — Identifikasi unik merchant yang diterbitkan oleh Paylabs pada saat registrasi.
      </li>
      <li>
        <strong>Secret Key</strong> — Kunci kriptografi simetris untuk menghasilkan header <code className="manual-code">X-SIGNATURE</code> (HMAC-SHA512).
      </li>
      <li>
        <strong>Merchant ID</strong> — Kode entitas bisnis penerima pembayaran Virtual Account.
      </li>
    </ul>
    <div className="manual-callout callout-warning">
      <span className="manual-callout-icon"><ShieldCheck size={16} /></span>
      <span>
        Secret Key disimpan secara lokal di dalam storage terisolasi perangkat pengguna dan tidak pernah dikirimkan
        ke server pihak ketiga selain saat proses penandatanganan request langsung ke gateway Paylabs.
      </span>
    </div>
  </section>
);

/**
 * Bab 3: Konfigurasi Endpoint
 */
const SectionConfiguration: React.FC = () => (
  <section id="configuration" className="manual-section">
    <h2 className="manual-section-title">
      <span className="section-number">03</span>
      Konfigurasi Endpoint & Switch Environment
    </h2>
    <p>
      Proses pembaruan kredensial dapat diakses melalui tombol indikator lingkungan di titlebar atau Command Palette:
    </p>
    <ul>
      <li>Klik badge status <strong>SIT</strong> / <strong>PROD</strong> pada titlebar kanan atas, atau tekan <kbd className="shortcut-badge">⌘K</kbd> lalu pilih "Pengaturan".</li>
      <li>Pilih target Environment (SIT atau Production) dari segmented control.</li>
      <li>Masukkan Client ID, Secret Key, dan Merchant ID yang sesuai dengan akun sandbox atau production Anda.</li>
      <li>Klik tombol <strong>Simpan Pengaturan</strong> untuk memvalidasi dan mengaktifkan profil.</li>
    </ul>
  </section>
);

/**
 * Bab 4: Spesifikasi Pembuatan Virtual Account
 */
const SectionGenerateVa: React.FC = () => (
  <section id="generate-va" className="manual-section">
    <h2 className="manual-section-title">
      <span className="section-number">04</span>
      Spesifikasi Pembuatan Virtual Account
    </h2>
    <p>
      Modul generator memproses pembuatan nomor Virtual Account dengan parameter terstandarisasi SNAP dalam dua mode spesifik:
    </p>
    <ul>
      <li>
        <strong>Dynamic VA (MultipleBNIVA)</strong> — Virtual account dinamis dengan nominal tagihan yang ditentukan (minimal Rp 10.000) dan opsi masa berlaku.
      </li>
      <li>
        <strong>Static VA (StaticBNIVA)</strong> — Virtual account statis dengan nominal bebas (Open Payment / Rp 0.00) tanpa kolom nominal tetap.
      </li>
    </ul>
    <div className="manual-table-wrapper">
      <table className="manual-table">
        <thead>
          <tr>
            <th>Field Parameter</th>
            <th>Tipe Data</th>
            <th>Wajib</th>
            <th>Keterangan</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><code className="manual-code">partnerServiceId</code></td>
            <td>String(8)</td>
            <td>Ya</td>
            <td>Kode channel bank resmi (misal: BCA 014, BNI 009, Mandiri 008, BRI 002).</td>
          </tr>
          <tr>
            <td><code className="manual-code">customerNo</code></td>
            <td>String(20)</td>
            <td>Ya</td>
            <td>Nomor identifikasi pelanggan atau nomor telepon.</td>
          </tr>
          <tr>
            <td><code className="manual-code">virtualAccountName</code></td>
            <td>String(255)</td>
            <td>Ya</td>
            <td>Nama pemilik akun tagihan yang tampil di layar ATM/m-Banking.</td>
          </tr>
          <tr>
            <td><code className="manual-code">virtualAccountPhone</code></td>
            <td>String(30)</td>
            <td>Opsional</td>
            <td>Nomor kontak/HP pembayar (format: 62xxxxxxxxxxx).</td>
          </tr>
          <tr>
            <td><code className="manual-code">totalAmount.value</code></td>
            <td>String(16,2)</td>
            <td>Ya</td>
            <td>Nominal tagihan dalam format IDR (minimal Rp 10.000).</td>
          </tr>
          <tr>
            <td><code className="manual-code">expiredDate</code></td>
            <td>String(ISO 8601)</td>
            <td>Opsional</td>
            <td>Batas waktu kadaluarsa nomor Virtual Account.</td>
          </tr>
        </tbody>
      </table>
    </div>
    <div className="manual-code-block">
      <pre>
{`// Contoh Payload Request SNAP Create VA
{
  "partnerServiceId": "   009",
  "customerNo": "081234567890",
  "virtualAccountNo": "009081234567890",
  "virtualAccountName": "PT ADIDAYA SOLUSI",
  "trxId": "TRX-20260919-0012",
  "totalAmount": {
    "value": "250000.00",
    "currency": "IDR"
  }
}`}
      </pre>
    </div>
  </section>
);

/**
 * Bab 5: Monitoring & Riwayat Transaksi
 */
const SectionHistory: React.FC = () => (
  <section id="history" className="manual-section">
    <h2 className="manual-section-title">
      <span className="section-number">05</span>
      Monitoring & Audit Riwayat Transaksi
    </h2>
    <p>
      Halaman <strong>Riwayat VA</strong> berfungsi sebagai audit log operasional lokal untuk seluruh
      Virtual Account yang berhasil di-generate melalui aplikasi:
    </p>
    <ul>
      <li>
        <strong>Pencarian Multi-Kolom</strong> — Filter data instan berdasarkan nomor VA, nama pelanggan, bank, atau Partner Trx ID.
      </li>
      <li>
        <strong>Segmented Filter Lingkungan</strong> — Memisahkan riwayat transaksi SIT dari Production untuk mempermudah rekonsiliasi.
      </li>
      <li>
        <strong>Drawer Rincian Teknis</strong> — Menampilkan data respon API mentah, waktu pembuatan, status kadaluarsa, dan opsi salin nomor cepat.
      </li>
      <li>
        <strong>Pembersihan Data Audit</strong> — Menu hapus riwayat lokal untuk kebutuhan testing siklus baru.
      </li>
    </ul>
  </section>
);

/**
 * Bab 6: Spotlight Command Palette
 */
const SectionCommandPalette: React.FC = () => (
  <section id="command-palette" className="manual-section">
    <h2 className="manual-section-title">
      <span className="section-number">06</span>
      Spotlight Command Palette (⌘K)
    </h2>
    <p>
      Command Palette dirancang mengadopsi interaksi native macOS Spotlight untuk efisiensi operator tanpa mouse:
    </p>
    <ul>
      <li>Buka jendela Command Palette kapan saja dengan shortcut <kbd className="shortcut-badge">⌘K</kbd> (macOS) atau <kbd className="shortcut-badge">Ctrl + K</kbd> (Windows).</li>
      <li>Ketikkan kata kunci tindakan seperti <em>"generate"</em>, <em>"riwayat"</em>, <em>"panduan"</em>, atau <em>"tema"</em> untuk navigasi instan.</li>
      <li>Ketik nomor VA untuk menemukan record transaksi secara langsung dari layar mana pun.</li>
      <li>Gunakan tombol panah <kbd className="shortcut-badge">↑</kbd> <kbd className="shortcut-badge">↓</kbd> dan <kbd className="shortcut-badge">Enter</kbd> untuk mengeksekusi aksi terpilih.</li>
    </ul>
  </section>
);

/**
 * Bab 7: Sistem Desain & Visual Display
 */
const SectionTheme: React.FC = () => (
  <section id="theme" className="manual-section">
    <h2 className="manual-section-title">
      <span className="section-number">07</span>
      Sistem Desain & Konfigurasi Tampilan
    </h2>
    <p>
      Aplikasi mematuhi standar desain Apple Human Interface Guidelines (HIG) dan Microsoft Fluent Design:
    </p>
    <ul>
      <li>
        <strong>Dark Mode Solid (Default)</strong> — Menggunakan palet kontras tinggi bebas refleksi silau, optimal untuk workstation keuangan dan engineering.
      </li>
      <li>
        <strong>Light Mode Presisi</strong> — Menggunakan border netral dengan rasio kontras WCAG AA untuk ruangan berpencahayaan terang.
      </li>
      <li>
        <strong>Persistensi Preferensi</strong> — Pilihan tema tersimpan permanen di penyimpanan lokal dan diterapkan otomatis pada siklus buka berikutnya.
      </li>
    </ul>
  </section>
);

/**
 * Bab 8: Pintasan Keyboard Native
 */
const SectionShortcuts: React.FC = () => (
  <section id="shortcuts" className="manual-section">
    <h2 className="manual-section-title">
      <span className="section-number">08</span>
      Referensi Pintasan Keyboard Native
    </h2>
    <div className="manual-table-wrapper">
      <table className="manual-table">
        <thead>
          <tr>
            <th>Fungsi Tindakan</th>
            <th>macOS Shortcut</th>
            <th>Windows / Linux Shortcut</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Buka / Tutup Spotlight Command Palette</td>
            <td><kbd className="shortcut-badge">⌘K</kbd></td>
            <td><kbd className="shortcut-badge">Ctrl + K</kbd></td>
          </tr>
          <tr>
            <td>Tutup Modal / Drawer / Popover Aktif</td>
            <td><kbd className="shortcut-badge">Esc</kbd></td>
            <td><kbd className="shortcut-badge">Esc</kbd></td>
          </tr>
          <tr>
            <td>Navigasi Daftar Pilihan</td>
            <td><kbd className="shortcut-badge">↑</kbd> / <kbd className="shortcut-badge">↓</kbd></td>
            <td><kbd className="shortcut-badge">↑</kbd> / <kbd className="shortcut-badge">↓</kbd></td>
          </tr>
          <tr>
            <td>Konfirmasi Eksekusi Aksi</td>
            <td><kbd className="shortcut-badge">Return</kbd></td>
            <td><kbd className="shortcut-badge">Enter</kbd></td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>
);

/**
 * Bab 9: Status Respon & Diagnostik
 */
const SectionTroubleshooting: React.FC = () => (
  <section id="troubleshooting" className="manual-section">
    <h2 className="manual-section-title">
      <span className="section-number">09</span>
      Status Respon SNAP & Diagnostik Troubleshooting
    </h2>
    <p>
      Berikut adalah tabel referensi kode respon standar SNAP Open Banking beserta tindakan korektif:
    </p>
    <div className="manual-table-wrapper">
      <table className="manual-table">
        <thead>
          <tr>
            <th>Response Code</th>
            <th>Status Deskripsi</th>
            <th>Penyebab & Solusi Teknis</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><code className="manual-code">2002700</code></td>
            <td>Successful</td>
            <td>Virtual Account berhasil diterbitkan oleh perbankan tujuan.</td>
          </tr>
          <tr>
            <td><code className="manual-code">4002700</code></td>
            <td>Bad Request / Invalid Field</td>
            <td>Parameter wajib kosong atau format nominal tidak memenuhi batas minimum bank.</td>
          </tr>
          <tr>
            <td><code className="manual-code">4012700</code></td>
            <td>Unauthorized / Invalid Signature</td>
            <td>Kombinasi Client ID, Secret Key, atau Merchant ID tidak valid pada environment terkait.</td>
          </tr>
          <tr>
            <td><code className="manual-code">4042700</code></td>
            <td>Channel Not Supported</td>
            <td>Bank channel belum diaktifkan pada profil merchant Paylabs.</td>
          </tr>
          <tr>
            <td><code className="manual-code">5002700</code></td>
            <td>Internal Server Error</td>
            <td>Gangguan konektivitas pada core banking tujuan. Silakan coba kembali beberapa saat lagi.</td>
          </tr>
        </tbody>
      </table>
    </div>
    <div className="manual-callout callout-info">
      <span className="manual-callout-icon"><Terminal size={16} /></span>
      <span>
        Untuk kebutuhan penelusuran log lebih lanjut, sertakan nilai <code className="manual-code">X-PARTNER-ID</code> dan timestamp transaksi saat menghubungi tim operasional Paylabs.
      </span>
    </div>
  </section>
);

/**
 * Halaman panduan pengguna lengkap dengan konten terstruktur 9 bab.
 */
export const UserManualView: React.FC = () => {
  const manualRef = useRef<HTMLDivElement>(null);

  return (
    <div className="paylabs-page-container manual-page-container" ref={manualRef}>
      <ManualHeader />
      <TableOfContents />
      <hr className="manual-divider" />
      <SectionArchitecture />
      <hr className="manual-divider" />
      <SectionCredentials />
      <hr className="manual-divider" />
      <SectionConfiguration />
      <hr className="manual-divider" />
      <SectionGenerateVa />
      <hr className="manual-divider" />
      <SectionHistory />
      <hr className="manual-divider" />
      <SectionCommandPalette />
      <hr className="manual-divider" />
      <SectionTheme />
      <hr className="manual-divider" />
      <SectionShortcuts />
      <hr className="manual-divider" />
      <SectionTroubleshooting />
      <hr className="manual-divider" />
      <footer style={{ fontSize: 12, color: 'var(--text-tertiary)', textAlign: 'center', marginTop: 24, paddingBottom: 16 }}>
        Paylabs VA Desktop Suite • Dokumentasi Operasional SNAP Terpadu • 2026
      </footer>
    </div>
  );
};
