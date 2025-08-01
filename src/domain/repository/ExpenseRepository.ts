import { Expense } from '@/domain/model/Expense';
import { ExpenseDTOType } from '@/presentation/dtos/ExpenseDto';
import { UpdateExpenseDTOType } from '@/presentation/dtos/expense/UpdateExpenseDto';
export interface ExpenseRepository {
  create(expense: ExpenseDTOType): Promise<Expense>;
  update(id: string, expense: UpdateExpenseDTOType): Promise<Expense>;
  getAll(): Promise<Expense[]>;
}
