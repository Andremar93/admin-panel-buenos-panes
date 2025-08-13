
import { CreateEmployeeDebtWithItemsDTOType } from '@/presentation/dtos/employee/CreateEmployeeWithDebtItemDto';
import Employee from '../model/Employee';
import { EmployeeDebtResponse } from '@/presentation/dtos/employee/CreateEmployeeDebtDto';
export interface EmployeeRepository {
    getAll(): Promise<Employee[]>;
    createDebt(debt: CreateEmployeeDebtWithItemsDTOType): Promise<EmployeeDebtResponse>
}
