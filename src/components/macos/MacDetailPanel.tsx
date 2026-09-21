/**
 * @file MacDetailPanel.tsx
 * @description Slide-out inspector detail panel dari kanan layar dengan Pill Floating Action Bar (Apple HIG).
 */

import React, { useEffect } from 'react';
import { X, Copy, Share2, Code2, Layers, Check } from 'lucide-react';

export interface TokenItem {
  label: string;
  value: string;
}

export interface MacDetailPanelProps {
  isOpen: boolean;
  title: string;
  subtitle?: string;
  description: string;
  codeSnippet?: string;
  tokens?: readonly TokenItem[];
  onClose: () => void;
  onCopySnippet?: (code: string) => void;
  onShare?: () => void;
}

/**
 * Komponen Slide-out Inspector Detail Panel macOS
 */
export const MacDetailPanel: React.FC<MacDetailPanelProps> = ({
  isOpen,
  title,
  subtitle,
  description,
  codeSnippet,
  tokens = [],
  onClose,
  onCopySnippet,
  onShare,
}) => {
  const [hasCopied, setHasCopied] = React.useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleCopy = () => {
    if (codeSnippet) {
      navigator.clipboard?.writeText(codeSnippet);
      onCopySnippet?.(codeSnippet);
      setHasCopied(true);
      setTimeout(() => setHasCopied(false), 2000);
    }
  };

  return (
    <>
      <div
        className="macos-slide-panel-backdrop"
        onClick={onClose}
        data-testid="detail-panel-backdrop"
      />
      <aside
        className="macos-slide-panel"
        role="complementary"
        aria-label={`Detail Inspeksi: ${title}`}
      >
        <PanelHeader title={title} subtitle={subtitle} onClose={onClose} />

        <div className="macos-slide-panel-body">
          <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: 18 }}>
            {description}
          </p>

          {tokens.length > 0 && <TokensList tokens={tokens} />}
          {codeSnippet && <SnippetBlock code={codeSnippet} />}
        </div>

        <FloatingBar
          hasCopied={hasCopied}
          hasSnippet={Boolean(codeSnippet)}
          onCopy={handleCopy}
          onShare={onShare}
          onClose={onClose}
        />
      </aside>
    </>
  );
};

interface HeaderProps {
  title: string;
  subtitle?: string;
  onClose: () => void;
}

const PanelHeader: React.FC<HeaderProps> = ({ title, subtitle, onClose }) => (
  <div className="macos-slide-panel-header">
    <div>
      <h3 style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)' }}>{title}</h3>
      {subtitle && <span style={{ fontSize: 12, color: 'var(--text-tertiary)' }}>{subtitle}</span>}
    </div>
    <button
      type="button"
      onClick={onClose}
      style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-tertiary)' }}
      aria-label="Tutup panel detail"
    >
      <X size={18} />
    </button>
  </div>
);

const TokensList: React.FC<{ tokens: readonly TokenItem[] }> = ({ tokens }) => (
  <div style={{ marginBottom: 18 }}>
    <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-tertiary)', textTransform: 'uppercase', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
      <Layers size={13} />
      <span>Design Tokens</span>
    </div>
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      {tokens.map((tok) => (
        <div key={tok.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 10px', background: 'var(--bg-surface-2)', borderRadius: 6, fontSize: 12 }}>
          <span style={{ color: 'var(--text-secondary)' }}>{tok.label}</span>
          <code style={{ color: 'var(--accent-primary)', fontWeight: 600 }}>{tok.value}</code>
        </div>
      ))}
    </div>
  </div>
);

const SnippetBlock: React.FC<{ code: string }> = ({ code }) => (
  <div>
    <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-tertiary)', textTransform: 'uppercase', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
      <Code2 size={13} />
      <span>Code Snippet</span>
    </div>
    <pre style={{ padding: 12, borderRadius: 8, background: 'var(--bg-surface-2)', fontSize: 11.5, overflowX: 'auto', border: '1px solid var(--border-subtle)', color: 'var(--text-primary)' }}>
      <code>{code}</code>
    </pre>
  </div>
);

interface BarProps {
  hasCopied: boolean;
  hasSnippet: boolean;
  onCopy: () => void;
  onShare?: () => void;
  onClose: () => void;
}

const FloatingBar: React.FC<BarProps> = ({ hasCopied, hasSnippet, onCopy, onShare, onClose }) => (
  <div className="macos-floating-action-bar">
    {hasSnippet && (
      <button type="button" className="macos-floating-action-btn primary" onClick={onCopy}>
        {hasCopied ? <Check size={14} /> : <Copy size={14} />}
        <span>{hasCopied ? 'Tersalin' : 'Salin Kode'}</span>
      </button>
    )}
    {onShare && (
      <button type="button" className="macos-floating-action-btn" onClick={onShare}>
        <Share2 size={14} />
        <span>Bagikan</span>
      </button>
    )}
    <button type="button" className="macos-floating-action-btn" onClick={onClose}>
      <X size={14} />
      <span>Tutup</span>
    </button>
  </div>
);
