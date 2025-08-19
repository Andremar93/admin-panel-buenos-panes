// Domain: EmployeeDebt (simple)
export type DebtStatus = 'pending' | 'paid' | 'overdue' | 'cancelled';

export type EmployeeDebt = {
    _id?: string;
    employee: string;
    description: string;
    totalAmount: number;
    status: DebtStatus;
    paymentDate?: string;
    notes?: string;
    createdBy: string;
    items?: string[];
    calculatedTotal?: number;
    createdAt?: string;
    updatedAt?: string;
};
