import { useState, useEffect } from 'react';
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

  useEffect(() => {
    console.log('LOADING INCOME')
    loadIncomes();
  }, []);

  const loadIncomes = async (filters?: {
    startDate?: string;
    finishDate?: string;
  }) => {
    setLoading(true);
    try {
      const data = await fetchIncomesUseCase.execute(filters);
      setIncomes(data.incomes);
      setFilterRange({ from: data.from, to: data.to });
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Error al cargar ingresos');
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = (startDate: string, finishDate: string) => {
    loadIncomes({ startDate, finishDate });
  };

  const createIncome = async (dto: CreateIncomeDTOType) => {
    try {
      const created = await createIncomeUseCase.execute(dto);
      console.log('created', created);
      setIncomes((prev) => [created, ...prev]);
    } catch (err: any) {
      console.log('errfrom useincome');
      setError(err.message);
      throw err;
    }
  };

  const updateIncome = async (
    income: UpdateIncomeDTOType,
    incomeId: String
  ) => {
    const updated = await updateIncomeUseCase.execute(income, incomeId);

    setIncomes((prev) =>
      prev.map((inv) =>
        String(inv._id) === String(updated._id) ? updated : inv
      )
    );

    return updated;
  };

  return {
    incomes,
    loading,
    error,
    filterRange,
    createIncome,
    updateIncome,
    applyFilters,
    reload: loadIncomes,
  };
}
