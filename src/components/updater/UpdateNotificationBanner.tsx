/**
 * @file UpdateNotificationBanner.tsx
 * @description Komponen notifikasi banner pembaruan otomatis mengadopsi standar Apple HIG
 * (top-right notification banner, translucency blur 24px, squircle icon, progress bar halus).
 */

import React from 'react';
import { ArrowDownCircle, RefreshCw, X, CheckCircle2, AlertCircle } from 'lucide-react';
import { UpdateStatus, UpdateInfo } from '../../hooks/useAppUpdater';

export interface UpdateNotificationBannerProps {
  status: UpdateStatus;
  updateInfo: UpdateInfo | null;
  progress: number;
  errorMessage: string | null;
  isVisible: boolean;
  onDismiss: () => void;
  onStartDownload: () => void;
  onRelaunch: () => void;
}

/**
 * Komponen Banner Pembaruan Otomatis
 */
export const UpdateNotificationBanner: React.FC<UpdateNotificationBannerProps> = ({
  status,
  updateInfo,
  progress,
  errorMessage,
  isVisible,
  onDismiss,
  onStartDownload,
  onRelaunch,
}) => {
  if (!isVisible || status === 'idle' || status === 'up-to-date') {
    return null;
  }

  return (
    <aside
      className="macos-toast-container"
      style={{ zIndex: 9999, top: 42 }}
      aria-label="Pembaruan Aplikasi"
    >
      <div className="macos-toast-banner is-update-banner" role="status">
        {/* Squircle Icon Box */}
        <div className={`macos-toast-icon-box ${status === 'error' ? 'is-error' : 'is-info'}`}>
          {status === 'ready' ? (
            <CheckCircle2 size={16} />
          ) : status === 'error' ? (
            <AlertCircle size={16} />
          ) : (
            <ArrowDownCircle size={16} />
          )}
        </div>

        {/* Content Body */}
        <div className="macos-toast-body" style={{ flex: 1, minWidth: 200 }}>
          <div className="macos-toast-header-row">
            <span className="macos-toast-app-label">Paylabs VA Updater</span>
            <span className="macos-toast-time-label">
              {status === 'ready'
                ? 'Siap Pasang'
                : status === 'downloading'
                  ? `${progress}%`
                  : 'Rilis Baru'}
            </span>
          </div>

          <div className="macos-toast-title">
            {status === 'available'
              ? `Versi ${updateInfo?.version || 'Baru'} Tersedia`
              : status === 'downloading'
                ? `Mengunduh Pembaruan...`
                : status === 'ready'
                  ? `Pembaruan Telah Siap`
                  : 'Gagal Memperbarui'}
          </div>

          <div className="macos-toast-message">
            {status === 'available' && (updateInfo?.notes || 'Peningkatan stabilitas dan perbaikan bug.')}
            {status === 'downloading' && 'Mohon tunggu sementara paket installer diunduh...'}
            {status === 'ready' && 'Mulai ulang aplikasi sekarang untuk menerapkan versi baru.'}
            {status === 'error' && (errorMessage || 'Terjadi kesalahan saat memeriksa rilis.')}
          </div>

          {/* Progress Bar */}
          {status === 'downloading' && (
            <div
              style={{
                width: '100%',
                height: 4,
                background: 'rgba(255, 255, 255, 0.15)',
                borderRadius: 2,
                marginTop: 6,
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  width: `${progress}%`,
                  height: '100%',
                  background: 'var(--primary, #059669)',
                  transition: 'width 0.2s ease',
                }}
              />
            </div>
          )}

          {/* Action Buttons */}
          <div style={{ display: 'flex', gap: 6, marginTop: 8 }}>
            {status === 'available' && (
              <button
                type="button"
                className="btn btn-primary"
                style={{ height: 26, fontSize: 11, padding: '0 10px', borderRadius: 6 }}
                onClick={onStartDownload}
              >
                Unduh & Pasang
              </button>
            )}

            {status === 'ready' && (
              <button
                type="button"
                className="btn btn-primary"
                style={{ height: 26, fontSize: 11, padding: '0 10px', borderRadius: 6 }}
                onClick={onRelaunch}
              >
                <RefreshCw size={11} style={{ marginRight: 4 }} />
                Mulai Ulang Sekarang
              </button>
            )}
          </div>
        </div>

        {/* Close Button */}
        <button
          type="button"
          className="macos-toast-close-btn"
          onClick={onDismiss}
          aria-label="Tutup banner pembaruan"
        >
          <X size={12} />
        </button>
      </div>
    </aside>
  );
};
