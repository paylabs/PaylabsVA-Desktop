/**
 * @file VaGeneratorView.tsx
 * @description View pembuatan Virtual Account Paylabs SNAP dengan tata letak split 2-kolom native macOS (Apple HIG).
 */

import React, { useState } from 'react';
import {
  CreditCard,
  Copy,
  Check,
  Code2,
  AlertCircle,
  ArrowRight,
} from 'lucide-react';

import { usePaylabs } from '../../hooks/usePaylabs';
import { CreateVaFormInput } from '../../types/paylabs';
import { CustomSelect } from '../ui/CustomSelect';
import { Tooltip } from '../ui/Tooltip';
import { VaInspectorDrawer } from './VaInspectorDrawer';

export interface VaGeneratorViewProps {
  mode?: 'dynamic' | 'static';
  onShowToast: (title: string, message?: string, type?: 'info' | 'success' | 'warning' | 'error') => void;
  onOpenSettings?: () => void;
  onVaCreated?: () => void;
}

const PRESET_AMOUNTS = [
  { label: '50rb', value: '50000' },
  { label: '100rb', value: '100000' },
  { label: '250rb', value: '250000' },
  { label: '500rb', value: '500000' },
  { label: '1 Juta', value: '1000000' },
];

/**
 * Format string angka menjadi representasi Rupiah
 */
function formatRupiahDisplay(amount: string): string {
  const num = parseFloat(amount);
  if (isNaN(num)) return `Rp ${amount}`;
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(num);
}

/**
 * Format nomor virtual account dengan spasi per 4 digit agar tidak padat dan mudah dibaca
 * Contoh: "0814566022546772" -> "0814 5660 2254 6772"
 */
function formatVaDisplay(vaNo: string): string {
  if (!vaNo || vaNo === '-') return '-';
  const clean = vaNo.replace(/\s+/g, '');
  return clean.replace(/(\d{4})(?=\d)/g, '$1 ');
}

/**
 * Format tanggal kedaluwarsa ISO string menjadi tanggal yang ringkas dan ramah dibaca
 * Contoh: "2026-10-19T18:28:05+07:00" -> "19 Okt 2026, 18:28 WIB"
 */
function formatExpiryDisplay(dateStr?: string): string {
  if (!dateStr || dateStr === '-') return '-';
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
    const day = d.getDate().toString().padStart(2, '0');
    const month = months[d.getMonth()];
    const year = d.getFullYear();
    const hours = d.getHours().toString().padStart(2, '0');
    const minutes = d.getMinutes().toString().padStart(2, '0');
    return `${day} ${month} ${year}, ${hours}:${minutes} WIB`;
  } catch {
    return dateStr;
  }
}

/**
 * Interface untuk melacak kesalahan validasi formulir parameter VA
 */
interface FormErrors {
  channel?: string;
  name?: string;
  amount?: string;
}

/**
 * Komponen Form Input Pembuatan VA macOS
 */
interface VaFormSectionProps {
  mode: 'dynamic' | 'static';
  channel: string;
  setChannel: (val: string) => void;
  channelOptions: Array<{ value: string; label: string }>;
  name: string;
  setName: (val: string) => void;
  phone: string;
  setPhone: (val: string) => void;
  amount: string;
  setAmount: (val: string) => void;
  expiryDays: string;
  setExpiryDays: (val: string) => void;
  trxId: string;
  setTrxId: (val: string) => void;
  isSubmitting: boolean;
  onSubmit: (e: React.FormEvent) => void;
  errors: FormErrors;
  onClearError: (field: keyof FormErrors) => void;
}

