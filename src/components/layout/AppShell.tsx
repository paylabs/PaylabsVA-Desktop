/**
 * @file AppShell.tsx
 * @description Komponen layout container utama desktop window bergaya macOS native untuk Paylabs VA Suite.
 */

import React, { useState, useEffect, useCallback } from 'react';
import { RefreshCw, CheckCircle2, ArrowDownCircle } from 'lucide-react';
import { useWindowState } from '../../hooks/useWindowState';
import { useTheme } from '../../hooks/useTheme';
import { useToast } from '../../hooks/useToast';
import { usePaylabs } from '../../hooks/usePaylabs';
import { AdaptiveTitlebar } from '../chrome/AdaptiveTitlebar';
import { Sidebar, ActiveTab } from './Sidebar';
import { MacCommandPalette } from '../macos/MacCommandPalette';
import { VaGeneratorView } from '../paylabs/VaGeneratorView';
import { VaHistoryView } from '../paylabs/VaHistoryView';
import { PaylabsSettingsModal } from '../paylabs/PaylabsSettingsModal';
import { UserManualView } from '../manual/UserManualView';
import { AppTour } from '../tour/AppTour';
import { ToastContainer } from '../ui/Toast';
import { useAppUpdater } from '../../hooks/useAppUpdater';
import { UpdateNotificationBanner } from '../updater/UpdateNotificationBanner';

/**
 * Shell utama aplikasi desktop Tauri (macOS Native Profile)
 */
