
import Employee from '../model/Employee';
export interface EmployeeRepository {
    getAll(): Promise<Employee[]>;
}
