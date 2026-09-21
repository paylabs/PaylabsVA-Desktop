/**
 * @file OverlaysShowcaseSection.tsx
 * @description Bagian pemicu interaksi dialog modal, inspector slide-panel, dan iOS action sheet.
 */

import React from 'react';
import { MessageSquare, Eye, Smartphone, Code2 } from 'lucide-react';
import { DetailItemSpec } from './ButtonShowcaseSection';

export interface OverlaysShowcaseSectionProps {
  onOpenModal: () => void;
  onOpenActionSheet: () => void;
  onShowToast: (title: string, message?: string, type?: 'info' | 'success' | 'warning' | 'error') => void;
  onInspectTokens: (item: DetailItemSpec) => void;
}

/**
 * Section pemicu modal dialog & toasts
 */
export const OverlaysShowcaseSection: React.FC<OverlaysShowcaseSectionProps> = ({
  onOpenModal,
  onOpenActionSheet,
  onShowToast,
  onInspectTokens,
}) => (
  <div className="comparison-container">
    <h2 style={{ fontSize: 14, fontWeight: 700, marginBottom: 14, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: 8 }}>
      <MessageSquare size={16} color="var(--accent-primary)" />
      <span>Overlays, Dialogs &amp; Toasts</span>
    </h2>
    <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
      <button
        type="button"
        style={{
          padding: '8px 16px',
          background: 'var(--bg-surface-2)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-button)',
          color: 'var(--text-primary)',
          fontWeight: 600,
          fontSize: 13,
          cursor: 'pointer',
          display: 'inline-flex',
          alignItems: 'center',
          gap: 8,
        }}
        onClick={onOpenModal}
      >
        <Eye size={15} />
        <span>Buka Contoh Dialog Modal</span>
      </button>

      <button
        type="button"
        style={{
          padding: '8px 16px',
          background: 'var(--bg-surface-2)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-button)',
          color: 'var(--text-primary)',
          fontWeight: 600,
          fontSize: 13,
          cursor: 'pointer',
          display: 'inline-flex',
          alignItems: 'center',
          gap: 8,
        }}
        onClick={onOpenActionSheet}
      >
        <Smartphone size={15} color="#34c759" />
        <span>Picu iOS Action Sheet</span>
      </button>

      <button
        type="button"
        style={{
          padding: '8px 16px',
          background: 'var(--bg-surface-2)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-button)',
          color: 'var(--text-primary)',
          fontWeight: 600,
          fontSize: 13,
          cursor: 'pointer',
        }}
        onClick={() => onShowToast('Toast Info', 'Pemberitahuan feedback desktop cepat', 'info')}
      >
        Picu Toast Info
      </button>

      <button
        type="button"
        style={{
          padding: '8px 16px',
          background: 'var(--bg-surface-2)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-button)',
          color: 'var(--text-primary)',
          fontWeight: 600,
          fontSize: 13,
          cursor: 'pointer',
          display: 'inline-flex',
          alignItems: 'center',
          gap: 6,
        }}
        onClick={() => {
          onInspectTokens({
            title: 'Design System Inspector',
            subtitle: 'Slide Panel macOS HIG',
            description: 'Panel slide-out native Apple HIG menampilkan spesifikasi lengkap token CSS dan metadata komponen terpilih secara real-time.',
            codeSnippet: `// Contoh konfigurasi inspect panel:\n<MacDetailPanel\n  isOpen={true}\n  title="Design Spec"\n  onClose={() => setOpen(false)}\n/>`,
            tokens: [
              { label: 'Animation Curve', value: 'cubic-bezier(0.16, 1, 0.3, 1)' },
              { label: 'Backdrop Filter', value: 'saturate(190%) blur(24px)' },
              { label: 'Safe Drag Zone', value: '-webkit-app-region: no-drag' },
            ],
          });
        }}
      >
        <Code2 size={14} color="var(--accent-secondary)" />
        <span>Buka Slide Inspector Panel</span>
      </button>
    </div>
  </div>
);
