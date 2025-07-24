import { Expense } from '@/domain/model/Expense';
import { ExpenseRepository } from '@/domain/repository/ExpenseRepository';

export class FetchExpensesUseCase {
  constructor(private repository: ExpenseRepository) {}

  async execute(): Promise<Expense[]> {
    return this.repository.getAll();
  }
}
