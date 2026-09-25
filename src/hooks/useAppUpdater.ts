/**
 * @file useAppUpdater.ts
 * @description Hook React untuk mengelola pemeriksaan pembaruan otomatis (Auto-Update),
 * pengunduhan paket dengan progress, verifikasi tanda tangan Ed25519, dan restart aplikasi.
 */

import { useState, useCallback, useEffect, useRef } from 'react';

export type UpdateStatus =
  | 'idle'
  | 'checking'
  | 'available'
  | 'downloading'
  | 'ready'
  | 'up-to-date'
  | 'error';

export interface UpdateInfo {
  version: string;
  notes?: string;
  date?: string;
}

export function useAppUpdater() {
  const [status, setStatus] = useState<UpdateStatus>('idle');
  const [updateInfo, setUpdateInfo] = useState<UpdateInfo | null>(null);
  const [downloadProgress, setDownloadProgress] = useState<number>(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isBannerVisible, setIsBannerVisible] = useState<boolean>(false);
  const updateHandleRef = useRef<any>(null);

  /**
   * Memeriksa pembaruan rilis dari GitHub Releases
   * @param _silent - Jika true, mode silent (diabaikan/disiapkan untuk notifikasi background)
   */
  const checkForUpdates = useCallback(async (_silent = false) => {
    setStatus('checking');
    setErrorMessage(null);

    try {
      // Import dinamis untuk mendukung environment browser/testing
      const { check } = await import('@tauri-apps/plugin-updater');
      const update = await check();

      if (update) {
        updateHandleRef.current = update;
        setUpdateInfo({
          version: update.version,
          notes: update.body || undefined,
          date: update.date || undefined,
        });
        setStatus('available');
        setIsBannerVisible(true);
      } else {
        updateHandleRef.current = null;
        setUpdateInfo(null);
        setStatus('up-to-date');
        setIsBannerVisible(false);
      }
    } catch (err: any) {
      const rawMessage = err?.message || String(err);
      const isMissingManifest =
        rawMessage.includes('Could not fetch a valid release JSON') ||
        rawMessage.includes('404') ||
        rawMessage.includes('status code 404');

      if (isMissingManifest) {
        // Belum ada file latest.json di GitHub Releases (misal rilis v0.1.2 belum di-deploy CI/CD)
        updateHandleRef.current = null;
        setUpdateInfo(null);
        setStatus('up-to-date');
        setIsBannerVisible(false);
      } else {
        setErrorMessage(rawMessage);
        setStatus('error');
        // Jangan ganggu layar pengguna dengan banner jika hanya gagal cek rilis
        setIsBannerVisible(false);
      }
    }
  }, []);

  /**
   * Mengunduh paket installer dan memasang pembaruan dengan tracking progress
   */
  const startDownloadAndInstall = useCallback(async () => {
    if (!updateHandleRef.current) {
      setErrorMessage('Tidak ada pembaruan aktif untuk diunduh');
      setStatus('error');
      return;
    }

    try {
      setStatus('downloading');
      setDownloadProgress(0);

      let totalBytes = 0;
      let downloadedBytes = 0;

      await updateHandleRef.current.downloadAndInstall((event: any) => {
        if (!event) return;
        if (event.event === 'Started' && event.data?.contentLength) {
          totalBytes = event.data.contentLength;
        } else if (event.event === 'Progress' && event.data?.chunkLength) {
          downloadedBytes += event.data.chunkLength;
          if (totalBytes > 0) {
            const percent = Math.min(100, Math.round((downloadedBytes / totalBytes) * 100));
            setDownloadProgress(percent);
          }
        } else if (event.event === 'Finished') {
          setDownloadProgress(100);
        }
      });

      setStatus('ready');
      setDownloadProgress(100);
    } catch (err: any) {
      setErrorMessage(`Gagal mengunduh pembaruan: ${err?.message || err}`);
      setStatus('error');
    }
  }, []);

  /**
   * Me-restart aplikasi untuk menerapkan rilis baru
   */
  const applyUpdateAndRelaunch = useCallback(async () => {
    try {
      const { relaunch } = await import('@tauri-apps/plugin-process');
      await relaunch();
    } catch (err: any) {
      setErrorMessage(`Gagal me-relaunch aplikasi: ${err?.message || err}`);
      setStatus('error');
    }
  }, []);

  /**
   * Menutup banner notifikasi
   */
  const dismissBanner = useCallback(() => {
    setIsBannerVisible(false);
  }, []);

  // Jalankan silent check saat pertama kali aplikasi dibuka
  useEffect(() => {
    const timer = setTimeout(() => {
      checkForUpdates(true);
    }, 2500);

    return () => clearTimeout(timer);
  }, [checkForUpdates]);

  return {
    status,
    updateInfo,
    downloadProgress,
    errorMessage,
    isBannerVisible,
    checkForUpdates,
    startDownloadAndInstall,
    applyUpdateAndRelaunch,
    dismissBanner,
  };
}
