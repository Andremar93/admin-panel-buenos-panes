import { ExpenseDTOType } from '@/presentation/dtos/ExpenseDto';
import { Expense } from '@/domain/model/Expense';
import { ExpenseAPI } from '@/data/api/ExpenseAPI';

export class CreateExpenseUseCase {
  async execute(expenseDto: ExpenseDTOType): Promise<Expense> {
    // Transformamos explícitamente el campo date a Date para que cumpla con Expense
    const expense: Expense = {
      ...expenseDto,
      date: expenseDto.date instanceof Date ? expenseDto.date : new Date(expenseDto.date),
    };

    return ExpenseAPI.createExpense(expense);
  }
}
