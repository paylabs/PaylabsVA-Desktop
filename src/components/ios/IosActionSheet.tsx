/**
 * @file IosActionSheet.tsx
 * @description Komponen modal Action Sheet native Apple iOS (meluncur dari bawah dengan tombol cancel dan aksi destruktif).
 */

import React, { useEffect, useState } from 'react';

export interface ActionSheetAction {
  id: string;
  label: string;
  isDestructive?: boolean;
  onClick: () => void;
}

export interface IosActionSheetProps {
  isOpen: boolean;
  title?: string;
  message?: string;
  actions: readonly ActionSheetAction[];
  cancelLabel?: string;
  onClose: () => void;
}

/**
 * Komponen Action Sheet bergaya Apple HIG iOS dengan animasi slide-up dan transisi dismiss halus
 */
export const IosActionSheet: React.FC<IosActionSheetProps> = ({
  isOpen,
  title,
  message,
  actions,
  cancelLabel = 'Cancel',
  onClose,
}) => {
  const [shouldRender, setShouldRender] = useState(isOpen);
  const [isClosing, setIsClosing] = useState(false);

  // Mengelola animasi exit sebelum unmount dari DOM
  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
      setIsClosing(false);
    } else if (shouldRender) {
      setIsClosing(true);
      const timer = setTimeout(() => {
        setShouldRender(false);
        setIsClosing(false);
      }, 220);
      return () => clearTimeout(timer);
    }
  }, [isOpen, shouldRender]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!shouldRender) {
    return null;
  }

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const backdropClasses = [
    'ios-action-sheet-backdrop',
    isClosing ? 'is-closing' : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div
      className={backdropClasses}
      onClick={handleBackdropClick}
      data-testid="ios-action-sheet-backdrop"
      role="dialog"
      aria-modal="true"
      aria-label={title || 'Action Sheet'}
    >
      <div className="ios-action-sheet-container">
        <div className="ios-action-sheet-card">
          {(title || message) && (
            <div style={{ padding: '14px 16px', textAlign: 'center', borderBottom: '1px solid var(--border-subtle)' }}>
              {title && (
                <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)' }}>
                  {title}
                </div>
              )}
              {message && (
                <div style={{ fontSize: 12, color: 'var(--text-tertiary)', marginTop: 4 }}>
                  {message}
                </div>
              )}
            </div>
          )}

          {actions.map((action) => (
            <button
              key={action.id}
              type="button"
              className={`ios-action-sheet-item ${action.isDestructive ? 'destructive' : ''}`}
              onClick={() => {
                action.onClick();
                onClose();
              }}
            >
              {action.label}
            </button>
          ))}
        </div>

        <button
          type="button"
          className="ios-action-sheet-cancel"
          onClick={onClose}
        >
          {cancelLabel}
        </button>
      </div>
    </div>
  );
};

