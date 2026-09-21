/**
 * @file VaInspectorDrawer.tsx
 * @description Slide-out drawer dari kanan layar bergaya native macOS (Apple HIG) untuk inspeksi jejak SNAP API Exchange.
 */

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Copy, Check, Code2, ShieldAlert } from 'lucide-react';
import { Exchange } from '../../types/paylabs';
import { Tooltip } from '../ui/Tooltip';

export interface VaInspectorDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  exchange: Exchange | null;
}

interface CodeSectionProps {
  title: string;
  code: string;
  sectionKey: string;
  copiedKey: string | null;
  onCopy: (key: string, content: string) => void;
}

const CodeSection: React.FC<CodeSectionProps> = ({
  title,
  code,
  sectionKey,
  copiedKey,
  onCopy,
}) => {
  const isCopied = copiedKey === sectionKey;

  return (
    <div className="paylabs-drawer-section">
      <div className="paylabs-drawer-section-header">
        <span className="paylabs-drawer-section-title">{title}</span>
        <Tooltip content={isCopied ? 'Tersalin ke Clipboard' : 'Salin Kode'} position="left">
          <button
            type="button"
            className="paylabs-drawer-copy-btn"
            onClick={() => onCopy(sectionKey, code)}
            aria-label={`Salin ${title}`}
          >
            {isCopied ? (
              <>
                <Check size={12} className="text-success" />
                <span>Tersalin</span>
              </>
            ) : (
              <>
                <Copy size={12} />
                <span>Salin</span>
              </>
            )}
          </button>
        </Tooltip>
      </div>
      <pre className="paylabs-exchange-code">{code}</pre>
    </div>
  );
};

/**
 * Slide-out Drawer Raw SNAP Inspector macOS
 */
export const VaInspectorDrawer: React.FC<VaInspectorDrawerProps> = ({
  isOpen,
  onClose,
  exchange,
}) => {
  const [copiedSection, setCopiedSection] = useState<string | null>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !exchange) return null;

  const handleCopy = (key: string, content: string) => {
    navigator.clipboard.writeText(content);
    setCopiedSection(key);
    setTimeout(() => setCopiedSection(null), 1500);
  };

  const headersJson = JSON.stringify(exchange.headers, null, 2);
  let formattedBody = exchange.requestBody;
  try {
    formattedBody = JSON.stringify(JSON.parse(exchange.requestBody), null, 2);
  } catch {
    // Biarkan apa adanya jika bukan JSON
  }

  const drawerContent = (
    <div className="paylabs-drawer-backdrop" onClick={onClose}>
      <aside
        className="paylabs-drawer-panel"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="SNAP API Exchange Inspector"
      >
        {/* Header Drawer */}
        <div className="paylabs-drawer-header">
          <div className="flex items-center gap-2">
            <div className="paylabs-drawer-icon-wrap">
              <Code2 size={16} />
            </div>
            <div>
              <h3 className="paylabs-drawer-title">SNAP API Inspector</h3>
              <p className="paylabs-drawer-subtitle font-mono">
                {exchange.method} {exchange.url}
              </p>
            </div>
          </div>

          <button
            type="button"
            className="macos-close-round-btn"
            onClick={onClose}
            aria-label="Tutup Panel"
          >
            <X size={14} />
          </button>
        </div>

        {/* Status Indicator Bar */}
        <div className="paylabs-drawer-status-bar">
          <span className={`paylabs-env-badge ${exchange.success ? 'sit' : 'prod'}`}>
            Status HTTP: {exchange.statusCode || 200}
          </span>
          {exchange.error && (
            <span className="text-danger flex items-center gap-1 text-xs">
              <ShieldAlert size={13} /> {exchange.error}
            </span>
          )}
        </div>

        {/* Konten Scrollable */}
        <div className="paylabs-drawer-body">
          <CodeSection
            title="1. StringToSign (SHA-256 Digest)"
            code={exchange.stringToSign || '-'}
            sectionKey="sign"
            copiedKey={copiedSection}
            onCopy={handleCopy}
          />

          <CodeSection
            title="2. Request Headers (Signature & Credentials)"
            code={headersJson}
            sectionKey="headers"
            copiedKey={copiedSection}
            onCopy={handleCopy}
          />

          <CodeSection
            title="3. Request Payload Body (JSON)"
            code={formattedBody}
            sectionKey="request"
            copiedKey={copiedSection}
            onCopy={handleCopy}
          />

          <CodeSection
            title="4. Raw SNAP Response Body"
            code={exchange.rawResponse || '-'}
            sectionKey="response"
            copiedKey={copiedSection}
            onCopy={handleCopy}
          />
        </div>
      </aside>
    </div>
  );

  const targetContainer = typeof document !== 'undefined'
    ? (document.getElementById('desktop-window-canvas') || document.getElementById('workspace-canvas'))
    : null;
  return targetContainer ? createPortal(drawerContent, targetContainer) : drawerContent;
};
