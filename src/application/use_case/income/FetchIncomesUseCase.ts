import Income from '@/domain/model/Income';
import { IncomeRepository } from '@/domain/repository/IncomeRepository';

export class FetchIncomesUseCase {
  constructor(private repo: IncomeRepository) {}

  async execute(filters?: { startDate?: string; finishDate?: string }) {
    return await this.repo.getAll(filters);
  }
}
