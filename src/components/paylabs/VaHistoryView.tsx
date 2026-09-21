/**
 * @file VaHistoryView.tsx
 * @description View tabel riwayat transaksi Virtual Account Paylabs bergaya native macOS (Apple HIG Inset Table) dengan Slide-out Detail Drawer.
 */

import React, { useState, useMemo, useEffect, useRef } from 'react';
import {
  History,
  Trash2,
  RefreshCw,
  Search,
  Copy,
  Check,
  CreditCard,
  AlertTriangle,
  Receipt,
  CheckCircle2,
  ChevronRight,
} from 'lucide-react';
import { HistoryRecord } from '../../types/paylabs';
import { usePaylabs } from '../../hooks/usePaylabs';
import { formatBankName } from '../../utils/bankFormatter';
import { Modal } from '../ui/Modal';
import { Tooltip } from '../ui/Tooltip';
import { VaHistoryDetailDrawer } from './VaHistoryDetailDrawer';

export interface VaHistoryViewProps {
  onShowToast: (title: string, message?: string, type?: 'info' | 'success' | 'warning' | 'error') => void;
  selectedRecordFromPalette?: HistoryRecord | null;
  onClearSelectedRecordFromPalette?: () => void;
}

/**
 * Format string nominal angka menjadi mata uang Rupiah
 */
function formatRupiah(amount: string): string {
  const num = parseFloat(amount);
  if (isNaN(num)) return `Rp ${amount}`;
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(num);
}

/**
 * Filter record riwayat berdasarkan kata kunci dan environment
 */
function filterHistoryRecords(
  records: HistoryRecord[],
  query: string,
  envFilter: string
): HistoryRecord[] {
  const normalizedQuery = query.toLowerCase().trim();
  return records.filter((rec) => {
    const matchEnv = envFilter === 'ALL' || rec.environment?.toUpperCase() === envFilter;
    if (!matchEnv) return false;
    if (!normalizedQuery) return true;

    const matchName = rec.name?.toLowerCase().includes(normalizedQuery);
    const matchVa = rec.virtualAccountNo?.toLowerCase().includes(normalizedQuery);
    const matchPhone = rec.virtualAccountPhone?.toLowerCase().includes(normalizedQuery);
    const matchTrx = rec.trxId?.toLowerCase().includes(normalizedQuery);
    const matchBank = rec.channelName?.toLowerCase().includes(normalizedQuery) ||
                      rec.channel?.toLowerCase().includes(normalizedQuery);

    return matchName || matchVa || matchPhone || matchTrx || matchBank;
  });
}

/**
 * Komponen Baris Tabel Riwayat Transaksi macOS
 */
interface HistoryRowProps {
  record: HistoryRecord;
  copiedId: string | null;
  copiedPhoneId: string | null;
  onCopyVa: (e: React.MouseEvent, id: string, vaNo: string) => void;
  onCopyPhone: (e: React.MouseEvent, id: string, phone: string) => void;
  onSelectRow: (rec: HistoryRecord) => void;
}

