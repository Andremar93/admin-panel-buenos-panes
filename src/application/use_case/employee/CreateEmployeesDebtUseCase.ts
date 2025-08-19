import type { CreateEmployeeDebtDTOType } from '@/presentation/dtos/employee/CreateEmployeeDebtDto';
import type { EmployeeDebt } from '@/domain/model/EmployeeDebt';
import type { EmployeeRepository } from '@/domain/repository/EmployeeRepository';

export class CreateEmployeesDebtUseCase {
    constructor(private readonly repo: EmployeeRepository) { }

    execute(payload: CreateEmployeeDebtDTOType): Promise<EmployeeDebt> {
        return this.repo.createEmployeeDebt(payload);
    }
}
