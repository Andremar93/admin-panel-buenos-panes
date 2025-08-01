import { IncomeRepository } from '@/domain/repository/IncomeRepository';
import { UpdateIncomeDTOType } from '@/presentation/dtos/income/UpdateIncomeDto';

export class UpdateIncomeUseCase {
  constructor(private repo: IncomeRepository) {}

  async execute(data: UpdateIncomeDTOType, incomeId: String) {
    return await this.repo.update(data, incomeId);
  }
}
