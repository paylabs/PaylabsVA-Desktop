/**
 * @file bankFormatter.ts
 * @description Helper utilitas untuk menyederhanakan dan menormalisasi nama bank (BCA, BNI, BRI, Mandiri, dll).
 */

/**
 * Menyederhanakan nama bank panjang atau kode menjadi nama singkat (misal: "BCA (Bank Central Asia)" -> "BCA").
 *
 * @param channelName - Nama bank mentah dari backend atau riwayat disk
 * @param channelCode - Kode channel opsional sebagai fallback
 * @returns Nama bank yang disederhanakan
 */
export function formatBankName(channelName?: string, channelCode?: string): string {
  const raw = (channelName || channelCode || '').trim();
  if (!raw) return '-';

  const upper = raw.toUpperCase();
  if (upper.includes('BCA')) return 'BCA';
  if (upper.includes('BNI')) return 'BNI';
  if (upper.includes('BRI')) return 'BRI';
  if (upper.includes('MANDIRI')) return 'Mandiri';
  if (upper.includes('PERMATA')) return 'Permata';
  if (upper.includes('DANAMON')) return 'Danamon';
  if (upper.includes('CIMB')) return 'CIMB';
  if (upper.includes('BSI') || upper.includes('SYARIAH INDONESIA')) return 'BSI';
  if (upper.includes('SINARMAS')) return 'Sinarmas';
  if (upper.includes('MUAMALAT')) return 'Muamalat';
  if (upper.includes('MAYBANK')) return 'Maybank';

  // Hapus kata 'Bank ' atau suffix ' Bank' jika ada
  return raw.replace(/^Bank\s+/i, '').replace(/\s+Bank$/i, '');
}
