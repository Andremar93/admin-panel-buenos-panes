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
import { useMemo } from 'react'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'

ChartJS.register(
    LineElement,
    PointElement,
    CategoryScale,
    LinearScale,
    Tooltip,
    Legend,
    TimeScale
)

export const IncomesChart = ({ incomes }) => {
    // Ordenar los ingresos por fecha
    const sortedIncomes = useMemo(() => {
        return [...incomes].sort(
            (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
        )
    }, [incomes])

    // Preparar datos para Chart.js
    const chartData = {
        labels: sortedIncomes.map((income) =>
            format(new Date(income.date), 'dd/MM', { locale: es })
        ),
        datasets: [
            {
                label: 'Ingresos',
                data: sortedIncomes.map((income) => income.totalSistema || 0),
                borderColor: '#10B981',
                backgroundColor: 'rgba(16, 185, 129, 0.2)',
                fill: true,
                tension: 0.3,
                pointRadius: 4,
                pointHoverRadius: 6,
            },
        ],
    }

    const options = {
        responsive: true,
        plugins: {
            legend: { position: 'top' },
            tooltip: {
                callbacks: {
                    label: (ctx) => `$${ctx.parsed.y.toFixed(2)}`,
                },
            },
        },
        scales: {
            x: {
                type: 'category',
                title: { display: true, text: 'Fecha' },
            },
            y: {
                beginAtZero: true,
                title: { display: true, text: 'Monto (USD)' },
            },
        },
    }

    return (
        <div className="bg-white p-4 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Ingresos por Fecha</h2>
            <Line data={chartData} options={options} />
        </div>
    )
}
