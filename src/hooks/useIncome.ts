import { useQuery } from '@tanstack/react-query'
import { IncomeAPI } from '@/data/api/IncomeAPI'
import { Income } from '@/domain/model/Income'

export function useIncome() {
  return useQuery<Income[], Error>({
    queryKey: ['ingresos'],
    queryFn: () => IncomeAPI.fetchIncomes(),
    staleTime: 1000 * 60 * 5, 
    retry: 1,
  })
}
