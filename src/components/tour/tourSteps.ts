/**
 * @file tourSteps.ts
 * @description Definisi langkah-langkah onboarding tour interaktif "Take a Tour"
 *   menggunakan format Driver.js DriveStep. Seluruh judul dan deskripsi disusun
 *   secara profesional bebas emoji informal, mencakup alur lengkap dari pembuatan
 *   Virtual Account hingga inspeksi Riwayat Transaksi.
 */

import type { DriveStep } from 'driver.js';
import type { ActiveTab } from '../layout/Sidebar';

/**
 * Key localStorage untuk menyimpan status tour sudah pernah diselesaikan
 */
export const TOUR_COMPLETED_STORAGE_KEY = 'antigravity_tour_completed';

/**
 * Interface ekstensi DriveStep yang menyertakan target tab aplikasi
 */
export interface CustomDriveStep extends DriveStep {
  /** Tab yang harus aktif saat step ini ditampilkan */
  targetTab?: ActiveTab;
}

/**
 * Langkah-langkah tur onboarding aplikasi Paylabs VA.
 * Setiap step menargetkan CSS selector yang sesuai dengan elemen UI.
 */
export const TOUR_STEPS: CustomDriveStep[] = [
  {
    element: '.adaptive-titlebar',
    targetTab: 'va-generator',
    popover: {
      title: 'Titlebar & Kontrol Jendela',
      description:
        'Area titlebar utama desktop dilengkapi tombol kontrol jendela (tutup, minimalkan, maksimalkan) serta zona drag untuk memindahkan jendela aplikasi.',
      side: 'bottom',
      align: 'center',
    },
  },
  {
    element: '.titlebar-credential-pill',
    targetTab: 'va-generator',
    popover: {
      title: 'Kredensial API Paylabs',
      description:
        'Status dan indikator lingkungan aktif (SIT/PROD). Klik untuk membuka panel konfigurasi Client ID, Secret Key, dan Merchant ID sebelum transaksi.',
      side: 'bottom',
      align: 'center',
    },
  },
  {
    element: '.titlebar-search-btn',
    targetTab: 'va-generator',
    popover: {
      title: 'Spotlight Command Palette',
      description:
        'Akses cepat untuk mencari riwayat VA, berpindah halaman, dan menjalankan aksi sistem menggunakan shortcut Ctrl+K (atau ⌘K pada macOS).',
      side: 'bottom',
      align: 'center',
    },
  },
  {
    element: '.titlebar-theme-toggle',
    targetTab: 'va-generator',
    popover: {
      title: 'Mode Tampilan',
      description:
        'Beralih antara Mode Gelap dan Mode Terang dengan kontras visual tinggi. Pilihan tema disimpan persisten pada penyimpanan lokal.',
      side: 'bottom',
      align: 'center',
    },
  },
  {
    element: '.app-sidebar',
    targetTab: 'va-generator',
    popover: {
      title: 'Navigasi Menu Utama',
      description:
        'Sidebar untuk berpindah menu kerja: Generate VA untuk alokasi baru, Riwayat VA untuk daftar transaksi, dan Panduan untuk dokumentasi.',
      side: 'right',
      align: 'start',
    },
  },
  {
    element: '#va-bank-selector',
    targetTab: 'va-generator',
    popover: {
      title: 'Pilihan Channel Bank',
      description:
        'Pilih bank penyedia Virtual Account dari daftar mitra Paylabs. Pemilihan bank wajib dilakukan sebelum proses generate dapat dieksekusi.',
      side: 'bottom',
      align: 'start',
    },
  },
  {
    element: '#va-amount-input',
    targetTab: 'va-generator',
    popover: {
      title: 'Nominal Tagihan',
      description:
        'Tentukan nilai pembayaran dalam Rupiah. Anda dapat mengetik manual atau memilih tombol nominal instan (50rb, 100rb, 250rb, dst.).',
      side: 'bottom',
      align: 'start',
    },
  },
  {
    element: '#va-generate-btn',
    targetTab: 'va-generator',
    popover: {
      title: 'Generate Virtual Account',
      description:
        'Kirim permintaan pembuatan VA ke server Paylabs SNAP. Nomor akun virtual dan rincian transaksi akan ditampilkan pada panel sebelah kanan.',
      side: 'top',
      align: 'start',
    },
  },
  {
    element: '#sidebar-nav-va-history',
    targetTab: 'va-generator',
    advanceOnClick: true,
    popover: {
      title: 'Navigasi Riwayat VA',
      description:
        'Klik menu Riwayat VA di sidebar ini atau klik tombol Lanjut untuk memeriksa seluruh histori transaksi Virtual Account yang tersimpan secara lokal di sistem.',
      side: 'right',
      align: 'center',
    },
  },
  {
    element: '#va-history-stats',
    targetTab: 'va-history',
    popover: {
      title: 'Ringkasan Statistik Transaksi',
      description:
        'Metrik transaksi mencakup total transaksi yang terdata, akumulasi nominal Rupiah, dan verifikasi status penyimpanan database lokal.',
      side: 'bottom',
      align: 'center',
    },
  },
  {
    element: '#va-history-toolbar',
    targetTab: 'va-history',
    popover: {
      title: 'Pencarian & Filter Lingkungan',
      description:
        'Fitur pencarian instan berdasarkan nama, bank, atau nomor VA, serta pemfilteran transaksi berdasarkan lingkungan SIT maupun PROD.',
      side: 'bottom',
      align: 'center',
    },
  },
  {
    element: '#va-history-table',
    targetTab: 'va-history',
    popover: {
      title: 'Tabel Riwayat Transaksi',
      description:
        'Daftar catatan transaksi lengkap. Anda dapat menyalin nomor VA dengan satu klik atau membuka drawer detail untuk audit transaksi.',
      side: 'top',
      align: 'center',
    },
  },
  {
    element: '.status-bar-container',
    targetTab: 'va-history',
    popover: {
      title: 'Status Bar & Gateway Server',
      description:
        'Status bar bawah mengonfirmasi status lingkungan aktif, Base URL API Paylabs yang sedang terhubung, dan preferensi tema aplikasi.',
      side: 'top',
      align: 'center',
    },
  },
];
