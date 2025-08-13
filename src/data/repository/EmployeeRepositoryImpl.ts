import Employee from '@/domain/model/Employee';
import { EmployeeAPI } from '../api/EmployeeAPI';
import { EmployeeRepository } from '@/domain/repository/EmployeeRepository';
import { CreateEmployeeDebtWithItemsDTOType } from '@/presentation/dtos/employee/CreateEmployeeWithDebtItemDto';
import { EmployeeDebtResponse } from '@/presentation/dtos/employee/CreateEmployeeDebtDto';
import { DebtApi } from '@/infrastructure/DebtApi';


export class EmployeeRepositoryImpl implements EmployeeRepository {

    async getAll(): Promise<Employee[]> {
        return EmployeeAPI.fetchEmployee();
    }

    async createDebt(debt: CreateEmployeeDebtWithItemsDTOType): Promise<EmployeeDebtResponse> {
        return DebtApi.create(debt)
    }

}
