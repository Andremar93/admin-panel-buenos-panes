import { api } from '@/config/api';
import { CashFlowRepository } from '@/domain/repository/CashFlowRepository';
import { MonthlyCashFlow } from '@/domain/model/CashFlow';
import { MonthlyCashFlowDto } from '@/presentation/dtos/cashFlow/cashFlowDTO';

export class CashFlowRepositoryImpl implements CashFlowRepository {
  async getMonthlyCashFlow(
    year: number,
    month: number,
    currency: 'USD' | 'Bs'
  ): Promise<MonthlyCashFlow> {

    const { data } = await api.get<MonthlyCashFlowDto>(
      '/analytics/monthly-cash-flow',
      {
        params: { year, month, currency },
      }
    );

    return {
      balanceFinal: data.balanceFinal,
      currency: data.currency,
      days: data.days,
    };
  }
}