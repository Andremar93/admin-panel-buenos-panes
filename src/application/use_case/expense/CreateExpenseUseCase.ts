import { ExpenseDTOType } from '@/presentation/dtos/ExpenseDto';
import { ExpenseRepository } from '@/domain/repository/ExpenseRepository';
import { Expense } from '@/domain/model/Expense';
export class CreateExpenseUseCase {
  constructor(private repository: ExpenseRepository) {}

  async execute(data: ExpenseDTOType): Promise<Expense> {
    return this.repository.create(data);
  }
}
