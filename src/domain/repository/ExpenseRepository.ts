import { Expense } from '@/domain/model/Expense';
import { ExpenseDTOType } from '@/presentation/dtos/ExpenseDto'

export interface ExpenseRepository {
  create(expense: ExpenseDTOType): Promise<Expense>;
  update(id: string, expense: Partial<ExpenseDTOType>): Promise<Expense>;
  getAll(): Promise<Expense[]>;
}
