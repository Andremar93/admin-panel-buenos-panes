import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { fetchExchangeRateUseCase } from '@/application/di/exchangeRateInstance';
import ExchangeRate from '@/domain/model/ExchangeRate';

type ExchangeRateContextValue = {
  /** Current rate displayed site-wide (today by default or last selected date) */
  currentRate: ExchangeRate | null;
  /** Date string (YYYY-MM-DD) for the current rate */
  currentDate: string | null;
  /** Load rate for a given date and set as current */
  loadRate: (date: string) => Promise<void>;
  /** Recently loaded rates by date (for "other days" list in popover) */
  recentRates: Map<string, ExchangeRate>;
  loading: boolean;
  error: string | null;
  clearError: () => void;
};

const ExchangeRateContext = createContext<ExchangeRateContextValue | null>(null);

function formatDateKey(d: Date | string): string {
  if (typeof d === 'string') return d.slice(0, 10);
  return d.toISOString().slice(0, 10);
}

export function ExchangeRateProvider({ children }: { children: React.ReactNode }) {
  const [currentRate, setCurrentRate] = useState<ExchangeRate | null>(null);
  const [currentDate, setCurrentDate] = useState<string | null>(null);
  const [recentRates, setRecentRates] = useState<Map<string, ExchangeRate>>(new Map());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadRate = useCallback(async (date: string) => {
    const normalized = date.slice(0, 10);
    setLoading(true);
    setError(null);
    try {
      const rate = await fetchExchangeRateUseCase.execute(normalized);
      const dateKey = formatDateKey(rate.date);
      setCurrentRate(rate);
      setCurrentDate(dateKey);
      setRecentRates((prev) => {
        const next = new Map(prev);
        next.set(dateKey, rate);
        return next;
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error al cargar la tasa';
      setError(msg);
      setCurrentRate(null);
      setCurrentDate(normalized);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const today = new Date().toISOString().slice(0, 10);
    loadRate(today);
  }, [loadRate]);

  const clearError = useCallback(() => setError(null), []);

  const value: ExchangeRateContextValue = {
    currentRate,
    currentDate,
    loadRate,
    recentRates,
    loading,
    error,
    clearError,
  };

  return (
    <ExchangeRateContext.Provider value={value}>
      {children}
    </ExchangeRateContext.Provider>
  );
}

export function useExchangeRateContext() {
  const ctx = useContext(ExchangeRateContext);
  if (!ctx) {
    throw new Error('useExchangeRateContext must be used within ExchangeRateProvider');
  }
  return ctx;
}

export function useExchangeRateContextOptional() {
  return useContext(ExchangeRateContext);
}
