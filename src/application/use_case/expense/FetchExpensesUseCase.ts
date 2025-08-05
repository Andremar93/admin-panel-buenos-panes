import { Expense } from '@/domain/model/Expense';
import { ExpenseRepository } from '@/domain/repository/ExpenseRepository';

export class FetchExpensesUseCase {
  constructor(private repository: ExpenseRepository) { }

  async execute(filters?: { startDate?: string; finishDate?: string }): Promise<Expense[]> {
    return this.repository.getAll(filters);
  }
}
