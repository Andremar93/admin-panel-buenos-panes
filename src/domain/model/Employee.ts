


// types/employee.ts
export type DebtStatus = 'pending' | 'paid' | 'overdue' | 'cancelled';

export interface EmployeeDebtItem {
    concept: string;
    unitAmount: number; // USD si type=standard, Bs si type=vale
    quantity: number;
}

export interface EmployeeDebt {
    _id: string;
    description?: string;
    type: 'standard' | 'vale';
    status: DebtStatus;
    totalAmount: number;     // en USD (el back ya convierte si es vale)
    paymentDate?: string;
    createdAt: string;
    items?: EmployeeDebtItem[];
}

export interface DebtsSummary {
    totalDebts: number;
    totalAmount: number;
    pendingAmount: number;
    paidAmount: number;
}

export interface Employee {
    _id: string;
    name: string;
    weeklySalary?: number;
    id?: string;
    accountNumber?: string;
    // campos extra cuando pedimos deudas
    debts?: EmployeeDebt[];
    debtsSummary?: DebtsSummary;
}
