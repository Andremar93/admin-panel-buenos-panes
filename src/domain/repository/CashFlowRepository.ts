import { MonthlyCashFlow } from '@/domain/model/CashFlow';

export interface CashFlowRepository {
  getMonthlyCashFlow(
    year: number,
    month: number,
    currency: 'USD' | 'Bs'
  ): Promise<MonthlyCashFlow>;
}