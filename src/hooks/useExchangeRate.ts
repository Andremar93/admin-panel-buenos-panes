import { useState } from 'react';
import { fetchExchangeRateUseCase } from '@/application/di/exchangeRateInstance';
import ExchangeRate from '@/domain/model/ExchangeRate';

export function useExchangeRate() {
    const [exchangeRate, setExchangeRate] = useState<ExchangeRate | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const getExchangeRate = async (date: string) => {
        setLoading(true);
        try {
            const rate = await fetchExchangeRateUseCase.execute(date);
            console.log(rate, 'fromuse')
            // Suponiendo que la API retorna un array de tasas, tomamos la primera
            if (rate) {
                setError(null);
                setExchangeRate(rate);

            } else {
                setExchangeRate(null);
                setError(`No se encontró tasa para la fecha ${date}`);
            }

        } catch (err: any) {
            setExchangeRate(null);
            setError(err.message || `Error al cargar la tasa del día: ${date}`);
        } finally {
            setLoading(false);
        }
    };

    return {
        exchangeRate,
        getExchangeRate,
        loading,
        error,
    };
}
