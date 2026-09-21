/**
 * @file WinWindowControls.tsx
 * @description Komponen kontrol window bergaya Windows Fluent UI (Minimize, Maximize/Restore, Close).
 */

import React from 'react';

interface WinWindowControlsProps {
  isMaximized: boolean;
  onClose: () => void;
  onMinimize: () => void;
  onToggleMaximize: () => void;
}

/**
 * Komponen tombol kontrol window Windows di sudut kanan atas
 */
export const WinWindowControls: React.FC<WinWindowControlsProps> = ({
  isMaximized,
  onClose,
  onMinimize,
  onToggleMaximize,
}) => {
  return (
    <div className="win-controls-container no-drag">
      <button
        type="button"
        className="win-control-btn minimize"
        onClick={onMinimize}
        aria-label="Minimalkan"
        title="Minimalkan"
      >
        <svg width="10" height="1" viewBox="0 0 10 1" fill="currentColor">
          <rect width="10" height="1" />
        </svg>
      </button>

      <button
        type="button"
        className="win-control-btn maximize"
        onClick={onToggleMaximize}
        aria-label={isMaximized ? 'Kembalikan Ukuran' : 'Maksimalkan'}
        title={isMaximized ? 'Kembalikan Ukuran' : 'Maksimalkan'}
      >
        {isMaximized ? (
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor">
            <path d="M2.5 1.5H8.5V7.5" strokeWidth="1" />
            <rect x="1.5" y="2.5" width="6" height="6" strokeWidth="1" />
          </svg>
        ) : (
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor">
            <rect x="1.5" y="1.5" width="7" height="7" strokeWidth="1" />
          </svg>
        )}
      </button>

      <button
        type="button"
        className="win-control-btn close"
        onClick={onClose}
        aria-label="Tutup"
        title="Tutup (Alt+F4)"
      >
        <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor">
          <path d="M1 1L9 9M9 1L1 9" strokeWidth="1.1" strokeLinecap="round" />
        </svg>
      </button>
    </div>
  );
};
