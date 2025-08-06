import { Employee } from '@/domain/model/Employee'
import { EmployeeRepository } from '@/domain/repository/EmployeeRepository';

export class FetchEmployeesUseCase {
    constructor(private repository: EmployeeRepository) { }

    async execute(): Promise<Employee[]> {
        return this.repository.getAll();
    }
}
