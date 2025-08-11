import { useState, useCallback } from 'react';
import { fetchExchangeRateUseCase } from '@/application/di/exchangeRateInstance';
import ExchangeRate from '@/domain/model/ExchangeRate';

export function useExchangeRate() {
    const [exchangeRate, setExchangeRate] = useState<ExchangeRate | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Memoizar la función de obtención de tasa de cambio
    const getExchangeRate = useCallback(async (date: string) => {
        setLoading(true);
        try {
            const rate = await fetchExchangeRateUseCase.execute(date);
            if (rate) {
                setError(null);
                setExchangeRate(rate);
            } else {
                setExchangeRate(null);
                setError(`No se encontró tasa para la fecha ${date}`);
            }
        } catch (err: unknown) {
            setExchangeRate(null);
            const errorMessage = err instanceof Error ? err.message : `Error al cargar la tasa del día: ${date}`;
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    }, []);

    return {
        exchangeRate,
        getExchangeRate,
        loading,
        error,
        clearError: () => setError(null),
    };
}
