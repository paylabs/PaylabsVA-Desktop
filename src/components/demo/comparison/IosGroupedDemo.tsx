/**
 * @file IosGroupedDemo.tsx
 * @description Komponen showcase Inset Grouped Settings list native Apple iOS (Apple HIG).
 */

import React, { useState } from 'react';
import { Wifi, Bluetooth, Bell } from 'lucide-react';
import { IosSwitch } from '../../ios/IosSwitch';

/**
 * Preview interaktif iOS Inset Grouped List
 */
export const IosGroupedDemo: React.FC = () => {
  const [wifiActive, setWifiActive] = useState(true);
  const [bluetoothActive, setBluetoothActive] = useState(true);
  const [notifActive, setNotifActive] = useState(false);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <div className="ios-group-header">Apple HIG Inset Grouped Settings Preview</div>
      <div className="ios-inset-group">
        <div className="ios-inset-row">
          <div className="ios-row-left">
            <div className="ios-row-icon-badge" style={{ backgroundColor: '#007aff' }}>
              <Wifi size={16} />
            </div>
            <div>
              <div className="ios-row-title">Koneksi Jaringan Lokal</div>
              <div className="ios-row-subtitle">Terhubung ke Antigravity Safe IPC</div>
            </div>
          </div>
          <IosSwitch checked={wifiActive} onChange={setWifiActive} aria-label="Toggle Wifi" />
        </div>

        <div className="ios-row-left ios-inset-row">
          <div className="ios-row-left">
            <div className="ios-row-icon-badge" style={{ backgroundColor: '#5856d6' }}>
              <Bluetooth size={16} />
            </div>
            <div>
              <div className="ios-row-title">Perangkat Eksternal</div>
              <div className="ios-row-subtitle">Siap menghubungkan keyboard/trackpad</div>
            </div>
          </div>
          <IosSwitch checked={bluetoothActive} onChange={setBluetoothActive} aria-label="Toggle Bluetooth" />
        </div>

        <div className="ios-row-left ios-inset-row">
          <div className="ios-row-left">
            <div className="ios-row-icon-badge" style={{ backgroundColor: '#ff3b30' }}>
              <Bell size={16} />
            </div>
            <div>
              <div className="ios-row-title">Pemberitahuan Sistem</div>
              <div className="ios-row-subtitle">Hanya tampilkan peringatan prioritas tinggi</div>
            </div>
          </div>
          <IosSwitch checked={notifActive} onChange={setNotifActive} aria-label="Toggle Notifikasi" />
        </div>
      </div>
    </div>
  );
};