const HistoryRow: React.FC<HistoryRowProps> = ({
  record,
  copiedId,
  copiedPhoneId,
  onCopyVa,
  onCopyPhone,
  onSelectRow,
}) => {
  const isCopied = copiedId === record.id;
  const isPhoneCopied = copiedPhoneId === record.id;
  const isProd = record.environment?.toUpperCase() === 'PROD';

  const [dateStr, timeStr] = useMemo(() => {
    if (!record.createdAt) return ['-', ''];
    try {
      const d = new Date(record.createdAt);
      if (isNaN(d.getTime())) return [record.createdAt, ''];
      const date = new Intl.DateTimeFormat('id-ID', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      }).format(d);
      const time = new Intl.DateTimeFormat('id-ID', {
        hour: '2-digit',
        minute: '2-digit',
      }).format(d);
      return [date, time];
    } catch {
      return [record.createdAt, ''];
    }
  }, [record.createdAt]);

  return (
    <tr
      className="paylabs-history-tr cursor-pointer"
      onClick={() => onSelectRow(record)}
    >
      <td className="paylabs-history-td">
        <Tooltip content={isProd ? 'Server Mode: Production' : 'Server Mode: SIT'} position="top">
          <span className={`paylabs-env-badge ${isProd ? 'prod' : 'sit'}`}>
            {record.environment || 'SIT'}
          </span>
        </Tooltip>
      </td>
      <td className="paylabs-history-td" style={{ whiteSpace: 'nowrap' }}>
        <Tooltip content={`Dibuat pada: ${dateStr}${timeStr ? ` pukul ${timeStr} WIB` : ''}`} position="top">
          <div className="flex flex-col">
            <span className="font-medium text-xs text-primary">{dateStr}</span>
            <span className="font-mono text-xs text-subtle">{timeStr ? `${timeStr} WIB` : ''}</span>
          </div>
        </Tooltip>
      </td>
      <td className="paylabs-history-td" style={{ whiteSpace: 'nowrap' }}>
        <Tooltip content={`Channel Bank: ${formatBankName(record.channelName, record.channel)}`} position="top">
          <span className="paylabs-bank-badge">
            {formatBankName(record.channelName, record.channel)}
          </span>
        </Tooltip>
      </td>
      <td className="paylabs-history-td" style={{ whiteSpace: 'nowrap' }}>
        <div className="paylabs-va-copy-cell">
          <code className="paylabs-va-code font-mono text-xs">{record.virtualAccountNo}</code>
          <Tooltip content={isCopied ? 'Nomor Tersalin!' : 'Salin Nomor VA'} position="top">
            <button
              type="button"
              className="paylabs-icon-mini-btn"
              aria-label="Salin Nomor VA"
              onClick={(e) => onCopyVa(e, record.id, record.virtualAccountNo)}
            >
              {isCopied ? <Check size={12} className="text-success" /> : <Copy size={12} />}
            </button>
          </Tooltip>
        </div>
      </td>
      <td className="paylabs-history-td" style={{ whiteSpace: 'nowrap' }}>
        {record.virtualAccountPhone ? (
          <div className="paylabs-va-copy-cell">
            <code className="paylabs-va-code font-mono text-xs">{record.virtualAccountPhone}</code>
            <Tooltip content={isPhoneCopied ? 'Nomor Tersalin!' : 'Salin Nomor HP'} position="top">
              <button
                type="button"
                className="paylabs-icon-mini-btn"
                aria-label="Salin Nomor HP"
                onClick={(e) => onCopyPhone(e, record.id, record.virtualAccountPhone!)}
              >
                {isPhoneCopied ? <Check size={12} className="text-success" /> : <Copy size={12} />}
              </button>
            </Tooltip>
          </div>
        ) : (
          <span className="text-subtle font-mono text-xs">-</span>
        )}
      </td>
      <td className="paylabs-history-td font-medium text-primary" style={{ maxWidth: 160 }}>
        <Tooltip content={record.name || '-'} position="top">
          <span
            style={{
              display: 'inline-block',
              maxWidth: 160,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              verticalAlign: 'bottom',
              pointerEvents: 'none',
            }}
          >
            {record.name || '-'}
          </span>
        </Tooltip>
      </td>
      <td className="paylabs-history-td font-mono font-semibold text-accent" style={{ whiteSpace: 'nowrap' }}>
        <Tooltip content={`Nominal: ${formatRupiah(record.amount)}`} position="top">
          <span>{formatRupiah(record.amount)}</span>
        </Tooltip>
      </td>
      <td className="paylabs-history-td font-mono text-xs text-subtle" style={{ whiteSpace: 'nowrap' }}>
        <Tooltip content={`Transaction ID: ${record.trxId || '-'}`} position="top">
          <span>{record.trxId || '-'}</span>
        </Tooltip>
      </td>
      <td className="paylabs-history-td text-right" style={{ width: 36 }}>
        <Tooltip content="Lihat Rincian Transaksi" position="left">
          <button
            type="button"
            className="paylabs-row-arrow-btn"
            aria-label="Lihat Detail"
          >
            <ChevronRight size={14} />
          </button>
        </Tooltip>
      </td>
    </tr>
  );
};

/**
 * Komponen View Utama Riwayat VA macOS
 */
