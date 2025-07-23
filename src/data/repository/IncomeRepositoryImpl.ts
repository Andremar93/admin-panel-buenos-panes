import { Income } from '@/domain/model/Income'
import { IncomeRepository } from '@/domain/repository/IncomeRepository'
import { IncomeAPI } from '@/data/api/IncomeAPI'

export class IncomeRepositoryImpl implements IncomeRepository {
  async getAll(): Promise<Income[]> {
    return await IncomeAPI.fetchIncomes()
  }

  async create(data: Income): Promise<Income> {
    return await IncomeAPI.createIncome(data)
  }
}
