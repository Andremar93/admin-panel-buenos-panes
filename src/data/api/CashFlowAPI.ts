import api from '@/config/api';
import { CashFlowDay}

export const getMonthlyCashFlow = async (
    year: number,
    month: number,
    currency: 'USD' | 'Bs'
  ) => {
    const { data } = await api.get<MonthlyCashFlowResponse>(
      `/analytics/monthly-cash-flow`,
      {
        params: { year, month, currency },
      }
    );
  
    return data;
  };