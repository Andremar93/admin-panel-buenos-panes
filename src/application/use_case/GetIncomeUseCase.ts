import { IncomeRepository } from '@/domain/repository/IncomeRepository'

export class GetIngresosUseCase {
  constructor(private repo: IncomeRepository) {}

  async execute() {
    return await this.repo.getAll()
  }
}