const VaFormSection: React.FC<VaFormSectionProps> = ({
  mode,
  channel,
  setChannel,
  channelOptions,
  name,
  setName,
  phone,
  setPhone,
  amount,
  setAmount,
  expiryDays,
  setExpiryDays,
  trxId,
  setTrxId,
  isSubmitting,
  onSubmit,
  errors,
  onClearError,
}) => {
  return (
    <form className="paylabs-mac-card paylabs-form-card" onSubmit={onSubmit} noValidate>
      <div className="paylabs-card-header">
        <h3 className="paylabs-card-title">
          {mode === 'static' ? 'Parameter Static Virtual Account' : 'Parameter Dynamic Virtual Account'}
        </h3>
      </div>

      <div className="paylabs-form-body">
        {/* Channel Bank */}
        <div id="va-bank-selector" className="paylabs-field">
          <label className="paylabs-label">
            Pilih Channel Bank <span className="paylabs-required-star" aria-label="wajib diisi">*</span>
          </label>
          <CustomSelect
            value={channel}
            onChange={(val) => {
              setChannel(val);
              if (errors.channel) onClearError('channel');
            }}
            options={channelOptions}
            placeholder="Pilih Bank"
            searchable={false}
            hasError={Boolean(errors.channel)}
          />
          {errors.channel && (
            <div className="paylabs-field-error">
              <AlertCircle size={12} />
              <span>{errors.channel}</span>
            </div>
          )}
        </div>

        {/* Nama Pemilik */}
        <div className="paylabs-field">
          <label className="paylabs-label">
            Nama Pelanggan (Customer Name) <span className="paylabs-required-star" aria-label="wajib diisi">*</span>
          </label>
          <input
            type="text"
            className={`paylabs-mac-input ${errors.name ? 'is-invalid' : ''}`}
            placeholder="Contoh: Budi Pratama"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              if (errors.name) onClearError('name');
            }}
          />
          {errors.name && (
            <div className="paylabs-field-error">
              <AlertCircle size={12} />
              <span>{errors.name}</span>
            </div>
          )}
        </div>

        {/* Nomor HP Pembayar (virtualAccountPhone) */}
        <div className="paylabs-field">
          <label className="paylabs-label">
            Nomor HP Pembayar (virtualAccountPhone)
            <span className="text-subtle font-normal text-xs ml-1">(Opsional)</span>
          </label>
          <input
            type="tel"
            className="paylabs-mac-input font-mono"
            placeholder="Contoh: 6281234567890"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>

        {/* Nominal & Preset Pill (Hanya tampil pada Dynamic VA, ditiadakan pada Static VA) */}
        {mode === 'static' ? (
          <div id="va-static-amount-info" className="paylabs-field">
            <label className="paylabs-label">Nominal Pembayaran</label>
            <div
              style={{
                padding: '12px 14px',
                background: 'rgba(52, 199, 89, 0.08)',
                border: '1px solid rgba(52, 199, 89, 0.25)',
                borderRadius: 8,
                display: 'flex',
                alignItems: 'center',
                gap: 10,
              }}
            >
              <span
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  backgroundColor: '#34c759',
                  boxShadow: '0 0 6px rgba(52, 199, 89, 0.6)',
                  flexShrink: 0,
                }}
              />
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--text-primary)' }}>
                  Open Payment (Rp 0.00 / Bebas Nominal)
                </span>
                <span style={{ fontSize: 11, color: 'var(--text-secondary)' }}>
                  Static Virtual Account menerima nominal transfer bebas dari pembayar tanpa pembatasan jumlah tetap.
                </span>
              </div>
            </div>
          </div>
        ) : (
          <div id="va-amount-input" className="paylabs-field">
            <div className="flex items-center justify-between mb-1">
              <label className="paylabs-label mb-0">
                Nominal Tagihan (IDR) <span className="paylabs-required-star" aria-label="wajib diisi">*</span>
              </label>
              <span className="text-xs font-mono text-accent font-semibold">
                {formatRupiahDisplay(amount)}
              </span>
            </div>
            <input
              type="number"
              className={`paylabs-mac-input font-mono ${errors.amount ? 'is-invalid' : ''}`}
              placeholder="Nominal tagihan"
              value={amount}
              onChange={(e) => {
                setAmount(e.target.value);
                if (errors.amount) onClearError('amount');
              }}
              min="10000"
            />
            {errors.amount && (
              <div className="paylabs-field-error">
                <AlertCircle size={12} />
                <span>{errors.amount}</span>
              </div>
            )}
            <div className="paylabs-presets-row">
              {PRESET_AMOUNTS.map((preset) => (
                <button
                  key={preset.value}
                  type="button"
                  className={`paylabs-preset-pill ${amount === preset.value ? 'active' : ''}`}
                  onClick={() => {
                    setAmount(preset.value);
                    if (errors.amount) onClearError('amount');
                  }}
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Masa Berlaku */}
        <div className="paylabs-field">
          <label className="paylabs-label">Masa Berlaku Tagihan (Hari)</label>
          <input
            type="number"
            className="paylabs-mac-input"
            value={expiryDays}
            onChange={(e) => setExpiryDays(e.target.value)}
            min="1"
            max="365"
          />
        </div>

        {/* Trx ID Custom */}
        <div className="paylabs-field">
          <label className="paylabs-label">Partner Trx ID (Opsional)</label>
          <input
            type="text"
            className="paylabs-mac-input font-mono"
            placeholder="Dibuat otomatis bila dikosongkan"
            value={trxId}
            onChange={(e) => setTrxId(e.target.value)}
          />
        </div>

        {/* Tombol Submit */}
        <button
          id="va-generate-btn"
          type="submit"
          className="paylabs-primary-btn w-full mt-2"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <span>Menandatangani & Mengirim SNAP...</span>
          ) : (
            <>
              <span>{mode === 'static' ? 'Generate Static Virtual Account' : 'Generate Dynamic Virtual Account'}</span>
              <ArrowRight size={15} />
            </>
          )}
        </button>
      </div>
    </form>
  );
};

