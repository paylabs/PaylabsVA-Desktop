import React from 'react';
import {
  CreditCard,
  History,
  Key,
  Sun,
  Receipt,
  Layers,
} from 'lucide-react';
import { ActiveTab } from '../../layout/Sidebar';
import { HistoryRecord } from '../../../types/paylabs';
import { formatBankName } from '../../../utils/bankFormatter';

export interface CommandItem {
  id: string;
  title: string;
  category: string;
  icon: React.ReactNode;
  shortcutHint?: string;
  keywords?: string[];
  perform: () => void;
}

export interface BuildCommandParams {
  onSelectTab: (tab: ActiveTab) => void;
  onOpenSettings?: () => void;
  onToggleTheme: () => void;
  history?: readonly HistoryRecord[];
  onSelectHistoryRecord?: (record: HistoryRecord) => void;
}

/**
 * Format string nominal ke format ringkas Rupiah
 */
function formatShortRupiah(amount: string): string {
  const num = parseFloat(amount);
  if (isNaN(num)) return amount;
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(num);
}

/**
 * Membangun daftar perintah bawaan yang tersedia
 */
export function buildCommandItems(p: BuildCommandParams): CommandItem[] {
  const items: CommandItem[] = [
    {
      id: 'tab-va-gen',
      title: 'Buka Dynamic VA Generator (MultipleBNIVA)',
      category: 'Navigasi',
      icon: <CreditCard size={16} />,
      keywords: ['dynamic', 'va', 'generator', 'bni', 'multiple', 'buka paylabs va generator'],
      perform: () => p.onSelectTab('va-generator'),
    },
    {
      id: 'tab-va-stat',
      title: 'Buka Static VA Generator (StaticBNIVA)',
      category: 'Navigasi',
      icon: <Layers size={16} />,
      keywords: ['static', 'va', 'generator', 'bni', 'open amount', '0'],
      perform: () => p.onSelectTab('static-va'),
    },
    {
      id: 'tab-va-hist',
      title: 'Buka Riwayat Transaksi Virtual Account',
      category: 'Navigasi',
      icon: <History size={16} />,
      perform: () => p.onSelectTab('va-history'),
    },
  ];

  if (p.onOpenSettings) {
    items.push({
      id: 'open-settings',
      title: 'Buka Pengaturan Kredensial (SIT & Production)',
      category: 'Konfigurasi',
      icon: <Key size={16} />,
      perform: p.onOpenSettings,
    });
  }

  items.push({
    id: 'theme-toggle',
    title: 'Toggle Mode Gelap / Terang',
    category: 'Tampilan',
    icon: <Sun size={16} />,
    perform: p.onToggleTheme,
  });

  // Tambahkan item riwayat transaksi jika tersedia
  if (p.history && p.history.length > 0) {
    for (const rec of p.history) {
      const bank = formatBankName(rec.channelName, rec.channel);
      const nominal = formatShortRupiah(rec.amount);
      const cleanVa = (rec.virtualAccountNo || '').replace(/\s+/g, '');
      const cleanTrx = (rec.trxId || '').replace(/\s+/g, '');

      items.push({
        id: `hist-${rec.id}`,
        title: `${rec.name} • ${bank} (${nominal})`,
        category: `Riwayat VA • ${rec.virtualAccountNo}`,
        icon: <Receipt size={16} />,
        keywords: [
          rec.virtualAccountNo,
          cleanVa,
          rec.name,
          rec.trxId || '',
          cleanTrx,
          bank,
          rec.channel,
          rec.amount,
        ].filter(Boolean),
        perform: () => {
          p.onSelectTab('va-history');
          p.onSelectHistoryRecord?.(rec);
        },
      });
    }
  }

  return items;
}

/**
 * Memfilter daftar perintah berdasarkan teks pencarian
 */
export function filterCommands(items: CommandItem[], query: string): CommandItem[] {
  const clean = query.trim().toLowerCase();
  if (!clean) return items;
  const cleanNumbersOnly = clean.replace(/\D/g, '');

  return items.filter((item) => {
    // 1. Cocokkan title atau category
    if (
      item.title.toLowerCase().includes(clean) ||
      item.category.toLowerCase().includes(clean)
    ) {
      return true;
    }

    // 2. Cocokkan keywords (nomor VA, Trx ID, bank, dll)
    if (item.keywords && item.keywords.length > 0) {
      for (const kw of item.keywords) {
        if (kw.toLowerCase().includes(clean)) return true;

        // Pencarian nomor angka murni (seperti nomor VA atau Trx ID)
        if (cleanNumbersOnly.length >= 3) {
          const kwNumbers = kw.replace(/\D/g, '');
          if (kwNumbers && kwNumbers.includes(cleanNumbersOnly)) {
            return true;
          }
        }
      }
    }

    return false;
  });
}
