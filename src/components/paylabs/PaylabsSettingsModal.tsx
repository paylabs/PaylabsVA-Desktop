/**
 * @file PaylabsSettingsModal.tsx
 * @description Dialog Pengaturan Kredensial Paylabs (SIT & Production) bergaya macOS Native Apple HIG dengan validasi fingerprint.
 */

import React, { useState, useEffect } from 'react';
import { Key, ShieldAlert, CheckCircle2, AlertCircle, Save } from 'lucide-react';
import { Settings, SettingsInput } from '../../types/paylabs';
import { getPaylabsSettings, savePaylabsSettings } from '../../services/paylabsService';
import { Modal } from '../ui/Modal';

export interface PaylabsSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaved: () => void;
}

/**
 * Modal konfigurasi kredensial merchant Paylabs bergaya Apple HIG
 */
export const PaylabsSettingsModal: React.FC<PaylabsSettingsModalProps> = ({
  isOpen,
  onClose,
  onSaved,
}) => {
  const [selectedEnv, setSelectedEnv] = useState<'SIT' | 'PROD'>('SIT');
  const [partnerId, setPartnerId] = useState('');
  const [privateKey, setPrivateKey] = useState('');
  const [settingsData, setSettingsData] = useState<Settings | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadSettings();
    } else {
      setPrivateKey('');
      setErrorMessage(null);
    }
  }, [isOpen]);

  const loadSettings = async () => {
    try {
      const data = await getPaylabsSettings();
      setSettingsData(data);
      const env = (data.environment === 'PROD' ? 'PROD' : 'SIT') as 'SIT' | 'PROD';
      setSelectedEnv(env);
      updateFieldsForEnv(data, env);
    } catch (e: any) {
      setErrorMessage(`Gagal memuat pengaturan: ${e?.message || e}`);
    }
  };

  const updateFieldsForEnv = (data: Settings, env: 'SIT' | 'PROD') => {
    const cred = env === 'PROD' ? data.prod : data.sit;
    setPartnerId(cred.partnerId || '');
    setPrivateKey(cred.privateKey || '');
  };

  const handleEnvChange = (env: 'SIT' | 'PROD') => {
    setSelectedEnv(env);
    if (settingsData) {
      updateFieldsForEnv(settingsData, env);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    setErrorMessage(null);
    try {
      const input: SettingsInput = {
        environment: selectedEnv,
        partnerId: partnerId.trim(),
        privateKey: privateKey.trim(),
      };
      await savePaylabsSettings(input);
      onSaved();
      onClose();
    } catch (e: any) {
      setErrorMessage(e?.message || String(e));
    } finally {
      setIsSaving(false);
    }
  };

  if (!isOpen) return null;
  const isProd = selectedEnv === 'PROD';
  const currentKeyInfo = settingsData ? (isProd ? settingsData.prod.key : settingsData.sit.key) : null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Pengaturan Kredensial Paylabs SNAP"
      maxWidth={540}
      icon={<Key size={18} className="text-accent" />}
      footerActions={
        <>
          <button
            type="button"
            className="desktop-modal-btn desktop-modal-btn-cancel"
            onClick={onClose}
          >
            Tutup
          </button>
          <button
            type="button"
            className="desktop-modal-btn desktop-modal-btn-confirm"
            style={{
              background: isProd ? '#ef4444' : 'var(--accent-primary)',
              minWidth: 160,
            }}
            onClick={handleSave}
            disabled={isSaving}
          >
            <Save size={14} />
            <span>{isSaving ? 'Menyimpan...' : `Simpan & Pakai ${isProd ? 'Production' : 'SIT'}`}</span>
          </button>
        </>
      }
    >
      <div className="paylabs-modal-container">
        {/* Environment Switcher Tabs (macOS Pill Segmented) */}
        <div className="paylabs-modal-segmented">
          <button
            type="button"
            className={`paylabs-modal-segmented-btn ${!isProd ? 'active-sit' : ''}`}
            onClick={() => handleEnvChange('SIT')}
          >
            <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#6366f1', display: 'inline-block' }} />
            <span>SIT (Uji Coba Sandbox)</span>
          </button>
          <button
            type="button"
            className={`paylabs-modal-segmented-btn ${isProd ? 'active-prod' : ''}`}
            onClick={() => handleEnvChange('PROD')}
          >
            <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#ef4444', display: 'inline-block' }} />
            <span>Production (Live Transaksi)</span>
          </button>
        </div>

        {/* Banner Peringatan Mode Production */}
        {isProd && (
          <div className="paylabs-prod-warning-box">
            <ShieldAlert size={18} style={{ flexShrink: 0 }} />
            <div>
              <strong>Perhatian Mode Production:</strong> Seluruh permintaan Virtual Account akan terkirim langsung ke server produksi Paylabs.
            </div>
          </div>
        )}

        {/* Banner Pesan Error */}
        {errorMessage && (
          <div className="paylabs-prod-warning-box" style={{ background: 'rgba(239, 68, 68, 0.15)' }}>
            <AlertCircle size={16} style={{ flexShrink: 0 }} />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Input Partner ID */}
        <div className="paylabs-modal-field">
          <label className="paylabs-modal-label">
            Partner ID ({selectedEnv}) <span className="paylabs-required-star" aria-label="wajib diisi">*</span>
          </label>
          <input
            type="text"
            className="paylabs-modal-input font-mono"
            placeholder="Contoh: 12345678"
            value={partnerId}
            onChange={(e) => setPartnerId(e.target.value)}
            required
          />
        </div>

        {/* Input RSA Private Key */}
        <div className="paylabs-modal-field">
          <div className="paylabs-key-format-row">
            <label className="paylabs-modal-label">
              RSA Private Key ({selectedEnv}) <span className="paylabs-required-star" aria-label="wajib diisi">*</span>
            </label>
            {(() => {
              const trimmed = privateKey.trim();
              if (!trimmed) {
                return (
                  <span className="text-xs text-subtle font-mono">
                    Auto-detect PKCS#1 / PKCS#8
                  </span>
                );
              }
              if (trimmed.includes('BEGIN RSA PRIVATE KEY')) {
                return (
                  <span className="paylabs-key-format-badge pkcs1">
                    PKCS#1 (PEM)
                  </span>
                );
              }
              if (trimmed.includes('BEGIN PRIVATE KEY')) {
                return (
                  <span className="paylabs-key-format-badge pkcs8">
                    PKCS#8 (PEM)
                  </span>
                );
              }
              const cleaned = trimmed.replace(/\s+/g, '');
              const isBase64 = /^[A-Za-z0-9+/=]+$/.test(cleaned);
              if (isBase64 && cleaned.length >= 64) {
                return (
                  <span className="paylabs-key-format-badge raw">
                    Base64 Mentah (Auto-detect PKCS#1 / PKCS#8)
                  </span>
                );
              }
              return (
                <span className="paylabs-key-format-badge">
                  Format Kustom
                </span>
              );
            })()}
          </div>
          <textarea
            className="paylabs-modal-textarea"
            placeholder="Tempelkan Private Key RSA di sini...&#10;Bisa berformat PEM (dengan -----BEGIN...) atau Base64 mentah (tanpa header)"
            value={privateKey}
            onChange={(e) => setPrivateKey(e.target.value)}
            spellCheck={false}
          />
          <span className="text-xs text-subtle" style={{ marginTop: 2 }}>
            Mendukung format PEM atau Base64 mentah tanpa header. Sistem otomatis mendeteksi struktur PKCS#1 atau PKCS#8.
          </span>
        </div>

        {/* Status Kunci Tersimpan & Fingerprint SHA-256 */}
        {currentKeyInfo && currentKeyInfo.stored && (
          <div className="paylabs-key-status-card">
            <div className="paylabs-key-status-header">
              <CheckCircle2 size={14} />
              <span>Private key terenkripsi Windows DPAPI ({currentKeyInfo.bits}-bit RSA)</span>
            </div>
            <div className="paylabs-key-fingerprint-box">
              <span>Sidik Jari Kunci (SHA-256):</span>
              <code className="paylabs-key-fingerprint-code">
                {currentKeyInfo.fingerprint || '-'}
              </code>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};
