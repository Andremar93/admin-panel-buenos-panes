import { Income } from '@/domain/model/Income'

export interface IncomeRepository {
  getAll(): Promise<Income[]>
  create(data: Income): Promise<Income>
}
