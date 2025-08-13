import { EmployeeRepositoryImpl } from '@/data/repository/EmployeeRepositoryImpl';
import { FetchEmployeesUseCase } from '../use_case/employee/FetchEmployeesUseCase';
import { CreateEmployeesDebtUseCase } from '../use_case/employee/CreateEmployeesDebtUseCase';


const repository = new EmployeeRepositoryImpl();

// export const createExpenseUseCase = new CreateExpenseUseCase(repository);
export const fetchEmployeesUseCase = new FetchEmployeesUseCase(repository);
export const createEmployesDebt = new CreateEmployeesDebtUseCase(repository)
// export const updateExpenseUseCase = new UpdateExpenseUseCase(repository);
