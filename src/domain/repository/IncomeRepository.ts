import { Income } from '@/domain/model/Income';
import { CreateIncomeDTOType } from '@/presentation/dtos/income/createIncomeDto';
import { UpdateIncomeDTOType } from '@/presentation/dtos/income/UpdateIncomeDto';

export interface IncomeRepository {
  getAll(filters?: { startDate?: string; finishDate?: string }): Promise<Income[]>;
  create(data: CreateIncomeDTOType): Promise<Income>;
  update(data: UpdateIncomeDTOType, incomeId: String): Promise<Income>;
}
