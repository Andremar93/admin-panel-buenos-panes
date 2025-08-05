import { Income } from '@/domain/model/Income';
import { IncomeRepository } from '@/domain/repository/IncomeRepository';
import { IncomeAPI } from '@/data/api/IncomeAPI';
import { CreateIncomeDTOType } from '@/presentation/dtos/income/createIncomeDto';
import { UpdateIncomeDTOType } from '@/presentation/dtos/income/UpdateIncomeDto';

export class IncomeRepositoryImpl implements IncomeRepository {
  async getAll(filters?: { startDate?: string; finishDate?: string }): Promise<Income[]> {
    return await IncomeAPI.fetchIncomes(filters);
  }

  async create(data: CreateIncomeDTOType): Promise<Income> {
    return await IncomeAPI.createIncome(data);
  }

  async update(data: UpdateIncomeDTOType, incomeId: String): Promise<Income> {
    return await IncomeAPI.updateIncome(data, incomeId);
  }
}
