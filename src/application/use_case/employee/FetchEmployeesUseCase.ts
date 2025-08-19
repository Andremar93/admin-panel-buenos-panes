import { Employee } from '@/domain/model/Employee'
import { EmployeeRepository } from '@/domain/repository/EmployeeRepository';

export class FetchEmployeesUseCase {
    constructor(private repository: EmployeeRepository) { }

    async execute(query: string): Promise<Employee[]> {
        return this.repository.getAll(query);
    }
}
