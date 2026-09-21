/**
 * @file AdaptiveTitlebar.tsx
 * @description Komponen Titlebar macOS native dengan kontrol traffic lights Apple HIG, drag region, tombol kredensial Paylabs, dan Spotlight search.
 */

import React from 'react';
import { Sun, Moon, Search, Key } from 'lucide-react';
import { DesktopPlatform } from '../../types/platform';
import { ThemeMode } from '../../types/theme';
import { Status } from '../../types/paylabs';
import { MacTrafficLights } from './MacTrafficLights';
import { Tooltip } from '../ui/Tooltip';
import { startDragAppWindow } from '../../services/windowService';

export interface AdaptiveTitlebarProps {
  platform?: DesktopPlatform;
  isMaximized: boolean;
  title: string;
  theme?: ThemeMode;
  status?: Status | null;
  onClose: () => void;
  onMinimize: () => void;
  onToggleMaximize: () => void;
  onOpenSettings?: () => void;
  onToggleTheme?: () => void;
  onOpenCommandPalette?: () => void;
}

/**
 * Handle inisiasi native dragging window Tauri
 */
async function handleTitlebarMouseDown(e: React.MouseEvent<HTMLElement>): Promise<void> {
  if (e.button !== 0) return;
  const target = e.target as HTMLElement | null;
  if (target && target.closest('.no-drag')) return;
  await startDragAppWindow();
}

/**
 * Handle double click pada titlebar untuk maximize/restore window
 */
function handleTitlebarDoubleClick(
  e: React.MouseEvent<HTMLElement>,
  onToggleMaximize: () => void
): void {
  const target = e.target as HTMLElement | null;
  if (target && !target.closest('.no-drag')) {
    onToggleMaximize();
  }
}

/**
 * Komponen Titlebar macOS Native untuk Paylabs Desktop
 */
export const AdaptiveTitlebar: React.FC<AdaptiveTitlebarProps> = ({
  isMaximized,
  title,
  theme = 'dark',
  status,
  onClose,
  onMinimize,
  onToggleMaximize,
  onOpenSettings,
  onToggleTheme,
  onOpenCommandPalette,
}) => {
  const isProd = status?.production ?? false;
  const envText = isProd ? 'PROD' : 'SIT';

  return (
    <header
      className={`adaptive-titlebar ${isMaximized ? 'is-maximized' : ''}`}
      data-testid="adaptive-titlebar"
      data-tauri-drag-region
      data-maximized={isMaximized}
      onMouseDown={handleTitlebarMouseDown}
      onDoubleClick={(e) => handleTitlebarDoubleClick(e, onToggleMaximize)}
    >

      {/* Sisi Kiri: Apple Traffic Lights (🔴🟡🟢) */}
      <MacTrafficLights
        onClose={onClose}
        onMinimize={onMinimize}
        onMaximize={onToggleMaximize}
      />

      {/* Tengah: Area Drag Region Transparan */}
      <div className="titlebar-drag-region" data-tauri-drag-region />

      {/* Tengah Absolut: Judul Window Tepat di Pusat Geometris */}
      <div className="titlebar-center-title" data-tauri-drag-region>
        <span className="titlebar-title-text" title={title}>
          <span className="titlebar-full-title">{title}</span>
          <span className="titlebar-short-title">{title}</span>
        </span>
      </div>

      {/* Sisi Kanan: Action Buttons, Theme Toggle, & Credential Pill */}
      <div style={{ display: 'flex', alignItems: 'center', height: '100%', gap: 4 }}>
        {/* Tombol Buka Spotlight Command Palette */}
        {onOpenCommandPalette && (
          <Tooltip content="Spotlight Command Palette" shortcut="⌘K" position="bottom">
            <button
              type="button"
              className="titlebar-search-btn no-drag"
              onClick={onOpenCommandPalette}
              aria-label="Buka Command Palette"
            >
              <Search size={13} />
              <span className="macos-kbd" style={{ fontSize: 9.5, padding: '1px 5px' }}>⌘K</span>
            </button>
          </Tooltip>
        )}

        {/* Tombol Toggle Tema Terang/Gelap */}
        {onToggleTheme && (
          <Tooltip content={theme === 'dark' ? 'Ganti ke Mode Terang' : 'Ganti ke Mode Gelap'} position="bottom">
            <button
              type="button"
              className="titlebar-theme-toggle no-drag"
              onClick={onToggleTheme}
              aria-label="Toggle Tema"
            >
              {theme === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
            </button>
          </Tooltip>
        )}

        {/* Tombol Pill Kredensial Paylabs (SIT / Production) */}
        {onOpenSettings && (
          <Tooltip
            content={
              isProd
                ? 'Environment: PRODUCTION (Klik untuk Pengaturan Kredensial)'
                : 'Environment: SIT / Sandbox (Klik untuk Pengaturan Kredensial)'
            }
            position="bottom"
            align="end"
          >
            <button
              type="button"
              className={`titlebar-credential-pill no-drag ${isProd ? 'is-prod' : 'is-sit'}`}
              onClick={onOpenSettings}
              aria-label="Pengaturan Kredensial Paylabs"
            >
              <span className={`status-dot ${isProd ? 'prod' : 'sit'}`} />
              <span className="env-label">{envText}</span>
              <Key size={12} style={{ opacity: 0.8 }} />
            </button>
          </Tooltip>
        )}
      </div>
    </header>
  );
};
