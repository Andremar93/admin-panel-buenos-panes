import { Expense } from '@/domain/model/Expense';
import { ExpenseFromInvoice } from '@/domain/model/ExpenseFromInvoice';
import { UpdateExpenseDTOType } from '@/presentation/dtos/expense/UpdateExpenseDto';
import api from '@/config/api';

export const ExpenseAPI = {
  async createExpense(expense: Expense): Promise<Expense> {
    const res = await api.post('/expenses/create', expense);
    return res.data.expense;
  },

  async createExpenseByInvoice(
    expenseFromInvoice: ExpenseFromInvoice
  ): Promise<Expense> {
    const res = await api.post(
      '/expenses/create-by-invoice',
      expenseFromInvoice
    );
    return res.data.expense;
  },

  async updateExpense(
    id: String,
    expense: UpdateExpenseDTOType
  ): Promise<Expense> {
    const res = await api.put(`/expenses/${id}`, expense);
    console.log(res)
    return res.data.expense;
  },

  async fetchExpenses(filters?: {
    startDate?: string;
    finishDate?: string;
  }): Promise<Expense[]> {
    const res = await api.post('/expenses/get', filters || {});
    return res.data.expenses;
  },
};
