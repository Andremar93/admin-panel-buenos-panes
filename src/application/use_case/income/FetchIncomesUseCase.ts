import { IncomeRepository } from '@/domain/repository/IncomeRepository'

export class FetchIncomesUseCase {
  constructor(private repo: IncomeRepository) {}

  async execute() {
    return await this.repo.getAll()
  }
}
