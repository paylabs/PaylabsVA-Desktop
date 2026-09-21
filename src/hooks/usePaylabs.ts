/**
 * @file usePaylabs.ts
 * @description Custom React hook untuk manajemen state transaksi Paylabs VA, status kredensial, dan riwayat.
 */

import { useState, useEffect, useCallback } from 'react';
import {
  Channel,
  CreateVaFormInput,
  Exchange,
  HistoryRecord,
  Status,
} from '../types/paylabs';
import {
  clearPaylabsHistory,
  createVirtualAccount,
  getPaylabsChannels,
  getPaylabsHistory,
  getPaylabsStatus,
} from '../services/paylabsService';

export interface UsePaylabsReturn {
  status: Status | null;
  channels: Channel[];
  history: HistoryRecord[];
  isSubmitting: boolean;
  isLoadingHistory: boolean;
  lastExchange: Exchange | null;
  refreshStatus: () => Promise<void>;
  refreshHistory: () => Promise<void>;
  submitCreateVa: (form: CreateVaFormInput) => Promise<Exchange>;
  handleClearHistory: () => Promise<void>;
  clearLastExchange: () => void;
}

/**
 * Hook pengelola siklus hidup data Paylabs
 */
export function usePaylabs(): UsePaylabsReturn {
  const [status, setStatus] = useState<Status | null>(null);
  const [channels, setChannels] = useState<Channel[]>([]);
  const [history, setHistory] = useState<HistoryRecord[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const [lastExchange, setLastExchange] = useState<Exchange | null>(null);

  const refreshStatus = useCallback(async () => {
    try {
      const s = await getPaylabsStatus();
      setStatus(s);
    } catch (e) {
      console.error('[usePaylabs] Gagal memuat status:', e);
    }
  }, []);

  const refreshHistory = useCallback(async () => {
    setIsLoadingHistory(true);
    try {
      const records = await getPaylabsHistory();
      setHistory(records);
    } catch (e) {
      console.error('[usePaylabs] Gagal memuat riwayat:', e);
    } finally {
      setIsLoadingHistory(false);
    }
  }, []);

  useEffect(() => {
    refreshStatus();
    getPaylabsChannels().then(setChannels).catch(console.error);
    refreshHistory();
  }, [refreshStatus, refreshHistory]);

  const submitCreateVa = async (form: CreateVaFormInput): Promise<Exchange> => {
    setIsSubmitting(true);
    try {
      const ex = await createVirtualAccount(form);
      setLastExchange(ex);
      if (ex.success) {
        await refreshHistory();
      }
      return ex;
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClearHistory = async () => {
    await clearPaylabsHistory();
    await refreshHistory();
  };

  return {
    status,
    channels,
    history,
    isSubmitting,
    isLoadingHistory,
    lastExchange,
    refreshStatus,
    refreshHistory,
    submitCreateVa,
    handleClearHistory,
    clearLastExchange: () => setLastExchange(null),
  };
}
