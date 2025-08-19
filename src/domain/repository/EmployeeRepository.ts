
import { Employee } from '../model/Employee';
import { CreateEmployeeDebtDTOType } from '@/presentation/dtos/employee/CreateEmployeeDebtDto';
import { EmployeeDebt } from '../model/EmployeeDebt';
import { CreateEmployeeSalaryDTOType } from '@/presentation/dtos/employee/CreateEmployeeSalaryDto';

export interface EmployeeRepository {
    getAll(query: string): Promise<Employee[]>;
    createEmployeeDebt(payload: CreateEmployeeDebtDTOType): Promise<EmployeeDebt>;
    markDebtItemsPaid(debtId: string, itemIndexes: number[]): Promise<void>;
    // createEmployeeSalary(payload: CreateEmployeeSalaryDTOType): Promise<CreateEmployeeSalaryDTOType>;
}
