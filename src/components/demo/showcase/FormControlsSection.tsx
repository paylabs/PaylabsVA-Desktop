/**
 * @file FormControlsSection.tsx
 * @description Bagian demonstrasi kontrol input formulir (Text input, CustomSelect, Checkbox, dan iOS Switch).
 */

import React from 'react';
import { Layers } from 'lucide-react';
import { CustomSelect } from '../../ui/CustomSelect';
import { IosSwitch } from '../../ios/IosSwitch';

export interface FormControlsSectionProps {
  inputValue: string;
  onInputChange: (value: string) => void;
  selectedFramework: string;
  onFrameworkChange: (value: string) => void;
  checkboxState: boolean;
  onCheckboxChange: (checked: boolean) => void;
  iosSwitchChecked: boolean;
  onIosSwitchChange: (checked: boolean) => void;
  onShowToast: (title: string, message?: string, type?: 'info' | 'success' | 'warning' | 'error') => void;
}

/**
 * Section demonstrasi formulir & input interaktif
 */
export const FormControlsSection: React.FC<FormControlsSectionProps> = ({
  inputValue,
  onInputChange,
  selectedFramework,
  onFrameworkChange,
  checkboxState,
  onCheckboxChange,
  iosSwitchChecked,
  onIosSwitchChange,
  onShowToast,
}) => (
  <div className="comparison-container">
    <h2 style={{ fontSize: 14, fontWeight: 700, marginBottom: 14, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: 8 }}>
      <Layers size={16} color="var(--accent-secondary)" />
      <span>Form Controls &amp; Toggles</span>
    </h2>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16 }}>
      {/* Input Text */}
      <div>
        <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 6 }}>
          Text Input
        </label>
        <input
          type="text"
          value={inputValue}
          onChange={(e) => onInputChange(e.target.value)}
          style={{
            width: '100%',
            padding: '8px 12px',
            backgroundColor: 'var(--bg-surface-2)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-button)',
            color: 'var(--text-primary)',
            fontSize: 13,
          }}
        />
      </div>

      {/* Custom Select Dropdown (Rounded Popover) */}
      <div>
        <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 6 }}>
          Platform Framework (Custom Dropdown)
        </label>
        <CustomSelect
          value={selectedFramework}
          onChange={(val) => {
            onFrameworkChange(val);
            onShowToast('Pilihan Framework', `Framework aktif diubah ke ${val}`, 'info');
          }}
          options={[
            { value: 'tauri', label: 'Tauri v2 (Rust Backend)' },
            { value: 'react', label: 'React 19 + TypeScript' },
            { value: 'vite', label: 'Vite Modern Bundler' },
          ]}
          aria-label="Pilihan Platform Framework"
        />
      </div>

      {/* Checkbox & Switch */}
      <div>
        <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 10 }}>
          Interactive Toggles &amp; Apple Switch
        </label>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: 'var(--text-secondary)', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={checkboxState}
              onChange={(e) => onCheckboxChange(e.target.checked)}
              style={{ accentColor: 'var(--accent-primary)', width: 16, height: 16 }}
            />
            <span>Enable Realtime IPC Channel</span>
          </label>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 4 }}>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: 12, fontWeight: 500, color: 'var(--text-primary)' }}>Apple iOS Switch</span>
              <span style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>HIG Green #34c759</span>
            </div>
            <IosSwitch
              checked={iosSwitchChecked}
              onChange={(val) => {
                onIosSwitchChange(val);
                onShowToast(
                  'iOS Switch',
                  `Status toggle Apple HIG berubah menjadi ${val ? 'Aktif' : 'Nonaktif'}`,
                  'info'
                );
              }}
              aria-label="iOS Switch Showcase"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
);
