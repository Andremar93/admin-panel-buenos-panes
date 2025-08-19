import api from '@/config/api';
import { Employee } from '@/domain/model/Employee';

export const EmployeeAPI = {
  //   async createExpense(expense: Expense): Promise<Expense> {
  //     const res = await api.post('/expenses/create', expense);
  //     return res.data.expense;
  //   },

  //   async createExpenseByInvoice(
  //     expenseFromInvoice: ExpenseFromInvoice
  //   ): Promise<Expense> {
  //     const res = await api.post(
  //       '/expenses/create-by-invoice',
  //       expenseFromInvoice
  //     );
  //     return res.data.expense;
  //   },

  //   async updateExpense(
  //     id: String,
  //     expense: UpdateExpenseDTOType
  //   ): Promise<Expense> {
  //     const res = await api.put(`/expenses/${id}`, expense);
  //     console.log(res)
  //     return res.data.expense;
  //   },

  // async fetchEmployee(): Promise<Employee[]> {
  //     const res = await api.get('/employees/get');
  //     return res.data.employees;
  // },
  async fetchEmployee(query: string): Promise<Employee[]> {
    const res = await api.get('/employees/get' + query);
    return res.data?.employees ?? res.data;
  }
};
