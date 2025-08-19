import { EmployeeRepositoryImpl } from '@/data/repository/EmployeeRepositoryImpl';
import { FetchEmployeesUseCase } from '../use_case/employee/FetchEmployeesUseCase';
import { CreateEmployeesDebtUseCase } from '@/application/use_case/employee/CreateEmployeesDebtUseCase';
import { MarkDebtItemsPaidUseCase } from '@/application/use_case/employee/MarkDebtItemsPaidUseCase';

const repository = new EmployeeRepositoryImpl();

// export const createExpenseUseCase = new CreateExpenseUseCase(repository);
export const fetchEmployeesUseCase = new FetchEmployeesUseCase(repository);
export const createEmployeesDebtUseCase = new CreateEmployeesDebtUseCase(repository);
export const markDebtItemsPaidUseCase = new MarkDebtItemsPaidUseCase(repository);
// export const updateExpenseUseCase = new UpdateExpenseUseCase(repository);





