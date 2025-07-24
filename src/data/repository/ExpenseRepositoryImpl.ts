import { ExpenseRepository } from '@/domain/repository/ExpenseRepository';
import { Expense } from '@/domain/model/Expense';
import { ExpenseDTOType} from '@/presentation/dtos/ExpenseDto'
import { ExpenseAPI } from '@/data/api/ExpenseAPI';

export class ExpenseRepositoryImpl implements ExpenseRepository {
  async create(expense: ExpenseDTOType): Promise<Expense> {
    return ExpenseAPI.createExpense(expense);
  }

  async update(id: string, expense: Partial<ExpenseDTOType>): Promise<Expense> {
    return ExpenseAPI.updateExpense(expense, id);
  }

  async getAll(): Promise<Expense[]> {
    return ExpenseAPI.fetchExpenses();
  }
}
