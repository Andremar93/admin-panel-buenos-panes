import { ExpenseRepository } from '@/domain/repository/ExpenseRepository';
import { Expense } from '@/domain/model/Expense';
import { ExpenseDTOType} from '@/presentation/dtos/ExpenseDto'
import { ExpenseAPI } from '@/data/api/ExpenseAPI';
import { UpdateExpenseDTOType } from '@/presentation/dtos/expense/UpdateExpenseDto';

export class ExpenseRepositoryImpl implements ExpenseRepository {
  async create(expense: ExpenseDTOType): Promise<Expense> {
    return ExpenseAPI.createExpense(expense);
  }

  async update(id: String, expense: UpdateExpenseDTOType): Promise<Expense> {
    return ExpenseAPI.updateExpense(id, expense);
  }

  async getAll(filters?: { startDate?: string; finishDate?: string }): Promise<Expense[]> {
    return ExpenseAPI.fetchExpenses(filters);
  }
}
