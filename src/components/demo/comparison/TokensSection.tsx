/**
 * @file TokensSection.tsx
 * @description Tab Design Tokens untuk demonstrasi styling tokens, typography, dan interactive controls.
 */

import React from 'react';

export interface TokensSectionProps {
  isMac: boolean;
}

/**
 * Tab Design Tokens & Component Preview
 */
export const TokensSection: React.FC<TokensSectionProps> = () => (
  <div style={{ background: 'var(--bg-surface-1)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-card)', padding: 20 }}>
    <h2 style={{ fontSize: 15, fontWeight: 600, marginBottom: 16, color: 'var(--text-primary)' }}>
      Interactive Component Preview (Universal Design)
    </h2>
    <div style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap' }}>
      <button
        type="button"
        style={{
          padding: '8px 16px',
          background: 'var(--accent-primary)',
          color: '#fff',
          border: 'none',
          borderRadius: 'var(--radius-button)',
          fontWeight: 600,
          cursor: 'pointer',
        }}
      >
        Primary Action
      </button>
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
      >
        Secondary Outline
      </button>
      <input
        type="text"
        defaultValue="Input Text Field"
        style={{
          padding: '8px 12px',
          background: 'var(--bg-surface-2)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-sm)',
          color: 'var(--text-primary)',
          fontSize: 13,
        }}
      />
    </div>

    <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
      <p style={{ marginBottom: 8 }}>
        Seluruh komponen di atas berbagi token yang sama untuk <strong>radius ({'var(--radius-card)'})</strong>,
        <strong>transisi ({'var(--transition-fast)'})</strong>, dan <strong>warna permukaan</strong>.
      </p>
      <p>
        Konsistensi ini menjamin tampilan terlihat alami dan terintegrasi di sistem operasi apa pun tanpa perlu menulis ulang CSS dari awal.
      </p>
    </div>
  </div>
);
