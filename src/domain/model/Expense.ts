import { UpdateExpenseDTOType } from '@/presentation/dtos/expense/UpdateExpenseDto';

export interface Expense {
  _id: string;
  amountDollars: number;
  amountBs: number;
  currency: '$' | 'Bs';
  type: string;
  subType?: string;
  paymentMethod: string;
  description: string;
  date: Date;
  paid: boolean;
  googleRow: number;
}

export default Expense;

export function toUpdateExpenseData(expense: Expense): UpdateExpenseDTOType {
  const amount =
    expense.currency == '$' ? expense.amountDollars : expense.amountBs;

  const { _id, currency, type, paymentMethod, description, date, subType } =
    expense;
  const updateData: UpdateExpenseDTOType = {
    _id,
    amount,
    currency,
    type,
    paymentMethod,
    description,
    date,
    subType,
  };

  return updateData;
}
