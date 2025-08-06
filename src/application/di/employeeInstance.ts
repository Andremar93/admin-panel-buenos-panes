import { EmployeeRepositoryImpl } from '@/data/repository/EmployeeRepositoryImpl';
import { FetchEmployeesUseCase } from '../use_case/employee/FetchEmployeesUseCase';

const repository = new EmployeeRepositoryImpl();

// export const createExpenseUseCase = new CreateExpenseUseCase(repository);
export const fetchEmployeesUseCase = new FetchEmployeesUseCase(repository);
// export const updateExpenseUseCase = new UpdateExpenseUseCase(repository);
