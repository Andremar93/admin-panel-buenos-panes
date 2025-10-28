// components/IncomeExpenseChart.tsx
import { Bar } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  TimeScale,
} from 'chart.js'
import 'chartjs-adapter-date-fns'
import { useMemo } from 'react'
import { Income } from '@/domain/model/Income'
import { Expense } from '@/domain/model/Expense'

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend, TimeScale)

interface IncomeExpenseChartProps {
  title?: string;
  incomes?: Income[];
  expenses?: Expense[];
  incomeAmountKey?: string;
  expenseAmountKey?: string;
  getIncomeAmount?: (row: Income) => number;
  getExpenseAmount?: (row: Expense) => number;
}

export const IncomeExpenseChart = ({
  title = 'Ingresos vs Gastos Diarios',
  incomes = [],
  expenses = [],
  expenseAmountKey = 'amountDollars',
  getExpenseAmount,
}: IncomeExpenseChartProps) => {
  // Helpers
  const amountFromKey = (row: Income | Expense, key: string) => {
    const v = Number((row as any)?.[key] ?? 0)
    return Number.isFinite(v) ? v : 0
  }
  const getExpAmt = getExpenseAmount || ((r: Expense) => amountFromKey(r, expenseAmountKey))

  // 1) Normalizar a puntos {x: dateISO, y: number}
  // Separar ingresos en BS y en USD
  const incomePoints = useMemo(() => {
    return (incomes ?? [])
      .filter(Boolean)
      .map((r) => {
        // Ingresos en USD (solo efectivoDolares)
        const incomeUSD = r.efectivoDolares || 0;
        
        // Ingresos en BS convertidos a USD
        const rate = (r.rate && r.rate !== 0) ? r.rate : 100;
        const incomeBS = (
          (r.efectivoBs || 0) +
          (r.sitef || 0) +
          (r.pagomovil || 0) +
          (r.biopago || 0) +
          (r.puntoExterno || 0)
        ) / rate;
        
        return { 
          x: new Date(r.date).toISOString(), 
          yUSD: incomeUSD,
          yBS: incomeBS 
        };
      })
      .filter((p) => Number.isFinite(p.yUSD) || Number.isFinite(p.yBS))
  }, [incomes])

  const expensePoints = useMemo(() => {
    return (expenses ?? [])
      .filter(Boolean)
      .map((r) => ({ x: new Date(r.date).toISOString(), y: getExpAmt(r) }))
      .filter((p) => Number.isFinite(p.y))
  }, [expenses, getExpAmt])

  // 2) Agregar por fecha (si hay múltiples registros en el mismo día)
  const aggregateByDay = (points: Array<{x: string, y: number}>) => {
    const map = new Map<string, number>()
    for (const p of points) {
      const day = p.x.slice(0, 10) // YYYY-MM-DD
      map.set(day, (map.get(day) || 0) + p.y)
    }
    // Devuelve {x,y} con x=YYYY-MM-DDT00:00:00.000Z
    return Array.from(map.entries())
      .map(([day, sum]) => ({ x: new Date(day).toISOString(), y: sum }))
      .sort((a, b) => new Date(a.x).getTime() - new Date(b.x).getTime())
  }

  // Para ingresos, necesitamos agregar tanto USD como BS
  const aggregateIncomeByDay = (points: Array<{x: string, yUSD: number, yBS: number}>) => {
    const mapUSD = new Map<string, number>()
    const mapBS = new Map<string, number>()
    
    for (const p of points) {
      const day = p.x.slice(0, 10) // YYYY-MM-DD
      mapUSD.set(day, (mapUSD.get(day) || 0) + p.yUSD)
      mapBS.set(day, (mapBS.get(day) || 0) + p.yBS)
    }
    
    const allDays = new Set([...mapUSD.keys(), ...mapBS.keys()])
    
    return Array.from(allDays)
      .map(day => ({ 
        x: new Date(day).toISOString(), 
        yUSD: mapUSD.get(day) || 0,
        yBS: mapBS.get(day) || 0
      }))
      .sort((a, b) => new Date(a.x).getTime() - new Date(b.x).getTime())
  }

  const incomeDaily = useMemo(() => aggregateIncomeByDay(incomePoints), [incomePoints])
  const expenseDaily = useMemo(() => aggregateByDay(expensePoints), [expensePoints])

  // 3) Eje X común: todas las fechas presentes en ambas series (únicas + ordenadas)
  const allDates = useMemo(() => {
    const set = new Set([
      ...incomeDaily.map((p) => p.x),
      ...expenseDaily.map((p) => p.x),
    ])
    return Array.from(set).sort((a, b) => new Date(a).getTime() - new Date(b).getTime())
  }, [incomeDaily, expenseDaily])

  // 4) Crear datos para el gráfico de barras agrupadas
  const chartData = useMemo(() => {
    const incomeUSDData = allDates.map(date => {
      const incomePoint = incomeDaily.find(p => p.x === date)
      return incomePoint ? incomePoint.yUSD : 0
    })
    
    const incomeBSData = allDates.map(date => {
      const incomePoint = incomeDaily.find(p => p.x === date)
      return incomePoint ? incomePoint.yBS : 0
    })
    
    const expenseData = allDates.map(date => {
      const expensePoint = expenseDaily.find(p => p.x === date)
      return expensePoint ? expensePoint.y : 0
    })

    return {
      labels: allDates.map(date => new Date(date).toLocaleDateString('es-ES')),
      datasets: [
        {
          label: '💰 Ingresos en USD',
          data: incomeUSDData,
          backgroundColor: 'rgba(16, 185, 129, 0.8)',
          borderColor: '#10B981',
          borderWidth: 2,
          hoverBackgroundColor: 'rgba(16, 185, 129, 0.9)',
          hoverBorderColor: '#059669',
          hoverBorderWidth: 3,
        },
        {
          label: '💵 Ingresos en BS (USD)',
          data: incomeBSData,
          backgroundColor: 'rgba(52, 211, 153, 0.8)',
          borderColor: '#34D399',
          borderWidth: 2,
          hoverBackgroundColor: 'rgba(52, 211, 153, 0.9)',
          hoverBorderColor: '#10B981',
          hoverBorderWidth: 3,
        },
        {
          label: '💸 Gastos',
          data: expenseData,
          backgroundColor: 'rgba(239, 68, 68, 0.8)',
          borderColor: '#EF4444',
          borderWidth: 2,
          hoverBackgroundColor: 'rgba(239, 68, 68, 0.9)',
          hoverBorderColor: '#DC2626',
          hoverBorderWidth: 3,
        },
      ],
    }
  }, [allDates, incomeDaily, expenseDaily])

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      intersect: false,
      mode: 'index' as const,
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#ffffff',
        bodyColor: '#ffffff',
        borderColor: '#e5e7eb',
        borderWidth: 1,
        cornerRadius: 8,
        displayColors: true,
        padding: 12,
        titleFont: {
          size: 13,
          weight: 'bold' as const,
        },
        bodyFont: {
          size: 12,
        },
        callbacks: {
          title: (ctx: any) => {
            return `📅 ${ctx[0].label}`;
          },
          label: (ctx: any) => {
            const value = Number(ctx.parsed.y ?? 0);
            const formattedValue = value.toLocaleString('en-US', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            });
            return `${ctx.dataset.label}: $${formattedValue}`;
          },
          labelColor: (ctx: any) => {
            return {
              borderColor: ctx.dataset.borderColor,
              backgroundColor: ctx.dataset.backgroundColor,
            };
          },
        },
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        border: {
          display: false,
        },
        ticks: {
          color: '#6b7280',
          font: {
            size: 11,
            weight: 'normal' as const,
          },
          padding: 8,
        },
        title: { 
          display: true, 
          text: '📅 Fecha',
          color: '#374151',
          font: {
            size: 13,
            weight: 'bold' as const,
          },
          padding: {
            top: 10,
            bottom: 5,
          },
        },
      },
      y: {
        beginAtZero: true,
        grid: {
          color: '#f3f4f6',
          drawBorder: false,
          lineWidth: 1,
        },
        border: {
          display: false,
        },
        ticks: {
          color: '#6b7280',
          font: {
            size: 11,
            weight: 'normal' as const,
          },
          padding: 8,
          callback: function(value: any) {
            return '$' + value.toLocaleString('en-US', {
              minimumFractionDigits: 0,
              maximumFractionDigits: 0,
            });
          },
        },
        title: { 
          display: true, 
          text: '💰 Monto (USD)',
          color: '#374151',
          font: {
            size: 13,
            weight: 'bold' as const,
          },
          padding: {
            top: 5,
            bottom: 10,
          },
        },
      },
    },
    elements: {
      bar: {
        borderRadius: {
          topLeft: 6,
          topRight: 6,
        },
        borderSkipped: false,
      },
    },
    animation: {
      duration: 1000,
      easing: 'easeInOutQuart' as const,
    },
  }

  return (
    <div className="p-0 w-full mx-auto" style={{ height: 420 }}>
      <div className="flex items-center justify-center mb-6">
        <div className="flex items-center gap-4 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <span>Ingresos USD</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-emerald-400"></div>
            <span>Ingresos BS</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <span>Gastos</span>
          </div>
        </div>
      </div>
      <div className="relative" style={{ height: 410 }}>
        <div className="bg-white rounded-lg p-4" style={{ height: '100%' }}>
          <Bar data={chartData} options={options} />
        </div>
      </div>
    </div>
  )
}
