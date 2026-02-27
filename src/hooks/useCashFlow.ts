import { useQuery } from '@tanstack/react-query';
import { CashFlowRepositoryImpl } from '../data/repository/CashFlowRepositoryImpl';

const repository = new CashFlowRepositoryImpl();

export const useMonthlyCashFlow = (
  year: number,
  month: number,
  currency: 'USD' | 'Bs'
) => {
  return useQuery({
    queryKey: ['monthlyCashFlow', year, month, currency],
    queryFn: () =>
      repository.getMonthlyCashFlow(year, month, currency),
  });
};