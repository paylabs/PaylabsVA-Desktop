/**
 * @file VaHistoryDetailDrawer.tsx
 * @description Slide-out drawer detail transaksi Virtual Account Paylabs dari sisi kanan layar (Apple HIG).
 */

import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { X, Copy, Check } from 'lucide-react';

import { HistoryRecord } from '../../types/paylabs';
import { formatBankName } from '../../utils/bankFormatter';

export interface VaHistoryDetailDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  record: HistoryRecord | null;
  onShowToast: (title: string, message?: string, type?: 'info' | 'success' | 'warning' | 'error') => void;
}

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
 * Format nomor VA dengan spasi per 4 digit
 */
function formatVaDisplay(vaNo: string): string {
  if (!vaNo || vaNo === '-') return '-';
  const clean = vaNo.replace(/\s+/g, '');
  return clean.replace(/(\d{4})(?=\d)/g, '$1 ');
}

/**
 * Slide-out Drawer Detail Transaksi VA
 */
export const VaHistoryDetailDrawer: React.FC<VaHistoryDetailDrawerProps> = ({
  isOpen,
  onClose,
  record,
  onShowToast,
}) => {
  const [copiedVa, setCopiedVa] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !record) return null;

  const handleCopyVa = () => {
    navigator.clipboard.writeText(record.virtualAccountNo);
    setCopiedVa(true);
    onShowToast('Nomor VA Disalin', record.virtualAccountNo, 'info');
    setTimeout(() => setCopiedVa(false), 2000);
  };

  const isProd = record.environment?.toUpperCase() === 'PROD';

  const drawerContent = (
    <div className="paylabs-drawer-backdrop" onClick={onClose}>
      <aside
        className="paylabs-drawer-panel"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="Detail Transaksi Virtual Account"
      >
        {/* Header Drawer */}
        <div className="paylabs-drawer-header">
          <div>
            <h3 className="paylabs-drawer-title">Detail Virtual Account</h3>
            <p className="paylabs-drawer-subtitle font-mono">
              {formatBankName(record.channelName, record.channel)} • {record.virtualAccountNo}
            </p>
          </div>

          <button
            type="button"
            className="macos-close-round-btn"
            onClick={onClose}
            aria-label="Tutup Panel"
          >
            <X size={14} />
          </button>
        </div>

        {/* Status Bar */}
        <div className="paylabs-drawer-status-bar">
          <span className={`paylabs-env-badge ${isProd ? 'prod' : 'sit'}`}>
            {record.environment || 'SIT'}
          </span>
          <span className="text-xs text-subtle font-mono">
            Trx ID: {record.trxId || '-'}
          </span>
        </div>

        {/* Konten Detail */}
        <div className="paylabs-drawer-body">
          {/* Box Nomor VA & Quick Copy */}
          <div className="paylabs-result-number-box">
            <span className="text-xs text-subtle">Nomor Rekening Virtual</span>
            <div className="paylabs-va-big-number font-mono">{formatVaDisplay(record.virtualAccountNo)}</div>
            <button
              type="button"
              className={`paylabs-copy-main-btn ${copiedVa ? 'copied' : ''}`}
              onClick={handleCopyVa}
            >
              {copiedVa ? <Check size={14} /> : <Copy size={14} />}
              <span>{copiedVa ? 'Tersalin ke Clipboard' : 'Salin Nomor VA'}</span>
            </button>
          </div>

          {/* List Metadata Transaksi */}
          <div className="paylabs-kv-card">
            <div className="paylabs-kv-item">
              <span className="paylabs-kv-title">Nama Pelanggan</span>
              <span className="paylabs-kv-data font-medium">{record.name}</span>
            </div>

            {record.virtualAccountPhone && (
              <div className="paylabs-kv-item">
                <span className="paylabs-kv-title">Nomor HP Pembayar</span>
                <span className="paylabs-kv-data font-mono text-xs text-primary">{record.virtualAccountPhone}</span>
              </div>
            )}

            <div className="paylabs-kv-item">
              <span className="paylabs-kv-title">Nominal Pembayaran</span>
              <span className="paylabs-kv-data font-mono font-semibold text-accent">
                {formatRupiah(record.amount)}
              </span>
            </div>

            <div className="paylabs-kv-item">
              <span className="paylabs-kv-title">Channel Mitra Bank</span>
              <span className="paylabs-kv-data">
                <span className="paylabs-bank-badge">
                  {formatBankName(record.channelName, record.channel)}
                </span>
              </span>
            </div>

            <div className="paylabs-kv-item">
              <span className="paylabs-kv-title">Waktu Dibuat</span>
              <span className="paylabs-kv-data font-mono text-xs">{record.createdAt}</span>
            </div>

            <div className="paylabs-kv-item">
              <span className="paylabs-kv-title">Batas Waktu Kadaluarsa</span>
              <span className="paylabs-kv-data font-mono text-xs">{record.expiredDate}</span>
            </div>
          </div>
        </div>
      </aside>
    </div>
  );

  const targetContainer = typeof document !== 'undefined'
    ? (document.getElementById('desktop-window-canvas') || document.getElementById('workspace-canvas'))
    : null;
  return targetContainer ? createPortal(drawerContent, targetContainer) : drawerContent;
};
