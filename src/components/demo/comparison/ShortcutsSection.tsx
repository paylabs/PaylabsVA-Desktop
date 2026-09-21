/**
 * @file ShortcutsSection.tsx
 * @description Tab Shortcuts keyboard untuk menampilkan perbandingan pemetaan tombol Command (macOS) vs Control (Windows).
 */

import React from 'react';
import { DesktopPlatform } from '../../../types/platform';
import { formatShortcut } from '../../../utils/shortcutFormatter';

export interface ShortcutsSectionProps {
  platform: DesktopPlatform;
}

interface ShortcutDef {
  action: string;
  keyCombo: string;
  description: string;
}

const SHORTCUT_LIST: readonly ShortcutDef[] = [
  { action: 'Command Palette', keyCombo: 'Mod+K', description: 'Membuka pencarian Spotlight' },
  { action: 'Switch Theme', keyCombo: 'Mod+Shift+T', description: 'Beralih mode terang/gelap' },
  { action: 'Toggle Preview', keyCombo: 'Mod+P', description: 'Beralih profil platform' },
  { action: 'Tutup Dialog', keyCombo: 'Escape', description: 'Menutup modal atau palette aktif' },
];

/**
 * Tab Keyboard Shortcuts
 */
export const ShortcutsSection: React.FC<ShortcutsSectionProps> = ({ platform }) => (
  <div style={{ background: 'var(--bg-surface-1)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-card)', padding: 20 }}>
    <h2 style={{ fontSize: 15, fontWeight: 600, marginBottom: 16, color: 'var(--text-primary)' }}>
      Keyboard Shortcut Cross-Platform
    </h2>
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      {SHORTCUT_LIST.map((sc) => (
        <div
          key={sc.action}
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '10px 14px',
            background: 'var(--bg-surface-2)',
            borderRadius: 'var(--radius-sm)',
            fontSize: 13,
          }}
        >
          <div>
            <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{sc.action}</div>
            <div style={{ fontSize: 11.5, color: 'var(--text-tertiary)' }}>{sc.description}</div>
          </div>
          <kbd
            style={{
              padding: '3px 8px',
              background: 'var(--bg-surface-1)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-xs)',
              fontSize: 12,
              fontFamily: 'monospace',
              color: 'var(--text-accent)',
            }}
          >
            {formatShortcut(sc.keyCombo, platform)}
          </kbd>
        </div>
      ))}
    </div>
  </div>
);
