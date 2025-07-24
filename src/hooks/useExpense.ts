import { useQuery } from '@tanstack/react-query'
import { ExpenseAPI } from '@/data/api/ExpenseAPI'
import { Expense } from '@/domain/model/Expense'

export function useExpense() {
  return useQuery<Expense[], Error>({
    queryKey: ['gastos'],
    queryFn: () => ExpenseAPI.fetchExpenses(),
    staleTime: 1000 * 60 * 5, 
    retry: 1,
  })
}
