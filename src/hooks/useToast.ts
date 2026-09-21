/**
 * @file useToast.ts
 * @description Hook React untuk memicu dan mengelola tumpukan Toast Notification.
 */

import { useState, useCallback } from 'react';
import { ToastItem, ToastType } from '../components/ui/Toast';

export function useToast() {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const showToast = useCallback((title: string, message?: string, type: ToastType = 'success') => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    const newToast: ToastItem = { id, title, message, type };

    setToasts((prev) => [...prev, newToast]);

    // Hapus otomatis setelah 3 detik
    setTimeout(() => {
      setToasts((current) => current.filter((t) => t.id !== id));
    }, 3200);
  }, []);

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return { toasts, showToast, dismissToast };
}
