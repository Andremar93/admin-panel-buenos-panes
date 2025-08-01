import Income from '@/domain/model/Income'
import { IncomeRepository } from '@/domain/repository/IncomeRepository'
import { CreateIncomeDTOType } from '@/presentation/dtos/income/createIncomeDto'

export class CreateIncomeUseCase {
  constructor(private repo: IncomeRepository) {}

  async execute(data: CreateIncomeDTOType): Promise<Income> {
    return await this.repo.create(data)
  }
}
