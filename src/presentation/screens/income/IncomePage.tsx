import { useIncome } from '@/hooks/useIncome'

export function IncomePage() {
  const { data: ingresos, isLoading, error } = useIncome()

  if (isLoading) return <div>Cargando ingresos...</div>
  if (error) return <div>Error: {error.message}</div>

  return (
    <div>
      <h1 className="text-xl font-bold">Ingresos</h1>
      <ul>
        {ingresos?.map((ing) => (
          <li key={ing.totalSistema}>
            BioPago- ${ing.biopago}
          </li>
        ))}
      </ul>
    </div>
  )
}
