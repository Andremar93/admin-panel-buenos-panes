import { Expense } from '@/domain/model/Expense';
import { UpdateExpenseDTOType } from '@/presentation/dtos/expense/UpdateExpenseDto';
import { ExpenseRepository } from '@/domain/repository/ExpenseRepository';

export class UpdateExpenseUseCase {
  constructor(private repository: ExpenseRepository) {}

  async execute( data: UpdateExpenseDTOType): Promise<Expense> {
    return this.repository.update(data._id, data);
  }
}
