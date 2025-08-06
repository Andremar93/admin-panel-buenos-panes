import Employee from '@/domain/model/Employee';
import { EmployeeAPI } from '../api/EmployeeAPI';
import { EmployeeRepository } from '@/domain/repository/EmployeeRepository';


export class EmployeeRepositoryImpl implements EmployeeRepository {

    async getAll(): Promise<Employee[]> {
        return EmployeeAPI.fetchEmployee();
    }
}
