/**
 * @file Tooltip.tsx
 * @description Komponen Custom Tooltip desktop yang adaptif terhadap radius tema dan mendukung shortcut hint.
 */

import React, { useState, useRef, useEffect, useCallback } from 'react';

export type TooltipPosition = 'top' | 'bottom' | 'left' | 'right';
export type TooltipAlign = 'start' | 'center' | 'end';

export interface TooltipProps {
  content: string;
  shortcut?: string;
  position?: TooltipPosition;
  align?: TooltipAlign;
  delay?: number;
  children: React.ReactElement;
}

/**
 * Komponen pembungkus Tooltip Desktop dengan fitur anti-terpotong dan auto-dismiss saat scroll.
 */
export const Tooltip: React.FC<TooltipProps> = ({
  content,
  shortcut,
  position = 'bottom',
  align = 'center',
  delay = 50,
  children,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isScrollingRef = useRef<boolean>(false);
  const scrollTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const show = useCallback(() => {
    // Batalkan pemunculan jika pengguna sedang aktif scrolling
    if (isScrollingRef.current) return;
    timerRef.current = setTimeout(() => {
      if (!isScrollingRef.current) {
        setIsVisible(true);
      }
    }, delay);
  }, [delay]);

  const hide = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    setIsVisible(false);
  }, []);

  // Tangani event scrolling global untuk mencegah tooltip muncul atau memutus gesture scroll
  useEffect(() => {
    const handleScrollOrWheel = () => {
      isScrollingRef.current = true;
      hide();

      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
      scrollTimeoutRef.current = setTimeout(() => {
        isScrollingRef.current = false;
      }, 150);
    };

    window.addEventListener('wheel', handleScrollOrWheel, { passive: true });
    window.addEventListener('scroll', handleScrollOrWheel, { passive: true, capture: true });

    return () => {
      if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
      window.removeEventListener('wheel', handleScrollOrWheel);
      window.removeEventListener('scroll', handleScrollOrWheel, { capture: true });
    };
  }, [hide]);

  return (
    <div
      className="desktop-tooltip-container"
      onMouseEnter={show}
      onMouseLeave={hide}
      onClickCapture={hide}
      onWheel={hide}
    >
      {children}
      {isVisible && (
        <div
          role="tooltip"
          className={`desktop-tooltip-popup pos-${position} align-${align}`}
          data-testid="desktop-tooltip-popup"
        >
          <span>{content}</span>
          {shortcut && <span className="macos-kbd">{shortcut}</span>}
        </div>
      )}
    </div>
  );
};