/**
 * Komponen Kartu Hasil VA macOS
 */
interface ResultSectionProps {
  mode: 'dynamic' | 'static';
  createdVa: any;
  copiedVa: boolean;
  onCopyVa: (vaNo: string) => void;
  onOpenInspector: () => void;
}

const ResultSection: React.FC<ResultSectionProps> = ({
  mode,
  createdVa,
  copiedVa,
  onCopyVa,
  onOpenInspector,
}) => {
  if (!createdVa) {
    return (
      <div className="paylabs-mac-card paylabs-empty-result-card">
        <div className="paylabs-squircle-large-icon">
          <CreditCard size={36} />
        </div>
        <h3 className="font-semibold text-base mb-1">Menunggu Alokasi VA</h3>
        <p className="text-subtle text-xs text-center max-w-xs">
          Isi formulir di sebelah kiri dan klik tombol <strong>Generate Virtual Account</strong> untuk mendapatkan nomor rekening virtual aktif.
        </p>
      </div>
    );
  }

  const vaNo = createdVa.virtualAccountNo || '-';
  const vaName = createdVa.virtualAccountName || createdVa.customerName || '-';
  const totalVal = createdVa.totalAmount?.value || '-';
  const totalDisplay =
    mode === 'static' || totalVal === '0.00' || totalVal === '0'
      ? 'Rp 0 (Open Amount)'
      : formatRupiahDisplay(totalVal);

  return (
    <div className="paylabs-mac-card paylabs-result-card animate-scale-in">
      <div className="paylabs-result-badge-row">
        <span className="paylabs-success-pill flex items-center gap-1">
          <Check size={12} /> Siap Bayar
        </span>
        <Tooltip content="Buka Jejak & Audit SNAP API" position="bottom">
          <button
            type="button"
            className="paylabs-inspector-link-btn"
            onClick={onOpenInspector}
            aria-label="Buka Jejak SNAP API"
          >
            <Code2 size={13} />
            <span>SNAP Audit</span>
          </button>
        </Tooltip>
      </div>

      <div className="paylabs-result-number-box">
        <div className="text-xs text-subtle mb-1">Nomor Virtual Account</div>
        <div className="paylabs-va-big-number font-mono">{formatVaDisplay(vaNo)}</div>
        <Tooltip content="Salin Nomor VA ke Clipboard" position="bottom">
          <button
            type="button"
            className={`paylabs-copy-main-btn ${copiedVa ? 'copied' : ''}`}
            onClick={() => onCopyVa(vaNo)}
            aria-label="Salin Nomor VA"
          >
            {copiedVa ? <Check size={14} /> : <Copy size={14} />}
            <span>{copiedVa ? 'Nomor Berhasil Disalin!' : 'Salin Nomor VA'}</span>
          </button>
        </Tooltip>
      </div>

      <div className="paylabs-result-details-grid">
        <div className="paylabs-result-item">
          <span className="paylabs-result-label">Nama Pemilik</span>
          <span className="paylabs-result-value">{vaName}</span>
        </div>
        <div className="paylabs-result-item">
          <span className="paylabs-result-label">Total Tagihan</span>
          <span className="paylabs-result-value font-mono font-semibold text-accent">
            {totalDisplay}
          </span>
        </div>
        <div className="paylabs-result-item">
          <span className="paylabs-result-label">Batas Pembayaran</span>
          <span className="paylabs-result-value font-mono text-xs">
            {formatExpiryDisplay(createdVa.expiredDate)}
          </span>
        </div>
        <div className="paylabs-result-item">
          <span className="paylabs-result-label">Trx ID Merchant</span>
          <span className="paylabs-result-value font-mono text-xs">
            {createdVa.trxId || '-'}
          </span>
        </div>
      </div>
    </div>
  );
};

