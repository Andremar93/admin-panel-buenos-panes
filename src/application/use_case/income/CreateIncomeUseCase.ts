import { IncomeRepository } from '@/domain/repository/IncomeRepository'

export class CreateIncomeUseCase {
  constructor(private repo: IncomeRepository) {}

  async execute() {
    return await this.repo.getAll()
  }
}
