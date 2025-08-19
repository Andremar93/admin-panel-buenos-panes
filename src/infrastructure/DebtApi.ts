import { api } from '@/config/api'; // tu axios preconfigurado
import type { CreateEmployeeDebtDTOType } from '@/presentation/dtos/employee/CreateEmployeeDebtDto';
import type { CreateEmployeeDebtWithItemsDTOType } from '@/presentation/dtos/employee/CreateEmployeeWithDebtItemDto';
import type { EmployeeDebt } from '@/domain/model/EmployeeDebt';

export const DebtApi = {
    async createEmployeeDebt(payload: CreateEmployeeDebtDTOType): Promise<EmployeeDebt> {
        const { data } = await api.post<EmployeeDebt>('/employee-debts/create', payload);
        return data;
    },

    async create(payload: CreateEmployeeDebtWithItemsDTOType): Promise<EmployeeDebt> {
        const { data } = await api.post<EmployeeDebt>('/employee-debts/create', payload);
        return data;
    },

    async markDebtItemsPaid(debtId: string, itemIndexes: number[]): Promise<void> {
        await api.post(`/employee-debts/${debtId}/mark-items-paid`, { itemIndexes });
    }
}
