import { useCallback, useState } from 'react';
import { createEmployeesDebtUseCase } from '@/application/di/employeeInstance';
import type { CreateEmployeeDebtDTOType } from '@/presentation/dtos/employee/CreateEmployeeDebtDto';
import type { EmployeeDebt } from '@/domain/model/EmployeeDebt';

export function useEmployeeDebt() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [lastCreated, setLastCreated] = useState<EmployeeDebt | null>(null);

    const createDebt = useCallback(async (payload: CreateEmployeeDebtDTOType) => {
        setLoading(true);
        setError(null);
        try {
            const res = await createEmployeesDebtUseCase.execute(payload);
            setLastCreated(res);
            return res;
        } catch (e: any) {
            const msg = e?.response?.data?.error || e?.message || 'Error creating employee debt';
            setError(msg);
            throw e;
        } finally {
            setLoading(false);
        }
    }, []);

    return { createDebt, loading, error, lastCreated };
}