export const VaHistoryView: React.FC<VaHistoryViewProps> = ({
  onShowToast,
  selectedRecordFromPalette,
  onClearSelectedRecordFromPalette,
}) => {
  const { history, isLoadingHistory, handleClearHistory, refreshHistory } = usePaylabs();
  const [searchTerm, setSearchTerm] = useState('');
  const [envFilter, setEnvFilter] = useState<'ALL' | 'SIT' | 'PROD'>('ALL');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [copiedPhoneId, setCopiedPhoneId] = useState<string | null>(null);
  const [isConfirmClearOpen, setIsConfirmClearOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<HistoryRecord | null>(null);
  const tableWrapperRef = useRef<HTMLDivElement>(null);

  /**
   * Meneruskan event mouse wheel dari canvas luar (stat card / toolbar) langsung ke wrapper tabel.
   * Memastikan pengguna tetap bisa menggulir tabel riwayat ketika mouse berada di area luar tabel.
   */
  const handleCanvasWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    if (!tableWrapperRef.current) return;
    if (tableWrapperRef.current.contains(e.target as Node)) return;
    tableWrapperRef.current.scrollBy({ top: e.deltaY });
  };

  useEffect(() => {
    if (selectedRecordFromPalette) {
      setSelectedRecord(selectedRecordFromPalette);
      onClearSelectedRecordFromPalette?.();
    }
  }, [selectedRecordFromPalette, onClearSelectedRecordFromPalette]);

  const filteredRecords = useMemo(
    () => filterHistoryRecords(history, searchTerm, envFilter),
    [history, searchTerm, envFilter]
  );

  const totalNominal = useMemo(() => {
    return filteredRecords.reduce((acc, curr) => {
      const val = parseFloat(curr.amount) || 0;
      return acc + val;
    }, 0);
  }, [filteredRecords]);

  const handleCopyVa = (e: React.MouseEvent, id: string, vaNo: string) => {
    e.stopPropagation();
    navigator.clipboard.writeText(vaNo);
    setCopiedId(id);
    onShowToast('Tersalin!', `Nomor VA ${vaNo} berhasil disalin`, 'info');
    setTimeout(() => setCopiedId(null), 1500);
  };

  const handleCopyPhone = (e: React.MouseEvent, id: string, phone: string) => {
    e.stopPropagation();
    navigator.clipboard.writeText(phone);
    setCopiedPhoneId(id);
    onShowToast('Tersalin!', `Nomor HP ${phone} berhasil disalin`, 'info');
    setTimeout(() => setCopiedPhoneId(null), 1500);
  };

  const handleConfirmClear = async () => {
    try {
      await handleClearHistory();
      setIsConfirmClearOpen(false);
      onShowToast('Berhasil', 'Seluruh riwayat transaksi telah dihapus', 'success');
    } catch (err: any) {
      onShowToast('Gagal Menghapus', err?.message || 'Terjadi kesalahan sistem', 'error');
    }
  };

  return (
    <div
      className="paylabs-page-container va-history-fixed-container"
      onWheel={handleCanvasWheel}
    >
      {/* Aksesibilitas Semantic Heading */}
      <h2 className="sr-only">Riwayat Virtual Account</h2>

      {/* Bar Statistik Ringkas macOS */}
      <div id="va-history-stats" className="paylabs-stats-grid">
        <div className="paylabs-stat-card">
          <div className="paylabs-stat-icon-wrap" style={{ background: 'rgba(99, 102, 241, 0.12)', color: 'var(--accent-primary)' }}>
            <Receipt size={18} />
          </div>
          <div className="paylabs-stat-content">
            <span className="paylabs-stat-label">Total Transaksi</span>
            <div className="paylabs-stat-value">{filteredRecords.length}</div>
          </div>
        </div>

        <div className="paylabs-stat-card">
          <div className="paylabs-stat-icon-wrap" style={{ background: 'rgba(99, 102, 241, 0.12)', color: 'var(--accent-primary)' }}>
            <CreditCard size={18} />
          </div>
          <div className="paylabs-stat-content">
            <span className="paylabs-stat-label">Total Nominal</span>
            <div className="paylabs-stat-value font-mono">
              {formatRupiah(totalNominal.toString())}
            </div>
          </div>
        </div>

        <div className="paylabs-stat-card">
          <div className="paylabs-stat-icon-wrap" style={{ background: 'rgba(34, 197, 94, 0.12)', color: '#22c55e' }}>
            <CheckCircle2 size={18} />
          </div>
          <div className="paylabs-stat-content">
            <span className="paylabs-stat-label">Penyimpanan</span>
            <div className="paylabs-stat-value" style={{ fontSize: 13, color: '#22c55e', fontWeight: 600 }}>
              Disk Lokal (%APPDATA%)
            </div>
          </div>
        </div>
      </div>

      {/* Filter & Actions Toolbar */}
      <div id="va-history-toolbar" className="paylabs-toolbar">
        <div className="paylabs-toolbar-main">
          <div className="paylabs-search-box">
            <Search size={15} className="paylabs-search-icon" />
            <input
              type="text"
              className="paylabs-search-input"
              placeholder="Cari nama, nomor VA, Trx ID, atau bank..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="paylabs-filter-segmented">
            <button
              type="button"
              className={`paylabs-filter-btn ${envFilter === 'ALL' ? 'active' : ''}`}
              onClick={() => setEnvFilter('ALL')}
            >
              Semua ({history.length})
            </button>
            <button
              type="button"
              className={`paylabs-filter-btn ${envFilter === 'SIT' ? 'active' : ''}`}
              onClick={() => setEnvFilter('SIT')}
            >
              SIT
            </button>
            <button
              type="button"
              className={`paylabs-filter-btn ${envFilter === 'PROD' ? 'active' : ''}`}
              onClick={() => setEnvFilter('PROD')}
            >
              PROD
            </button>
          </div>
        </div>

        <div className="paylabs-history-actions">
          <Tooltip content="Segarkan Data Riwayat" position="bottom">
            <button
              type="button"
              className="paylabs-action-pill-btn"
              onClick={refreshHistory}
              disabled={isLoadingHistory}
              aria-label="Segarkan Data"
            >
              <RefreshCw size={13} className={isLoadingHistory ? 'animate-spin' : ''} />
              <span>Segarkan</span>
            </button>
          </Tooltip>

          <Tooltip content="Hapus Semua Riwayat Transaksi" position="bottom">
            <button
              type="button"
              className="paylabs-action-pill-btn danger"
              onClick={() => setIsConfirmClearOpen(true)}
              disabled={history.length === 0}
              aria-label="Hapus Riwayat"
            >
              <Trash2 size={13} />
              <span>Hapus Riwayat</span>
            </button>
          </Tooltip>
        </div>
      </div>

      {/* Grouped Inset Table macOS */}
      <div id="va-history-table" className="paylabs-table-card">
        {filteredRecords.length > 0 ? (
          <div className="paylabs-table-wrapper" ref={tableWrapperRef}>
            <table className="paylabs-history-table" style={{ width: '100%', minWidth: 760 }}>
              <thead>
                <tr>
                  <th style={{ width: 56 }}>Env</th>
                  <th style={{ width: 110 }}>Tanggal</th>
                  <th style={{ width: 80 }}>Bank</th>
                  <th style={{ width: 140 }}>Nomor VA</th>
                  <th style={{ width: 130 }}>Payer Number</th>
                  <th>Nama Pelanggan</th>
                  <th style={{ width: 110 }}>Nominal</th>
                  <th style={{ width: 90 }}>Trx ID</th>
                  <th style={{ width: 36 }}></th>
                </tr>
              </thead>
              <tbody>
                {filteredRecords.map((rec) => (
                  <HistoryRow
                    key={rec.id}
                    record={rec}
                    copiedId={copiedId}
                    copiedPhoneId={copiedPhoneId}
                    onCopyVa={handleCopyVa}
                    onCopyPhone={handleCopyPhone}
                    onSelectRow={setSelectedRecord}
                  />
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="paylabs-empty-history">
            <History size={40} className="text-subtle opacity-40 mb-3" />
            <p className="font-semibold text-base mb-1">Tidak ada riwayat transaksi</p>
            <p className="text-subtle text-xs max-w-sm text-center">
              {searchTerm
                ? 'Tidak ditemukan transaksi yang cocok dengan kata kunci pencarian.'
                : 'Belum ada Virtual Account yang digenerate.'}
            </p>
          </div>
        )}
      </div>

      {/* Modal Konfirmasi Hapus Riwayat */}
      <Modal
        isOpen={isConfirmClearOpen}
        onClose={() => setIsConfirmClearOpen(false)}
        title="Hapus Semua Riwayat?"
        variant="alert"
        icon={<AlertTriangle size={20} className="text-danger" />}
        confirmText="Ya, Hapus Semua"
        cancelText="Batal"
        onConfirm={handleConfirmClear}
        maxWidth={440}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <p className="text-sm leading-relaxed" style={{ color: 'var(--text-primary)' }}>
            Apakah Anda yakin ingin menghapus seluruh data riwayat Virtual Account?
          </p>
          <div
            style={{
              padding: '10px 14px',
              borderRadius: 8,
              background: 'rgba(239, 68, 68, 0.08)',
              border: '1px solid rgba(239, 68, 68, 0.25)',
              color: '#ef4444',
              fontSize: 12,
              lineHeight: 1.45,
            }}
          >
            ⚠️ Seluruh data transaksi di berkas lokal (%APPDATA%\PaylabsVA) akan dibersihkan secara permanen. Tindakan ini <strong>tidak dapat dibatalkan</strong>.
          </div>
        </div>
      </Modal>

      {/* Slide-out Drawer Detail Transaksi (Apple HIG) */}
      <VaHistoryDetailDrawer
        isOpen={!!selectedRecord}
        onClose={() => setSelectedRecord(null)}
        record={selectedRecord}
        onShowToast={onShowToast}
      />
    </div>
  );
};
