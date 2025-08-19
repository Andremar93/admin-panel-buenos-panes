import { EmployeeRepository } from '@/domain/repository/EmployeeRepository';

export interface MarkDebtItemsPaidRequest {
    debtId: string;
    itemIndexes: number[];
}

export class MarkDebtItemsPaidUseCase {
    constructor(private employeeRepository: EmployeeRepository) {}

    async execute(request: MarkDebtItemsPaidRequest): Promise<void> {
        return this.employeeRepository.markDebtItemsPaid(request.debtId, request.itemIndexes);
    }
}
