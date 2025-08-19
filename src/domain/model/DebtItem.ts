// Domain: DebtItem (simple)
export type DebtItem = {
    _id?: string;
    concept?: string;
    unitAmount: string;
    unitPrice: number;
    quantity: number;
    subtotal?: number;
    createdAt?: string;
    updatedAt?: string;
    isPaid?: boolean;
};
