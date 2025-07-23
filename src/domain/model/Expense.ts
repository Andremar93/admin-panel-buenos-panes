export interface Expense {
    amountDollars: number;
    amountBs: number;
    currency: '$' | 'Bs';
    type: string;
    subType?: string;
    paymentMethod?: string;
    description: string;
    date: Date;
    paid: boolean;
    invoiceId?: string;
    googleRow: number;
  }
  
  export default Expense;
  