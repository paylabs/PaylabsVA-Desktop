/**
 * @file Modal.tsx
 * @description Komponen Dialog Modal desktop aksesibel dengan adaptasi gaya visual lintas platform (macOS Apple HIG, iOS UIAlertController, Windows Fluent 2).
 */

import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  footerActions?: React.ReactNode;
  confirmText?: string;
  cancelText?: string;
  onConfirm?: () => void;
  icon?: React.ReactNode;
  variant?: 'default' | 'alert';
  maxWidth?: number | string;
}


/**
 * Render tombol aksi bawaan modal jika footerActions custom tidak disediakan
 */
function renderDefaultFooter(
  onClose: () => void,
  cancelText?: string,
  confirmText?: string,
  onConfirm?: () => void
): React.ReactNode {
  return (
    <>
      <button
        type="button"
        className="desktop-modal-btn desktop-modal-btn-cancel"
        onClick={onClose}
      >
        {cancelText || 'Batal'}
      </button>
      {onConfirm && (
        <button
          type="button"
          className="desktop-modal-btn desktop-modal-btn-confirm"
          onClick={onConfirm}
        >
          {confirmText || 'Konfirmasi'}
        </button>
      )}
    </>
  );
}

/**
 * Komponen Dialog Modal Universal bergaya adaptif platform
 */
export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  footerActions,
  confirmText,
  cancelText,
  onConfirm,
  icon,
  variant = 'default',
  maxWidth,
}) => {
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const hasDefaultFooter = Boolean(cancelText || confirmText || onConfirm);
  const footerContent = footerActions || (hasDefaultFooter ? renderDefaultFooter(onClose, cancelText, confirmText, onConfirm) : null);

  const modalContent = (
    <div
      className={`desktop-modal-backdrop modal-variant-${variant}`}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="desktop-modal-card"
        style={maxWidth ? { maxWidth: typeof maxWidth === 'number' ? `${maxWidth}px` : maxWidth } : undefined}
        onClick={(e) => e.stopPropagation()}
      >

        <div className="desktop-modal-header">
          <div className="desktop-modal-title-group">
            {icon && <div className="desktop-modal-icon">{icon}</div>}
            <h3 className="desktop-modal-title">{title}</h3>
          </div>
          <button
            type="button"
            className="desktop-modal-close-btn"
            onClick={onClose}
            aria-label="Tutup dialog"
          >
            <X size={15} />
          </button>
        </div>

        <div className="desktop-modal-body">
          {children}
        </div>

        {footerContent && (
          <div className="desktop-modal-footer">
            {footerContent}
          </div>
        )}
      </div>
    </div>
  );

  const targetContainer = typeof document !== 'undefined'
    ? (document.getElementById('desktop-window-canvas') || document.getElementById('workspace-canvas'))
    : null;
  return targetContainer ? createPortal(modalContent, targetContainer) : modalContent;
};
