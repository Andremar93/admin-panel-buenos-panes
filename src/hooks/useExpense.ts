import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { Expense } from '@/domain/model/Expense';
import { CreateExpenseDTOType } from '@/presentation/dtos/expense/CreateExpenseDto';
import { UpdateExpenseDTOType } from '@/presentation/dtos/expense/UpdateExpenseDto';
import { toAppError, getErrorMessage } from '@/types/errors';

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
  const hasLoadedRef = useRef(false);

  // Memoizar la función de carga para evitar recreaciones
  const loadExpenses = useCallback(async (filters?: {
    startDate?: string;
    finishDate?: string;
  }) => {
    setLoading(true);
    try {
      const data = await fetchExpensesUseCase.execute(filters);
      setExpenses(data.expenses);
      // Si no hay filtros, establecer el rango por defecto
      if (!filters?.startDate || !filters?.finishDate) {
        const today = new Date();
        const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
        setFilterRange({ 
          from: firstDay.toISOString().split('T')[0], 
          to: today.toISOString().split('T')[0] 
        });
      } else {
        setFilterRange({ from: filters.startDate, to: filters.finishDate });
      }
      setError(null);
    } catch (err: unknown) {
      const appError = toAppError(err);
      const errorMessage = getErrorMessage(appError);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  // Memoizar la función de filtros
  const applyFilters = useCallback((startDate: string, finishDate: string) => {
    loadExpenses({ startDate, finishDate });
  }, [loadExpenses]);

  // Memoizar la función de creación
  const createExpense = useCallback(async (dto: CreateExpenseDTOType) => {
    try {
      const created = await createExpenseUseCase.execute(dto);
      setExpenses((prev) => [created, ...prev]);
      return created;
    } catch (err: unknown) {
      const appError = toAppError(err);
      const errorMessage = getErrorMessage(appError);
      setError(errorMessage);
      throw err;
    }
  }, []);

  // Memoizar la función de actualización
  const updateExpense = useCallback(async (expense: UpdateExpenseDTOType) => {
    try {
      const updated = await updateExpenseUseCase.execute(expense);
      setExpenses((prev) =>
        prev.map((inv) => (inv._id === updated._id ? updated : inv))
      );
      return updated;
    } catch (err: unknown) {
      const appError = toAppError(err);
      const errorMessage = getErrorMessage(appError);
      setError(errorMessage);
      throw err;
    }
  }, []);

  // Memoizar el estado de filtros aplicados
  const filteredExpenses = useMemo(() => {
    if (!filterRange.from || !filterRange.to) return expenses;
    return expenses.filter(expense => {
      const expenseDate = new Date(expense.date);
      const fromDate = new Date(filterRange.from);
      const toDate = new Date(filterRange.to);
      return expenseDate >= fromDate && expenseDate <= toDate;
    });
  }, [expenses, filterRange]);

  // Cargar gastos al montar el componente
  useEffect(() => {
    if (!hasLoadedRef.current) {
      hasLoadedRef.current = true;
      loadExpenses();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    expenses: filteredExpenses,
    allExpenses: expenses,
    loading,
    error,
    filterRange,
    createExpense,
    updateExpense,
    applyFilters,
    reload: loadExpenses,
    clearError: () => setError(null),
  };
}
