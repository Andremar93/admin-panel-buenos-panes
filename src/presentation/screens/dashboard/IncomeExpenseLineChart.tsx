import { Line } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  TimeScale,
} from 'chart.js'
import 'chartjs-adapter-date-fns'
import { es } from 'date-fns/locale'
import { useMemo } from 'react'

ChartJS.register(
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  TimeScale
)

/**
 * @param {{
 *   title?: string;
 *   incomes?: any[];
 *   expenses?: any[];
 *   incomeAmountKey?: string;     // p.ej. "totalSistema"
 *   expenseAmountKey?: string;    // p.ej. "amountDollars"
 *   getIncomeAmount?: (row:any)=>number; // alternativa al key
 *   getExpenseAmount?: (row:any)=>number;// alternativa al key
 * }} props
 */
export function IncomeExpenseLineChart({
  title = 'Ingresos vs Egresos',
  incomes = [],
  expenses = [],
  incomeAmountKey = 'totalSistema',
  expenseAmountKey = 'amountDollars',
  getIncomeAmount,
  getExpenseAmount,
}) {
  // Helpers
  const amountFromKey = (row, key) => {
    const v = Number(row?.[key] ?? 0)
    return Number.isFinite(v) ? v : 0
  }
  const getIncAmt = getIncomeAmount || ((r) => amountFromKey(r, incomeAmountKey))
  const getExpAmt = getExpenseAmount || ((r) => amountFromKey(r, expenseAmountKey))

  // 1) Normalizar a puntos {x: dateISO, y: number}
  const incomePoints = useMemo(() => {
    return (incomes ?? [])
      .filter(Boolean)
      .map((r) => ({ x: new Date(r.date).toISOString(), y: getIncAmt(r) }))
      .filter((p) => Number.isFinite(p.y))
  }, [incomes, getIncAmt])

  const expensePoints = useMemo(() => {
    return (expenses ?? [])
      .filter(Boolean)
      .map((r) => ({ x: new Date(r.date).toISOString(), y: getExpAmt(r) }))
      .filter((p) => Number.isFinite(p.y))
  }, [expenses, getExpAmt])

  // 2) Agregar por fecha (si hay múltiples registros en el mismo día)
  const aggregateByDay = (points) => {
    const map = new Map()
    for (const p of points) {
      const day = p.x.slice(0, 10) // YYYY-MM-DD
      map.set(day, (map.get(day) || 0) + p.y)
    }
    // Devuelve {x,y} con x=YYYY-MM-DDT00:00:00.000Z
    return Array.from(map.entries())
      .map(([day, sum]) => ({ x: new Date(day).toISOString(), y: sum }))
      .sort((a, b) => new Date(a.x) - new Date(b.x))
  }

  const incomeDaily = useMemo(() => aggregateByDay(incomePoints), [incomePoints])
  const expenseDaily = useMemo(() => aggregateByDay(expensePoints), [expensePoints])

  // 3) Eje X común: todas las fechas presentes en ambas series (únicas + ordenadas)
  const allDates = useMemo(() => {
    const set = new Set([
      ...incomeDaily.map((p) => p.x),
      ...expenseDaily.map((p) => p.x),
    ])
    return Array.from(set).sort((a, b) => new Date(a) - new Date(b))
  }, [incomeDaily, expenseDaily])

  // 4) Promedios
  const avg = (arr) =>
    arr.length ? arr.reduce((s, p) => s + (p.y || 0), 0) / arr.length : 0

  const avgIncome = useMemo(() => avg(incomeDaily), [incomeDaily])
  const avgExpense = useMemo(() => avg(expenseDaily), [expenseDaily])

  // 5) Líneas de promedio (puntos para cada fecha del eje X)
  const avgIncomeLine = useMemo(
    () => allDates.map((d) => ({ x: d, y: avgIncome })),
    [allDates, avgIncome]
  )
  const avgExpenseLine = useMemo(
    () => allDates.map((d) => ({ x: d, y: avgExpense })),
    [allDates, avgExpense]
  )

  const data = {
    datasets: [
      {
        label: 'Ingresos',
        data: incomeDaily,
        borderColor: '#10B981',
        backgroundColor: 'rgba(16, 185, 129, 0.2)',
        fill: true,
        tension: 0.3,
        pointRadius: 3,
        pointHoverRadius: 5,
      },
      {
        label: 'Egresos',
        data: expenseDaily,
        borderColor: '#EF4444',
        backgroundColor: 'rgba(239, 68, 68, 0.15)',
        fill: true,
        tension: 0.3,
        pointRadius: 3,
        pointHoverRadius: 5,
      },
      {
        label: `Promedio Ingresos: $${avgIncome.toFixed(2)}`,
        data: avgIncomeLine,
        borderColor: '#065F46',
        borderDash: [6, 6],
        pointRadius: 0,
        fill: false,
      },
      {
        label: `Promedio Egresos: $${avgExpense.toFixed(2)}`,
        data: avgExpenseLine,
        borderColor: '#7F1D1D',
        borderDash: [6, 6],
        pointRadius: 0,
        fill: false,
      },
    ],
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'top' },
      tooltip: {
        callbacks: {
          label: (ctx) =>
            `${ctx.dataset.label}: $${Number(ctx.parsed.y ?? 0).toFixed(2)}`,
        },
      },
    },
    scales: {
      x: {
        type: 'time',
        time: { unit: 'day' },
        adapters: { date: { locale: es } },
        title: { display: true, text: 'Fecha' },
      },
      y: {
        beginAtZero: true,
        title: { display: true, text: 'Monto (USD)' },
      },
    },
  }

  return (
    <div className="bg-white m-6 p-4 rounded-lg shadow w-full mx-auto" style={{ height: 380 }}>
      <h2 className="text-xl font-semibold mb-4">{title}</h2>
      <Line data={data} options={options} />
    </div>
  )
}