/**
 * View Utama Generator VA Bergaya Native macOS
 */
export const VaGeneratorView: React.FC<VaGeneratorViewProps> = ({
  mode = 'dynamic',
  onShowToast,
  onOpenSettings,
  onVaCreated,
}) => {
  const isStatic = mode === 'static';
  const { status, isSubmitting, lastExchange, submitCreateVa } = usePaylabs();

  const [channel, setChannel] = useState(isStatic ? 'StaticBNIVA' : 'MultipleBNIVA');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [amount, setAmount] = useState(isStatic ? '0' : '100000');
  const [expiryDays, setExpiryDays] = useState('30');
  const [trxId, setTrxId] = useState('');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [copiedVa, setCopiedVa] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});

  // Sinkronisasi bila prop mode berubah
  React.useEffect(() => {
    setChannel(isStatic ? 'StaticBNIVA' : 'MultipleBNIVA');
    setAmount(isStatic ? '0' : '100000');
    setErrors({});
  }, [isStatic]);

  const handleClearError = (field: keyof FormErrors) => {
    setErrors((prev) => {
      if (!prev[field]) return prev;
      const next = { ...prev };
      delete next[field];
      return next;
    });
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    if (!channel || !channel.trim()) {
      newErrors.channel = 'Silakan pilih channel bank terlebih dahulu';
    }
    if (!name.trim()) {
      newErrors.name = 'Nama pelanggan wajib diisi';
    }
    if (!isStatic) {
      const parsedAmount = parseFloat(amount);
      if (!amount || isNaN(parsedAmount) || parsedAmount < 10000) {
        newErrors.amount = 'Nominal tagihan minimal Rp 10.000';
      }
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      if (!channel || !channel.trim()) {
        onShowToast('Validasi Gagal', 'Silakan pilih channel bank terlebih dahulu', 'warning');
      } else if (!name.trim()) {
        onShowToast('Validasi Gagal', 'Nama pelanggan wajib diisi', 'warning');
      } else {
        onShowToast('Validasi Gagal', 'Periksa kembali parameter formulir', 'warning');
      }
      return;
    }
    const formInput: CreateVaFormInput = {
      channel,
      name: name.trim(),
      phone: phone.trim() || undefined,
      amount: isStatic ? '0' : amount.trim(),
      expiryDays: parseInt(expiryDays, 10) || 30,
      trxId: trxId.trim() || undefined,
    };

    const ex = await submitCreateVa(formInput);
    if (ex.success) {
      onShowToast('VA Berhasil Dibuat', `Nomor VA: ${ex.parsed?.virtualAccountData?.virtualAccountNo}`, 'success');
      onVaCreated?.();
    } else {
      onShowToast('Pembuatan VA Gagal', ex.error || ex.parsed?.responseMessage || 'Terjadi kesalahan SNAP API', 'error');
    }
  };

  const handleCopyVa = (vaNumber: string) => {
    navigator.clipboard.writeText(vaNumber);
    setCopiedVa(true);
    onShowToast('Nomor VA Disalin', vaNumber, 'info');
    setTimeout(() => setCopiedVa(false), 2000);
  };

  // Pilihan channel bank yang didukung: BNI (default), BCA, dan Mandiri
  const channelOptions = isStatic
    ? [
        { value: 'StaticBNIVA', label: 'BNI (009)' },
        { value: 'StaticBCAVA', label: 'BCA (014)' },
        { value: 'StaticMandiriVA', label: 'Mandiri (008)' },
      ]
    : [
        { value: 'MultipleBNIVA', label: 'BNI (009)' },
        { value: 'MultipleBCAVA', label: 'BCA (014)' },
        { value: 'MultipleMandiriVA', label: 'Mandiri (008)' },
      ];

  const createdVa = lastExchange?.success ? lastExchange.parsed?.virtualAccountData : null;

  return (
    <div className="paylabs-page-container va-generator-fixed-container">
      {/* Banner Peringatan jika belum dikonfigurasi */}
      {status && !status.configured && (
        <div className="paylabs-warning-strip">
          <div className="flex items-center gap-2">
            <AlertCircle size={16} className="text-warning" />
            <span className="text-xs">
              Kredensial merchant belum lengkap. Silakan lakukan konfigurasi Partner ID &amp; Private Key RSA.
            </span>
          </div>
          {onOpenSettings && (
            <button
              type="button"
              className="paylabs-warning-btn"
              onClick={onOpenSettings}
            >
              Atur Kredensial
            </button>
          )}
        </div>
      )}

      {/* Banner Error jika request terakhir gagal dengan tombol Buka Audit SNAP */}
      {lastExchange && !lastExchange.success && (
        <div
          style={{
            background: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            borderRadius: 8,
            padding: '10px 16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 12,
            flexWrap: 'wrap',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#ef4444', fontSize: 12.5 }}>
            <AlertCircle size={16} style={{ flexShrink: 0 }} />
            <span>
              <strong>Permintaan Gagal:</strong> {lastExchange.error || lastExchange.parsed?.responseMessage || 'Terjadi kesalahan SNAP'}
            </span>
          </div>
          <button
            type="button"
            className="paylabs-inspector-link-btn"
            style={{ color: '#ef4444', borderColor: 'rgba(239, 68, 68, 0.4)', background: 'rgba(239, 68, 68, 0.15)' }}
            onClick={() => setIsDrawerOpen(true)}
          >
            <Code2 size={13} />
            <span>Buka Audit SNAP</span>
          </button>
        </div>
      )}

      {/* Grid Split 2-Kolom macOS */}
      <div className="paylabs-mac-split-grid">
        <VaFormSection
          mode={mode}
          channel={channel}
          setChannel={setChannel}
          channelOptions={channelOptions}
          name={name}
          setName={setName}
          phone={phone}
          setPhone={setPhone}
          amount={amount}
          setAmount={setAmount}
          expiryDays={expiryDays}
          setExpiryDays={setExpiryDays}
          trxId={trxId}
          setTrxId={setTrxId}
          isSubmitting={isSubmitting}
          onSubmit={handleSubmit}
          errors={errors}
          onClearError={handleClearError}
        />

        <ResultSection
          mode={mode}
          createdVa={createdVa}
          copiedVa={copiedVa}
          onCopyVa={handleCopyVa}
          onOpenInspector={() => setIsDrawerOpen(true)}
        />
      </div>

      {/* Slide-out Drawer SNAP Inspector (Apple HIG) */}
      <VaInspectorDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        exchange={lastExchange}
      />
    </div>
  );
};