export const AppShell: React.FC = () => {
  const { isMaximized, handleClose, handleMinimize, handleToggleMaximize } = useWindowState();
  const { theme, toggleTheme } = useTheme();
  const { status, refreshStatus, history, refreshHistory } = usePaylabs();

  const [activeTab, setActiveTab] = useState<ActiveTab>('va-generator');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isTourRunning, setIsTourRunning] = useState(false);
  const [selectedHistoryRecord, setSelectedHistoryRecord] = useState<any>(null);
  const { toasts, showToast, dismissToast } = useToast();
  const updater = useAppUpdater();

  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, []);

  // Sinkronisasi data riwayat transaksi saat Command Palette dibuka
  useEffect(() => {
    if (isCommandPaletteOpen) {
      refreshHistory();
    }
  }, [isCommandPaletteOpen, refreshHistory]);

  const containerClasses = [
    'desktop-window-container',
    'macos',
    isMaximized ? 'is-maximized' : '',
  ]
    .filter(Boolean)
    .join(' ');

  const pageTitle =
    activeTab === 'static-va'
      ? 'Generate Static Virtual Account'
      : activeTab === 'va-generator'
        ? 'Generate Dynamic Virtual Account'
        : activeTab === 'va-history'
          ? 'Riwayat Virtual Account'
          : 'Panduan Pengguna';

  const handleTourEnd = useCallback(() => {
    setIsTourRunning(false);
  }, []);

  return (
    <div id="desktop-window-canvas" className={containerClasses}>
      {/* Titlebar macOS Native dengan Tombol Kredensial */}
      <AdaptiveTitlebar
        platform="macos"
        isMaximized={isMaximized}
        title={pageTitle}
        theme={theme}
        status={status}
        onClose={handleClose}
        onMinimize={handleMinimize}
        onToggleMaximize={handleToggleMaximize}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onToggleTheme={toggleTheme}
        onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
      />

      {/* Workspace Area: Sidebar & Konten Utama */}
      <div
        id="workspace-canvas"
        className="workspace-container"
        style={{ display: 'flex', flex: 1, overflow: 'hidden', minHeight: 0, position: 'relative' }}
      >
        <Sidebar
          activeTab={activeTab}
          onSelectTab={setActiveTab}
          isCollapsed={isSidebarCollapsed}
          onToggleCollapse={() => setIsSidebarCollapsed((prev) => !prev)}
          onStartTour={() => {
            /** Pastikan user di halaman VA Generator agar step tour bank selector, dll. terlihat */
            setActiveTab('va-generator');
            setIsTourRunning(true);
          }}
        />

        {activeTab === 'static-va' ? (
          <main className="main-content-scroll va-generator-main">
            <VaGeneratorView
              mode="static"
              onShowToast={showToast}
              onOpenSettings={() => setIsSettingsOpen(true)}
              onVaCreated={refreshHistory}
            />
          </main>
        ) : activeTab === 'va-generator' ? (
          <main className="main-content-scroll va-generator-main">
            <VaGeneratorView
              mode="dynamic"
              onShowToast={showToast}
              onOpenSettings={() => setIsSettingsOpen(true)}
              onVaCreated={refreshHistory}
            />
          </main>
        ) : activeTab === 'va-history' ? (
          <main className="main-content-scroll va-history-main">
            <VaHistoryView
              onShowToast={showToast}
              selectedRecordFromPalette={selectedHistoryRecord}
              onClearSelectedRecordFromPalette={() => setSelectedHistoryRecord(null)}
            />
          </main>
        ) : (
          <main className="main-content-scroll">
            <UserManualView />
          </main>
        )}
      </div>

      {/* Status Bar Desktop Bawah */}
      <footer className="status-bar-container">
        <div className="status-bar-info">
          <span>Environment: <strong style={{ color: status?.production ? '#ef4444' : '#6366f1' }}>{status?.environment || 'SIT'}</strong></span>
          <span>Base URL: <strong style={{ color: 'var(--text-secondary)' }}>{status?.baseUrl || '-'}</strong></span>
          <span>Theme: <strong style={{ color: 'var(--text-secondary)', textTransform: 'capitalize' }}>{theme}</strong></span>
        </div>
        <div
          id="status-bar-updater"
          className="status-bar-updater-pill"
          onClick={() => {
            if (updater.status === 'ready') {
              updater.applyUpdateAndRelaunch();
            } else if (updater.status === 'available') {
              updater.startDownloadAndInstall();
            } else {
              updater.checkForUpdates(false);
            }
          }}
          title="Klik untuk memeriksa pembaruan rilis via GitHub Releases"
          style={{
            flexShrink: 0,
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            cursor: 'pointer',
            padding: '2px 8px',
            borderRadius: 4,
            transition: 'background 0.15s ease',
          }}
        >
          {updater.status === 'checking' ? (
            <>
              <RefreshCw size={11} style={{ animation: 'spin 1s linear infinite', color: 'var(--accent-primary)' }} />
              <span>Memeriksa pembaruan...</span>
            </>
          ) : updater.status === 'available' ? (
            <>
              <ArrowDownCircle size={11} style={{ color: 'var(--accent-primary)' }} />
              <strong style={{ color: 'var(--accent-primary)' }}>
                Update v{updater.updateInfo?.version || 'Baru'} Tersedia (Klik Pasang)
              </strong>
            </>
          ) : updater.status === 'downloading' ? (
            <>
              <RefreshCw size={11} style={{ animation: 'spin 1s linear infinite', color: 'var(--primary, #059669)' }} />
              <span>Mengunduh: {updater.downloadProgress}%</span>
            </>
          ) : updater.status === 'ready' ? (
            <>
              <CheckCircle2 size={11} style={{ color: '#10b981' }} />
              <strong style={{ color: '#10b981' }}>Mulai Ulang (v{updater.updateInfo?.version})</strong>
            </>
          ) : (
            <>
              <CheckCircle2 size={11} style={{ color: '#10b981' }} />
              <span>Paylabs VA Desktop (v0.1.3)</span>
            </>
          )}
        </div>
      </footer>

      {/* Toast Notification Layer */}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />

      {/* Auto-Update Apple HIG Notification Banner Layer */}
      <UpdateNotificationBanner
        status={updater.status}
        updateInfo={updater.updateInfo}
        progress={updater.downloadProgress}
        errorMessage={updater.errorMessage}
        isVisible={updater.isBannerVisible}
        onDismiss={updater.dismissBanner}
        onStartDownload={updater.startDownloadAndInstall}
        onRelaunch={updater.applyUpdateAndRelaunch}
      />

      {/* Modal Pengaturan Kredensial Global */}
      <PaylabsSettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        onSaved={() => {
          refreshStatus();
          showToast('Kredensial Tersimpan', 'Pengaturan Paylabs berhasil diperbarui', 'success');
        }}
      />

      {/* macOS Spotlight Command Palette Modal */}
      <MacCommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        onSelectTab={setActiveTab}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onToggleTheme={toggleTheme}
        history={history}
        onSelectHistoryRecord={(rec) => setSelectedHistoryRecord(rec)}
      />

      {/* In-App Onboarding Tour (Driver.js) */}
      <AppTour
        isRunning={isTourRunning}
        onTourEnd={handleTourEnd}
        activeTab={activeTab}
        onNavigateTab={setActiveTab}
      />
    </div>
  );
};

