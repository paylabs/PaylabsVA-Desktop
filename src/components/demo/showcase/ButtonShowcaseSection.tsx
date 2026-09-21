/**
 * @file ButtonShowcaseSection.tsx
 * @description Bagian demonstrasi ragam varian tombol (Primary, Secondary, Danger, Ghost, Inspector).
 */

import React from 'react';
import { Sparkles, Code2 } from 'lucide-react';
import { Tooltip } from '../../ui/Tooltip';

export interface DetailItemSpec {
  title: string;
  subtitle?: string;
  description: string;
  codeSnippet?: string;
  tokens?: Array<{ label: string; value: string }>;
}

export interface ButtonShowcaseSectionProps {
  onShowToast: (title: string, message?: string, type?: 'info' | 'success' | 'warning' | 'error') => void;
  onInspectTokens: (item: DetailItemSpec) => void;
}

/**
 * Section demonstrasi tombol desktop
 */
export const ButtonShowcaseSection: React.FC<ButtonShowcaseSectionProps> = ({
  onShowToast,
  onInspectTokens,
}) => {
  const handleInspectClick = () => {
    onInspectTokens({
      title: 'Button Component Spec',
      subtitle: 'Apple macOS & Desktop Token Spec',
      description: 'Spesifikasi token desain dinamis untuk tombol desktop yang mengikuti radius, padding, dan aksen warna terpilih secara realtime.',
      codeSnippet: `const PrimaryButton = styled.button\`\n  padding: 8px 16px;\n  border-radius: var(--radius-button);\n  background-color: var(--accent-primary);\n  box-shadow: 0 0 0 0.5px var(--border-subtle);\n\`;`,
      tokens: [
        { label: '--radius-button', value: 'var(--radius-button)' },
        { label: '--accent-primary', value: 'var(--accent-primary)' },
        { label: '--border-subtle', value: '0.5px outline' },
      ],
    });
    onShowToast('Inspector Panel', 'Panel detail meluncur dari kanan (macOS HIG)', 'info');
  };

  return (
    <div className="comparison-container">
      <h2 style={{ fontSize: 14, fontWeight: 700, marginBottom: 14, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: 8 }}>
        <Sparkles size={16} color="var(--accent-primary)" />
        <span>Button Variants &amp; States</span>
      </h2>
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
        <Tooltip content="Mengeksekusi aksi primer tema" position="top">
          <button
            type="button"
            style={{
              padding: '8px 16px',
              background: 'var(--accent-primary)',
              color: '#ffffff',
              border: 'none',
              borderRadius: 'var(--radius-button)',
              fontWeight: 600,
              cursor: 'pointer',
            }}
            onClick={() => onShowToast('Aksi Primer', 'Tombol primer berhasil dieksekusi', 'success')}
          >
            Primary Action
          </button>
        </Tooltip>

        <button
          type="button"
          style={{
            padding: '8px 16px',
            background: 'var(--bg-surface-2)',
            color: 'var(--text-primary)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-button)',
            fontWeight: 500,
            cursor: 'pointer',
          }}
          onClick={() => onShowToast('Aksi Sekunder', 'Tombol sekunder dipilih', 'info')}
        >
          Secondary Outline
        </button>

        <button
          type="button"
          style={{
            padding: '8px 16px',
            background: 'rgba(239, 68, 68, 0.1)',
            color: 'var(--accent-danger)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            borderRadius: 'var(--radius-button)',
            fontWeight: 600,
            cursor: 'pointer',
          }}
          onClick={() => onShowToast('Aksi Berbahaya', 'Operasi pembatalan atau penghapusan', 'error')}
        >
          Destructive Danger
        </button>

        <button
          type="button"
          style={{
            padding: '8px 16px',
            background: 'transparent',
            color: 'var(--text-secondary)',
            border: 'none',
            borderRadius: 'var(--radius-button)',
            fontWeight: 500,
            cursor: 'pointer',
          }}
        >
          Ghost Button
        </button>

        <button
          type="button"
          style={{
            padding: '8px 16px',
            background: 'rgba(99, 102, 241, 0.12)',
            color: 'var(--accent-primary)',
            border: '1px solid rgba(99, 102, 241, 0.3)',
            borderRadius: 'var(--radius-button)',
            fontWeight: 600,
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
          }}
          onClick={handleInspectClick}
        >
          <Code2 size={14} />
          <span>Inspeksi Token (macOS Panel)</span>
        </button>
      </div>
    </div>
  );
};
