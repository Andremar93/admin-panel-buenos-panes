// src/domain/model/Invoice.ts

export interface Invoice {
    _id: string;
    supplier: string;
    dueDate: Date;
    amountDollars: number;
    amountBs: number;
    currency: '$' | 'Bs';
    type: string;
    subType?: string;
    paymentMethod?: string;
    description: string;
    date: Date;
    paid: boolean;
    googleRow: number;
    numeroFactura?: string;
  }
  