/**
 * @file AppTour.tsx
 * @description Komponen wrapper Driver.js untuk menjalankan tur onboarding interaktif
 *   "Take a Tour" pada aplikasi Paylabs VA. Mengelola lifecycle tour, navigasi antar
 *   tab halaman (Generate VA & Riwayat VA), menyimpan status ke localStorage, dan
 *   menyediakan styling bebas bayangan (zero-shadow) sesuai pedoman desktop Tauri.
 */

import { useEffect, useRef, useCallback } from 'react';
import { driver, type Driver } from 'driver.js';
import 'driver.js/dist/driver.css';
import './tourStyles.css';
import {
  TOUR_STEPS,
  TOUR_COMPLETED_STORAGE_KEY,
  type CustomDriveStep,
} from './tourSteps';
import type { ActiveTab } from '../layout/Sidebar';

export interface AppTourProps {
  /** Flag untuk memulai/menghentikan tour */
  isRunning: boolean;
  /** Callback dipanggil saat tour selesai atau di-skip */
  onTourEnd: () => void;
  /** Tab aktif saat ini di aplikasi */
  activeTab?: ActiveTab;
  /** Callback untuk berpindah tab secara terprogram */
  onNavigateTab?: (tab: ActiveTab) => void;
}

/**
 * Tandai tour sebagai telah diselesaikan di localStorage
 */
function markTourAsCompleted(): void {
  try {
    localStorage.setItem(TOUR_COMPLETED_STORAGE_KEY, 'true');
  } catch (storageError) {
    console.warn('[AppTour] Gagal menyimpan status tour ke localStorage:', storageError);
  }
}

/**
 * Periksa apakah user sudah pernah menyelesaikan tour
 * @returns true jika tour sudah pernah diselesaikan
 */
export function hasCompletedTour(): boolean {
  try {
    return localStorage.getItem(TOUR_COMPLETED_STORAGE_KEY) === 'true';
  } catch {
    return false;
  }
}

/**
 * Komponen onboarding tour interaktif menggunakan Driver.js.
 * Menampilkan highlight step-by-step pada elemen UI utama aplikasi
 * dengan dukungan navigasi otomatis lintas halaman (Generate VA & Riwayat VA).
 *
 * @param props.isRunning - Apakah tour sedang aktif
 * @param props.onTourEnd - Callback saat tour berakhir
 * @param props.activeTab - Tab aktif aplikasi saat ini
 * @param props.onNavigateTab - Callback navigasi tab
 */
export const AppTour: React.FC<AppTourProps> = ({
  isRunning,
  onTourEnd,
  activeTab = 'va-generator',
  onNavigateTab,
}) => {
  const driverRef = useRef<Driver | null>(null);
  const onNavigateTabRef = useRef(onNavigateTab);
  onNavigateTabRef.current = onNavigateTab;

  const activeTabRef = useRef(activeTab);
  activeTabRef.current = activeTab;

  const onTourEndRef = useRef(onTourEnd);
  onTourEndRef.current = onTourEnd;

  const handleTourDestroy = useCallback(() => {
    markTourAsCompleted();
    onTourEndRef.current();
  }, []);

  useEffect(() => {
    if (!isRunning) {
      if (driverRef.current) {
        driverRef.current.destroy();
        driverRef.current = null;
      }
      return;
    }

    /** Beri waktu DOM selesai render sebelum mulai tour */
    const startDelay = setTimeout(() => {
      const tourDriver = driver({
        showProgress: true,
        animate: true,
        smoothScroll: true,
        allowClose: true,
        stagePadding: 6,
        stageRadius: 8,
        popoverOffset: 10,
        waitForElement: 2000,
        popoverClass: 'paylabs-tour-popover',
        overlayColor: '#000000',
        overlayOpacity: 0.6,
        showButtons: ['next', 'previous', 'close'],
        nextBtnText: 'Lanjut →',
        prevBtnText: '← Kembali',
        doneBtnText: 'Selesai ✓',
        progressText: '{{current}} dari {{total}}',
        steps: TOUR_STEPS,
        onNextClick: (_element, _step, opts) => {
          const currentIndex = opts.driver.getActiveIndex() ?? opts.index ?? 0;
          const nextIndex = currentIndex + 1;

          if (nextIndex >= TOUR_STEPS.length) {
            handleTourDestroy();
            opts.driver.destroy();
            return;
          }

          const nextStep = TOUR_STEPS[nextIndex];
          if (
            nextStep?.targetTab &&
            nextStep.targetTab !== activeTabRef.current &&
            onNavigateTabRef.current
          ) {
            onNavigateTabRef.current(nextStep.targetTab);
            setTimeout(() => {
              opts.driver.moveTo(nextIndex);
            }, 150);
            return;
          }

          opts.driver.moveNext();
        },
        onPrevClick: (_element, _step, opts) => {
          const currentIndex = opts.driver.getActiveIndex() ?? opts.index ?? 0;
          const prevIndex = currentIndex - 1;

          if (prevIndex < 0) {
            return;
          }

          const prevStep = TOUR_STEPS[prevIndex];
          if (
            prevStep?.targetTab &&
            prevStep.targetTab !== activeTabRef.current &&
            onNavigateTabRef.current
          ) {
            onNavigateTabRef.current(prevStep.targetTab);
            setTimeout(() => {
              opts.driver.moveTo(prevIndex);
            }, 150);
            return;
          }

          opts.driver.movePrevious();
        },
        onHighlightStarted: (_element, step) => {
          const customStep = step as CustomDriveStep;
          if (
            customStep?.targetTab &&
            customStep.targetTab !== activeTabRef.current &&
            onNavigateTabRef.current
          ) {
            onNavigateTabRef.current(customStep.targetTab);
          }
        },
        onDestroyStarted: () => {
          handleTourDestroy();
          tourDriver.destroy();
        },
      });

      driverRef.current = tourDriver;
      tourDriver.drive();
    }, 350);

    return () => {
      clearTimeout(startDelay);
      if (driverRef.current) {
        driverRef.current.destroy();
        driverRef.current = null;
      }
    };
  }, [isRunning, handleTourDestroy]);

  /** Komponen ini tidak merender DOM sendiri — Driver.js memanipulasi DOM secara langsung */
  return null;
};
