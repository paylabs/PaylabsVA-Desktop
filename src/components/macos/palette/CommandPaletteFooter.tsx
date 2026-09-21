/**
 * @file CommandPaletteFooter.tsx
 * @description Baris footer petunjuk tombol navigasi keyboard (Panah, Enter, Esc) pada Command Palette.
 */

import React from 'react';

/**
 * Footer petunjuk navigasi keyboard
 */
export const CommandPaletteFooter: React.FC = () => (
  <div className="macos-command-footer">
    <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
        <span className="macos-kbd">↑↓</span>
        <span>Navigasi</span>
      </span>
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
        <span className="macos-kbd">↵</span>
        <span>Pilih</span>
      </span>
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
        <span className="macos-kbd">ESC</span>
        <span>Tutup</span>
      </span>
    </div>
    <span style={{ fontSize: 11, fontWeight: 500, opacity: 0.75 }}>Spotlight Search</span>
  </div>
);
