// components/IncomeExpenseChart.tsx
import { Bar } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from 'chart.js'

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend)

export const IncomeExpenseChart = ({ incomes, expenses }: { incomes: number; expenses: number }) => {
  const data = {
    labels: ['Ingresos', 'Gastos'],
    datasets: [
      {
        label: 'USD',
        data: [incomes, expenses],
        backgroundColor: ['#10B981', '#EF4444'],
      },
    ],
  }

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
    },
  }

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4">Ingresos vs Gastos</h2>
      <Bar data={data} options={options} />
    </div>
  )
}
