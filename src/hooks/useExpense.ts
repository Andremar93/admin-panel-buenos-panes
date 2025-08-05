import { ExpenseAPI } from '@/data/api/ExpenseAPI';
import { useState, useEffect } from 'react';
import { Expense } from '@/domain/model/Expense';
import { CreateExpenseDTOType } from '@/presentation/dtos/expense/CreateExpenseDto';
import { UpdateExpenseDTOType } from '@/presentation/dtos/expense/UpdateExpenseDto';

import {
  createExpenseUseCase,
  fetchExpensesUseCase,
  updateExpenseUseCase,
} from '@/application/di/expenseInstances';

export function useExpense() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterRange, setFilterRange] = useState<{ from: string; to: string }>({
    from: '',
    to: '',
  });

  useEffect(() => {
    loadExpenses();
  }, []);

  const loadExpenses = async (filters?: {
    startDate?: string;
    finishDate?: string;
  }) => {
    setLoading(true);
    try {
      const data = await fetchExpensesUseCase.execute(filters);
      setExpenses(data.expenses);
      setFilterRange({ from: data.from, to: data.to });
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Error al cargar gastos');
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = (startDate: string, finishDate: string) => {
    loadExpenses({ startDate, finishDate });
  };

  const createExpense = async (dto: CreateExpenseDTOType) => {
    try {
      const created = await createExpenseUseCase.execute(dto);
      console.log('created from expense', created);
      setExpenses((prev) => [created, ...prev]);
    } catch (err: any) {
      console.log('errfrom useExpense');
      setError(err.message);
      throw err;
    }
  };

  const updateExpense = async (expense: UpdateExpenseDTOType) => {
    const updated = await updateExpenseUseCase.execute(expense);
    console.log(`Updated: ${updated}`);
    setExpenses((prev) =>
      prev.map((inv) => (inv._id === updated._id ? updated : inv))
    );
    return updated;
  };

  return {
    expenses,
    loading,
    error,
    filterRange,
    createExpense,
    updateExpense,
    applyFilters,
    reload: loadExpenses,
  };
}
