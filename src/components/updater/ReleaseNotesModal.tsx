/**
 * @file ReleaseNotesModal.tsx
 * @description Dialog modal catatan rilis pembaruan aplikasi dengan format Markdown terstruktur (Apple HIG).
 */

import React from 'react';
import { ArrowDownCircle, Sparkles, Calendar, Tag } from 'lucide-react';
import { Modal } from '../ui/Modal';
import { MarkdownRenderer } from './MarkdownRenderer';
import { UpdateInfo } from '../../hooks/useAppUpdater';

export interface ReleaseNotesModalProps {
  isOpen: boolean;
  onClose: () => void;
  updateInfo: UpdateInfo | null;
  onStartDownload: () => void;
}

/**
 * Format tanggal rilis ISO menjadi tampilan lokal ramah pengguna
 */
function formatReleaseDate(rawDate?: string): string {
  if (!rawDate) return '';
  try {
    const d = new Date(rawDate);
    if (isNaN(d.getTime())) return rawDate;
    return d.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  } catch {
    return rawDate;
  }
}

/**
 * Komponen Modal Catatan Rilis Pembaruan
 */
export const ReleaseNotesModal: React.FC<ReleaseNotesModalProps> = ({
  isOpen,
  onClose,
  updateInfo,
  onStartDownload,
}) => {
  const version = updateInfo?.version || '0.0.0';
  const releaseDate = formatReleaseDate(updateInfo?.date);

  const handleDownloadAndClose = () => {
    onClose();
    onStartDownload();
  };

  const footerActions = (
    <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', width: '100%' }}>
      <button
        type="button"
        className="desktop-modal-btn desktop-modal-btn-cancel"
        onClick={onClose}
      >
        Nanti Saja
      </button>
      <button
        type="button"
        className="desktop-modal-btn desktop-modal-btn-confirm"
        onClick={handleDownloadAndClose}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 6,
          backgroundColor: 'var(--accent-primary)',
          color: '#ffffff',
        }}
      >
        <ArrowDownCircle size={14} />
        <span>Unduh &amp; Pasang Sekarang</span>
      </button>
    </div>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Catatan Rilis Pembaruan"
      maxWidth={580}
      icon={<Sparkles size={18} style={{ color: 'var(--accent-primary)' }} />}
      footerActions={footerActions}
    >
      <div className="release-notes-modal-content">
        {/* Info Strip: Versi & Tanggal */}
        <div className="release-notes-badge-row">
          <span className="release-notes-badge version-badge">
            <Tag size={12} style={{ marginRight: 4 }} />
            Versi {version}
          </span>
          {releaseDate && (
            <span className="release-notes-badge date-badge">
              <Calendar size={12} style={{ marginRight: 4 }} />
              {releaseDate}
            </span>
          )}
          <span className="release-notes-badge status-badge">Rilis Resmi</span>
        </div>

        {/* Scrollable Markdown Body */}
        <div className="release-notes-scroll-area">
          <MarkdownRenderer content={updateInfo?.notes || ''} />
        </div>
      </div>
    </Modal>
  );
};
