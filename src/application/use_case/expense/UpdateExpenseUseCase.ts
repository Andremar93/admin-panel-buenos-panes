import { Expense } from '@/domain/model/Expense';
import { ExpenseDTOType } from '@/presentation/dtos/ExpenseDto';
import { ExpenseRepository } from '@/domain/repository/ExpenseRepository';

export class UpdateExpenseUseCase {
  constructor(private repository: ExpenseRepository) {}

  async execute(id: string, data: Partial<ExpenseDTOType>): Promise<Expense> {
    return this.repository.update(id, data);
  }
}
