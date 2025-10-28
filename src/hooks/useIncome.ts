import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { Income } from '@/domain/model/Income';
import {
  CreateIncomeDTO,
  CreateIncomeDTOType,
} from '@/presentation/dtos/income/createIncomeDto';
import {
  UpdateIncomeDTO,
  UpdateIncomeDTOType,
} from '@/presentation/dtos/income/UpdateIncomeDto';
import {
  createIncomeUseCase,
  fetchIncomesUseCase,
  updateIncomeUseCase,
} from '@/application/di/incomeInstances';

export function useIncome() {
  const [incomes, setIncomes] = useState<Income[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterRange, setFilterRange] = useState<{ from: string; to: string }>({
    from: '',
    to: '',
  });
  const hasLoadedRef = useRef(false);

  // Memoizar la función de carga para evitar recreaciones
  const loadIncomes = useCallback(async (filters?: {
    startDate?: string;
    finishDate?: string;
  }) => {
    setLoading(true);
    try {
      const data = await fetchIncomesUseCase.execute(filters);
      setIncomes(data.incomes);
      setFilterRange({ from: data.from, to: data.to });
      setError(null);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Error al cargar ingresos';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  // Memoizar la función de filtros
  const applyFilters = useCallback((startDate: string, finishDate: string) => {
    loadIncomes({ startDate, finishDate });
  }, [loadIncomes]);

  // Memoizar la función de creación
  const createIncome = useCallback(async (dto: CreateIncomeDTOType) => {
    try {
      const created = await createIncomeUseCase.execute(dto);
      setIncomes((prev) => [created, ...prev]);
      return created;
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Error al crear ingreso';
      setError(errorMessage);
      throw err;
    }
  }, []);

  // Memoizar la función de actualización
  const updateIncome = useCallback(async (
    income: UpdateIncomeDTOType,
    incomeId: String
  ) => {
    try {
      const updated = await updateIncomeUseCase.execute(income, incomeId);
      setIncomes((prev) =>
        prev.map((inv) =>
          String(inv._id) === String(updated._id) ? updated : inv
        )
      );
      return updated;
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Error al actualizar ingreso';
      setError(errorMessage);
      throw err;
    }
  }, []);

  // Memoizar el estado de filtros aplicados
  const filteredIncomes = useMemo(() => {
    if (!filterRange.from || !filterRange.to) return incomes;
    return incomes.filter(income => {
      const incomeDate = new Date(income.date);
      const fromDate = new Date(filterRange.from);
      const toDate = new Date(filterRange.to);
      return incomeDate >= fromDate && incomeDate <= toDate;
    });
  }, [incomes, filterRange]);

  // Cargar ingresos al montar el componente
  useEffect(() => {
    if (!hasLoadedRef.current) {
      hasLoadedRef.current = true;
      loadIncomes();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    incomes: filteredIncomes,
    allIncomes: incomes,
    loading,
    error,
    filterRange,
    createIncome,
    updateIncome,
    applyFilters,
    reload: loadIncomes,
    clearError: () => setError(null),
  };
}
