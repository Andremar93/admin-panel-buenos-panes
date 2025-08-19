import { Employee } from '@/domain/model/Employee';
import { EmployeeAPI } from '../api/EmployeeAPI';
import { EmployeeRepository } from '@/domain/repository/EmployeeRepository';
import { CreateEmployeeDebtDTOType } from '@/presentation/dtos/employee/CreateEmployeeDebtDto';
import { DebtApi } from '@/infrastructure/DebtApi';
import { EmployeeDebt } from '@/domain/model/EmployeeDebt';
import { CreateEmployeeSalaryDTOType } from '@/presentation/dtos/employee/CreateEmployeeSalaryDto';


export class EmployeeRepositoryImpl implements EmployeeRepository {

    async getAll(query: string): Promise<Employee[]> {
        return EmployeeAPI.fetchEmployee(query);
    }

    async createEmployeeDebt(payload: CreateEmployeeDebtDTOType): Promise<EmployeeDebt> {
        return DebtApi.createEmployeeDebt(payload);
    }

    async markDebtItemsPaid(debtId: string, itemIndexes: number[]): Promise<void> {
        return DebtApi.markDebtItemsPaid(debtId, itemIndexes);
    }

    // async createEmployeeSalary(payload: CreateEmployeeSalaryDTOType): Promise<EmployeeSalary> {
    //     return EmployeeAPI.createEmployeeSalary(payload);
    // }



}
