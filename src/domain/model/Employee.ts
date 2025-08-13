export interface Employee {
    _id: string;
    weeklySalary: number;
    name: number;
    idNumber: number;
    accountNumber: string;
}

export default Employee;

// src/domain/model/EmployeeDebt.ts

/** ---------- Domain Types ---------- */

export type ObjectId = string;

export type EmployeeDebtStatus = 'pending' | 'paid' | 'overdue' | 'cancelled';

export interface DebtItem {
    id: ObjectId;
    description: string;
    unitPrice: number;
    quantity: number;
    subtotal: number;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface EmployeeRef {
    id: ObjectId;
    name?: string;
    position?: string;
}

export default interface EmployeeDebt {
    id: ObjectId;

    /** Always present */
    employeeId: ObjectId;

    /** Present when API populates employee */
    employee?: EmployeeRef;

    description: string;
    status: EmployeeDebtStatus;

    notes?: string | null;

    /** If API populated items we keep them; otherwise this can be [] */
    items: DebtItem[];

    /**
     * Stored total in the document.
     * If items are present, prefer `getEffectiveTotal(debt)` to ensure consistency.
     */
    totalAmount: number;

    /** Optional from API virtuals */
    calculatedTotal?: number;

    createdAt: Date;
    updatedAt: Date;
}

/** ---------- Computed Helpers ---------- */

export function getEffectiveTotal(debt: EmployeeDebt): number {
    if (debt.items && debt.items.length > 0) {
        return debt.items.reduce((sum, it) => sum + (it.subtotal || 0), 0);
    }
    return debt.totalAmount || 0;
}


export function isPaidDebt(debt: EmployeeDebt): boolean {
    return debt.status === 'paid';
}

/**
 * Pure local transition (does NOT call API).
 * Useful for optimistic UI; mirror backend logic (sets paymentDate to now).
 */
export function markPaidLocal(debt: EmployeeDebt, when: Date = new Date()): EmployeeDebt {
    return {
        ...debt,
        status: 'paid',
        paymentDate: when,
    };
}

/** ---------- API Shapes (minimal) ---------- */
/** These mirror your backend response. Keep them local to avoid coupling DTO↔domain. */

export type DebtItemApi = {
    _id: ObjectId;
    debt: ObjectId;
    description: string;
    unitPrice: number;
    quantity: number;
    subtotal: number;
    createdAt: string;
    updatedAt: string;
};

export type EmployeeLiteApi = {
    _id: ObjectId;
    name?: string;
    position?: string;
};

export type CreatedByLiteApi = {
    _id: ObjectId;
    username?: string;
};

export type EmployeeDebtApi = {
    _id: ObjectId;
    employee: ObjectId | EmployeeLiteApi;
    description: string;
    totalAmount: number;
    status: EmployeeDebtStatus;
    paymentDate?: string | null;
    notes?: string | null;
    createdBy: ObjectId | CreatedByLiteApi;
    items: Array<ObjectId | DebtItemApi>;
    calculatedTotal?: number;
    createdAt: string;
    updatedAt: string;
};

/** ---------- Mappers: API → Domain ---------- */

function parseMaybeDate(s?: string | null): Date | undefined | null {
    if (s == null) return s as null | undefined;
    const d = new Date(s);
    return Number.isNaN(d.getTime()) ? undefined : d;
}

export function mapDebtItemApiToDomain(api: DebtItemApi): DebtItem {
    return {
        id: api._id,
        description: api.description,
        unitPrice: api.unitPrice,
        quantity: api.quantity,
        subtotal: api.subtotal,
        createdAt: new Date(api.createdAt),
        updatedAt: new Date(api.updatedAt),
    };
}

/**
 * Safely handles both populated and unpopulated `employee` and `items`.
 * - If items are just IDs, we return an empty array (you can lazy-load later).
 */
export function mapEmployeeDebtApiToDomain(api: EmployeeDebtApi): EmployeeDebt {
    const employeePop = typeof api.employee === 'object' && api.employee !== null;

    const items =
        Array.isArray(api.items)
            ? api.items.flatMap((it) =>
                typeof it === 'string'
                    ? [] // ignore non-populated items; or create a minimal placeholder if you prefer
                    : [mapDebtItemApiToDomain(it)]
            )
            : [];

    return {
        id: api._id,
        employeeId: employeePop ? (api.employee as EmployeeLiteApi)._id : (api.employee as ObjectId),
        employee: employeePop
            ? {
                id: (api.employee as EmployeeLiteApi)._id,
                name: (api.employee as EmployeeLiteApi).name,
                position: (api.employee as EmployeeLiteApi).position,
            }
            : undefined,
        description: api.description,
        status: api.status,
        paymentDate: parseMaybeDate(api.paymentDate),
        notes: api.notes ?? undefined,
        items,
        totalAmount: api.totalAmount,
        calculatedTotal: api.calculatedTotal,
        createdAt: new Date(api.createdAt),
        updatedAt: new Date(api.updatedAt),
    };
}

/** ---------- Mappers: Domain → Backend Payloads ---------- */
/** Matches your current backend creator: createEmployeeDebt(debtData, userId) */

export type CreateDebtItemPayload = {
    description: string;
    unitPrice: number;
    quantity: number;
};

export type CreateEmployeeDebtPayload = {
    employeeId: ObjectId;
    description: string;
    notes?: string;
    items: CreateDebtItemPayload[];
};

/**
 * Build the payload your backend expects:
 * { employeeId, description, notes, items: [{description, unitPrice, quantity}] }
 *
 * You can pass either a form object or map from an existing domain instance.
 */
export function toCreateEmployeeDebtPayload(input: {
    employeeId: ObjectId;
    description: string;
    notes?: string | null;
    items: Array<Pick<DebtItem, 'description' | 'unitPrice' | 'quantity'>>;
}): CreateEmployeeDebtPayload {

    return {
        employeeId: input.employeeId,
        description: input.description.trim(),
        notes: input.notes?.trim() || undefined,
        items: input.items.map((it) => ({
            description: it.description.trim(),
            unitPrice: Number(it.unitPrice) || 0,
            quantity: Math.max(1, Number(it.quantity) || 1),
        })),
    };
}

/** Optional: update payload builder if you later patch fields on the debt */
export type UpdateEmployeeDebtPayload = Partial<{
    description: string;
    status: EmployeeDebtStatus;
    paymentDate: string | null;
    notes: string | null;
    // If you support replacing items in an update endpoint
    items: CreateDebtItemPayload[];
}>;

export function toUpdateEmployeeDebtPayload(input: Partial<{
    description: string;
    status: EmployeeDebtStatus;
    paymentDate: Date | string | null;
    notes: string | null;
    items: Array<Pick<DebtItem, 'description' | 'unitPrice' | 'quantity'>>;
}>): UpdateEmployeeDebtPayload {
    const toIso = (d?: Date | string | null) =>
        d === undefined ? undefined : d === null ? null : typeof d === 'string' ? d : d.toISOString();

    return {
        description: input.description?.trim(),
        status: input.status,
        paymentDate: toIso(input.paymentDate),
        notes: input.notes?.trim() ?? null,
        items: input.items?.map((it) => ({
            description: it.description.trim(),
            unitPrice: Number(it.unitPrice) || 0,
            quantity: Math.max(1, Number(it.quantity) || 1),
        })),
    };
}


