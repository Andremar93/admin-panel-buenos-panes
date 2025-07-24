import { Expense } from '@/domain/model/Expense';
import { ExpenseFromInvoice } from '@/domain/model/ExpenseFromInvoice'
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

  async updateExpense(expense: Expense, id: String): Promise<Expense> {
    const res = await api.put(`/expenses/${id}`, expense);
    return res.data.expense;
  },

  async fetchExpenses(): Promise<Expense[]> {
    const res = await api.get('/expenses/get');
    return res.data;
  },
};
