import React, { useState, useRef, useEffect } from 'react';
import { useExchangeRateContextOptional } from '@/presentation/context/ExchangeRateContext';

function formatDateLabel(dateStr: string): string {
  const d = new Date(dateStr + 'T12:00:00');
  const today = new Date();
  const isToday =
    d.getFullYear() === today.getFullYear() &&
    d.getMonth() === today.getMonth() &&
    d.getDate() === today.getDate();
  if (isToday) return 'Hoy';
  return d.toLocaleDateString('es-ES', { weekday: 'short', day: 'numeric', month: 'short' });
}

export function ExchangeRateBubble() {
  const ctx = useExchangeRateContextOptional();
  const [open, setOpen] = useState(false);
  const [pickerDate, setPickerDate] = useState(() =>
    new Date().toISOString().slice(0, 10)
  );
  const [loadingPicker, setLoadingPicker] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open]);

  if (!ctx) return null;

  const { currentRate, currentDate, loadRate, recentRates, loading, error, clearError } = ctx;

  const handleLoadDate = async () => {
    setLoadingPicker(true);
    try {
      await loadRate(pickerDate);
    } finally {
      setLoadingPicker(false);
    }
  };

  const recentEntries = Array.from(recentRates.entries())
    .sort(([a], [b]) => b.localeCompare(a))
    .slice(0, 7);

  return (
    <div className="fixed bottom-6 right-6 z-50" ref={popoverRef}>
      <button
        type="button"
        onClick={() => {
          setOpen((o) => !o);
          if (error) clearError();
        }}
        className="flex items-center gap-2 rounded-full bg-blue-600 text-white shadow-lg hover:bg-blue-700 transition-colors px-4 py-2.5 min-w-[140px] justify-center"
        title="Ver tasa de cambio"
      >
        {loading && !currentRate ? (
          <span className="text-sm">Cargando…</span>
        ) : currentRate ? (
          <>
            <span className="text-lg font-semibold">
              {Number(currentRate.rate).toLocaleString('es-VE', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 4,
              })}
            </span>
            <span className="text-xs opacity-90">Bs/USD</span>
          </>
        ) : (
          <span className="text-sm">Tasa no disponible</span>
        )}
        <svg
          className={`w-4 h-4 transition-transform ${open ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div className="absolute bottom-full right-0 mb-2 w-80 rounded-xl bg-white border border-gray-200 shadow-xl overflow-hidden">
          <div className="p-4 border-b border-gray-100 bg-gray-50">
            <h3 className="text-sm font-semibold text-gray-800">Tasa de cambio</h3>
            {currentRate && currentDate && (
              <p className="text-xs text-gray-500 mt-0.5">
                {formatDateLabel(currentDate)} · 1 USD ={' '}
                <strong className="text-gray-700">
                  {Number(currentRate.rate).toLocaleString('es-VE', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 4,
                  })}{' '}
                  Bs
                </strong>
              </p>
            )}
          </div>

          <div className="p-4 space-y-4">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Ver tasa de otra fecha
              </label>
              <div className="flex gap-2">
                <input
                  type="date"
                  value={pickerDate}
                  onChange={(e) => setPickerDate(e.target.value)}
                  className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm"
                />
                <button
                  type="button"
                  onClick={handleLoadDate}
                  disabled={loadingPicker}
                  className="rounded-lg bg-blue-600 text-white px-3 py-2 text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
                >
                  {loadingPicker ? '…' : 'Cargar'}
                </button>
              </div>
            </div>

            {error && (
              <p className="text-xs text-red-600 bg-red-50 rounded-lg px-3 py-2">{error}</p>
            )}

            {recentEntries.length > 0 && (
              <div>
                <p className="text-xs font-medium text-gray-600 mb-2">Tasas recientes</p>
                <ul className="space-y-1 max-h-40 overflow-y-auto">
                  {recentEntries.map(([dateKey, rate]) => (
                    <li key={dateKey}>
                      <button
                        type="button"
                        onClick={() => {
                          setPickerDate(dateKey);
                          loadRate(dateKey);
                        }}
                        className="w-full text-left flex justify-between items-center rounded-lg px-3 py-2 text-sm hover:bg-gray-50 border border-transparent hover:border-gray-200"
                      >
                        <span className="text-gray-600">{formatDateLabel(dateKey)}</span>
                        <span className="font-medium text-gray-900">
                          {Number(rate.rate).toLocaleString('es-VE', {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 4,
                          })}{' '}
                          Bs
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
