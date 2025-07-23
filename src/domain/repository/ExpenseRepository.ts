import { Expense } from '../model/Expense';

export interface ExpenseRepository {
  create(expense: Expense): Promise<Expense>;
}
