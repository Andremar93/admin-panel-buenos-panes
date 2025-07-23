import { Expense } from '@/domain/model/Expense'
import api from '@/config/api'

export const ExpenseAPI = {
  async fetchExpenses(): Promise<Expense[]> {
    const res = await api.get('/expenses/get')
    return res.data
  },
  async createExpense(data: Expense): Promise<Expense> {
    const res = await api.post('/expenses/create', data)
    return res.data
  }
}