import { Income } from '@/domain/model/Income'
import api from '@/config/api'

export const IncomeAPI = {
  async fetchIncomes(): Promise<Income[]> {
    const res = await api.get('/incomes/get')
    return res.data
  },
  async createIncome(data: Income): Promise<Income> {
    const res = await api.post('/incomes/create', data)
    return res.data
  }
}