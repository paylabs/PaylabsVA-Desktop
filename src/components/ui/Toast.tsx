/**
 * @file Toast.tsx
 * @description Komponen Toast Notification bergaya macOS Notification Banner (translucency, squircle icon, top-right).
 */

import React from 'react';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';

export type ToastType = 'success' | 'info' | 'warning' | 'error';

export interface ToastItem {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
}

interface ToastProps {
  toasts: ToastItem[];
  onDismiss: (id: string) => void;
}

const TOAST_ICONS: Record<ToastType, React.ReactNode> = {
  success: <CheckCircle2 size={16} />,
  info: <Info size={16} />,
  warning: <AlertTriangle size={16} />,
  error: <AlertCircle size={16} />,
};

interface ToastBannerItemProps {
  toast: ToastItem;
  onDismiss: (id: string) => void;
}

/**
 * Item banner notifikasi individu bergaya Apple macOS
 */
const ToastBannerItem: React.FC<ToastBannerItemProps> = ({ toast, onDismiss }) => {
  return (
    <div className="macos-toast-banner" role="status">
      <div className={`macos-toast-icon-box is-${toast.type}`}>
        {TOAST_ICONS[toast.type]}
      </div>
      <div className="macos-toast-body">
        <div className="macos-toast-header-row">
          <span className="macos-toast-app-label">Paylabs SNAP</span>
          <span className="macos-toast-time-label">sekarang</span>
        </div>
        <div className="macos-toast-title">{toast.title}</div>
        {toast.message && (
          <div className="macos-toast-message">{toast.message}</div>
        )}
      </div>
      <button
        type="button"
        className="macos-toast-close-btn"
        onClick={() => onDismiss(toast.id)}
        aria-label="Tutup notifikasi"
      >
        <X size={12} />
      </button>
    </div>
  );
};

/**
 * Kontainer Toast mengambang di kanan atas desktop khas macOS
 */
export const ToastContainer: React.FC<ToastProps> = ({ toasts, onDismiss }) => {
  if (toasts.length === 0) return null;

  return (
    <div className="macos-toast-container" aria-live="polite">
      {toasts.map((toast) => (
        <ToastBannerItem
          key={toast.id}
          toast={toast}
          onDismiss={onDismiss}
        />
      ))}
    </div>
  );
};

