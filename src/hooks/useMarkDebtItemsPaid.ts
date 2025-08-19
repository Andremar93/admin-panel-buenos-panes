import { useCallback, useState } from 'react';
import { markDebtItemsPaidUseCase } from '@/application/di/employeeInstance';

export interface MarkDebtItemsPaidRequest {
    debtId: string;
    itemIndexes: number[];
}

export function useMarkDebtItemsPaid() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const markItemsPaid = useCallback(async (request: MarkDebtItemsPaidRequest): Promise<void> => {
        setLoading(true);
        setError(null);
        try {
            await markDebtItemsPaidUseCase.execute(request);
        } catch (e: any) {
            const msg = e?.response?.data?.error || e?.message || 'Error al marcar items como pagados';
            setError(msg);
            throw e;
        } finally {
            setLoading(false);
        }
    }, []);

    const markMultipleItemsPaid = useCallback(async (requests: MarkDebtItemsPaidRequest[]): Promise<void> => {
        setLoading(true);
        setError(null);
        try {
            // Marcar items como pagados uno por uno
            for (const request of requests) {
                if (request.itemIndexes.length > 0) {
                    await markDebtItemsPaidUseCase.execute(request);
                }
            }
        } catch (e: any) {
            const msg = e?.response?.data?.error || e?.message || 'Error al marcar items como pagados';
            setError(msg);
            throw e;
        } finally {
            setLoading(false);
        }
    }, []);

    return { 
        markItemsPaid, 
        markMultipleItemsPaid,
        loading, 
        error, 
        clearError: () => setError(null) 
    };
}
