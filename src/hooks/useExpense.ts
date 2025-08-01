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

  useEffect(() => {
    loadExpenses();
  }, []);

  const loadExpenses = async () => {
    setLoading(true);
    try {
      const data = await fetchExpensesUseCase.execute();
      setExpenses(data.expenses);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Error al cargar ingresos');
    } finally {
      setLoading(false);
    }
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
    createExpense,
    updateExpense,
    reload: loadExpenses,
  };
}
