import { ExpenseRepositoryImpl } from '@/data/repository/ExpenseRepositoryImpl';
import { CreateExpenseUseCase } from '@/application/use_case/expense/CreateExpenseUseCase';
import { FetchExpensesUseCase } from '@/application/use_case/expense/FetchExpensesUseCase';
import { UpdateExpenseUseCase } from '@/application/use_case/expense/UpdateExpenseUseCase';

const repository = new ExpenseRepositoryImpl();

export const createExpenseUseCase = new CreateExpenseUseCase(repository);
export const fetchExpensesUseCase = new FetchExpensesUseCase(repository);
export const updateExpenseUseCase = new UpdateExpenseUseCase(repository);
