/**
 * @file VaExchangeDetailModal.tsx
 * @description Dialog inspeksi jejak panggilan SNAP API (StringToSign, Header, Payload, dan Raw Response).
 */

import React from 'react';
import { Copy, Check } from 'lucide-react';

import { Exchange } from '../../types/paylabs';
import { Modal } from '../ui/Modal';

export interface VaExchangeDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  exchange: Exchange | null;
}

/**
 * Modal viewer debug payload SNAP API
 */
export const VaExchangeDetailModal: React.FC<VaExchangeDetailModalProps> = ({
  isOpen,
  onClose,
  exchange,
}) => {
  const [copiedSection, setCopiedSection] = React.useState<string | null>(null);

  if (!isOpen || !exchange) return null;

  const handleCopy = (key: string, content: string) => {
    navigator.clipboard.writeText(content);
    setCopiedSection(key);
    setTimeout(() => setCopiedSection(null), 1500);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Detail SNAP API Exchange (Audit Log)"
      footerActions={
        <button type="button" className="desktop-modal-btn desktop-modal-btn-cancel" onClick={onClose}>
          Tutup Inspector
        </button>
      }
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14, maxHeight: '60vh', overflowY: 'auto', overscrollBehavior: 'none' }}>
        {/* URL & Method */}
        <div>
          <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-tertiary)', marginBottom: 4 }}>
            ENDPOINT REQUEST
          </div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <span style={{ padding: '2px 6px', background: 'var(--accent-primary)', color: '#fff', borderRadius: 4, fontSize: 11, fontWeight: 700 }}>
              {exchange.method}
            </span>
            <code style={{ fontSize: 12, color: 'var(--text-primary)' }}>{exchange.url}</code>
          </div>
        </div>

        {/* String To Sign */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-tertiary)' }}>SNAP STRING TO SIGN</span>
            <button
              type="button"
              className="paylabs-copy-btn"
              onClick={() => handleCopy('sts', exchange.stringToSign)}
            >
              {copiedSection === 'sts' ? <Check size={11} color="#22c55e" /> : <Copy size={11} />}
              <span>{copiedSection === 'sts' ? 'Tersalin' : 'Salin'}</span>
            </button>
          </div>
          <pre className="paylabs-exchange-code">{exchange.stringToSign}</pre>
        </div>

        {/* Request Headers */}
        <div>
          <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-tertiary)', marginBottom: 4 }}>
            REQUEST HEADERS
          </div>
          <pre className="paylabs-exchange-code">{JSON.stringify(exchange.headers, null, 2)}</pre>
        </div>

        {/* Request Body */}
        <div>
          <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-tertiary)', marginBottom: 4 }}>
            REQUEST BODY (JSON)
          </div>
          <pre className="paylabs-exchange-code">{formatJsonPretty(exchange.requestBody)}</pre>
        </div>

        {/* Response */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-tertiary)' }}>
              PAYLABS RESPONSE (HTTP {exchange.statusCode})
            </span>
          </div>
          <pre className="paylabs-exchange-code">{formatJsonPretty(exchange.rawResponse)}</pre>
        </div>
      </div>
    </Modal>
  );
};

function formatJsonPretty(raw: string): string {
  try {
    return JSON.stringify(JSON.parse(raw), null, 2);
  } catch {
    return raw;
  }
}
