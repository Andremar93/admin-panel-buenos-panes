import { Expense } from '@/domain/model/Expense';
import { ExpenseAPI } from '@/data/api/ExpenseAPI';

export class FetchExpensesUseCase {
  async execute(): Promise<Expense[]> {
    return ExpenseAPI.fetchExpenses();
  }
}
