/**
 * @file OverviewSection.tsx
 * @description Tab Overview perbandingan status profil aktif, komparasi OS, dan interaksi native.
 */

import React from 'react';
import { Smartphone, Apple, Monitor, Sparkles, Command } from 'lucide-react';
import { DesktopPlatform, PlatformConfig } from '../../../types/platform';
import { InfoCard } from './InfoCard';
import { ComparisonBlock } from './ComparisonBlock';
import { IosGroupedDemo } from './IosGroupedDemo';

export interface OverviewSectionProps {
  isMac: boolean;
  platform?: DesktopPlatform;
  config?: PlatformConfig;
}

/**
 * Tab Overview komparasi status platform
 */
export const OverviewSection: React.FC<OverviewSectionProps> = ({
  isMac,
  platform,
  config,
}) => {
  const isIos = platform === 'ios';

  const getProfileIcon = () => {
    if (isIos) return <Smartphone size={20} color="#34c759" />;
    if (isMac) return <Apple size={20} color="var(--mac-close)" />;
    return <Monitor size={20} color="var(--text-accent)" />;
  };

  const getProfileDesc = () => {
    if (isIos) return 'Large titles, Inset Grouped, Bottom Bar & Apple Switch';
    if (isMac) return 'Traffic lights di kiri atas, aksen SF Pro';
    return 'Controls di kanan atas, aksen Fluent Segoe';
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
      <div className="overview-cards-grid">
        <InfoCard
          title="Active Style Profile"
          value={config?.displayName ?? ''}
          icon={getProfileIcon()}
          description={getProfileDesc()}
        />
        <InfoCard
          title="Titlebar & Navigation"
          value={isIos ? 'Bottom Tab Bar (iOS HIG)' : isMac ? 'Left (Traffic Lights)' : 'Right (Fluent Controls)'}
          icon={<Sparkles size={20} color="var(--accent-secondary)" />}
          description={isIos ? 'Bottom tab bar 56px + gesture friendly' : 'Frameless window dengan data-tauri-drag-region'}
        />
        <InfoCard
          title="Modifier Key"
          value={`${config?.modifierKeySymbol} (${config?.modifierKeyLabel})`}
          icon={<Command size={20} color="var(--accent-primary)" />}
          description={isMac || isIos ? '⌘K, ⌘⇧P, ⌘,' : 'Ctrl+K, Ctrl+Shift+P, Ctrl+,'}
        />
      </div>

      {isIos && <IosGroupedDemo />}

      <div className="comparison-container">
        <h2 style={{ fontSize: 15, fontWeight: 600, marginBottom: 12, color: 'var(--text-primary)' }}>
          Prinsip Konsistensi Desain Lintas Platform (macOS, iOS, Windows)
        </h2>
        <div className="comparison-grid">
          <ComparisonBlock
            title="macOS Compliance"
            icon={<Apple size={17} color="var(--mac-close)" />}
            accentColor="var(--accent-primary)"
            items={[
              'Tombol Close, Minimize, Zoom berada di kiri atas (Traffic Lights 🔴🟡🟢)',
              'Ikon micro-symbol muncul halus saat tombol di-hover',
              'Shortcut keyboard menggunakan simbol Command ⌘',
              'Latar belakang solid berkinerja tinggi bebas lag rendering',
            ]}
          />
          <ComparisonBlock
            title="iOS / iPadOS (Apple HIG)"
            icon={<Smartphone size={17} color="#34c759" />}
            accentColor="#34c759"
            items={[
              'Inset Grouped List cards dengan rounded corners 12px & separator 16px',
              'Apple Green Switch (#34c759) dengan interaksi fisika pegas',
              'Large Navigation Title (30px) hierarki tipografi SF Pro',
              'Bottom Tab Bar (56px) dengan label 10px & active tint color',
              'Action Sheet modal sliding dari bawah untuk aksi kontekstual',
            ]}
          />
          <ComparisonBlock
            title="Windows Compliance"
            icon={<Monitor size={17} color="var(--text-accent)" />}
            accentColor="var(--text-accent)"
            items={[
              'Tombol Minimize, Maximize/Restore, Close berada di kanan atas',
              'Hover state tombol Close berubah merah khas Windows (#e81123)',
              'Shortcut keyboard menggunakan modifier teks Ctrl',
              'Latar belakang solid dengan rendering teks ClearType sangat tajam',
            ]}
          />
        </div>
      </div>
    </div>
  );
};
