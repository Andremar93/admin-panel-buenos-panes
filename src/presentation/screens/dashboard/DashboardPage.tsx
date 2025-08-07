import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useExpense } from '@/hooks/useExpense'
import { useIncome } from '@/hooks/useIncome'
import { useInvoices } from '@/hooks/useInvoice'
import { FormattedAmount } from '../components/FormattedAmount'
import { IncomeExpenseChart } from '@/presentation/screens/dashboard/IncomeExpenseChart'
import { IncomesChart } from '@/presentation/screens/dashboard/IncomesChart'
import { useMemo } from 'react';

export const DashboardPage = () => {

  const { expenses, loading: loadingExpenses, error: errorExpenses, applyFilters, filterRange } = useExpense();
  const { incomes, loading: loadingIncomes, error: errorIncomes, applyFilters: applyFiltersIncome, filterRange: filterRangeIncome } = useIncome();
  const { invoices, loading: loadingInvoices, error: errorInvoices } = useInvoices();
  const [startDate, setStartDate] = useState('');
  const [finishDate, setFinishDate] = useState('');

  const memoizedIncomes = useMemo(() => incomes, [incomes]);

  const totalsExpenses = expenses.reduce(
    (acc, inv) => {
      const amount = inv.amountDollars || 0;
      // const rate = inv.rate && inv.rate !== 0 ? inv.rate : 100;
      acc.efectivoDolares += inv.paymentMethod == 'dolaresEfectivo' ? inv.amountDollars : 0
      acc.efectivoBs += inv.paymentMethod == 'bsEfectivo' ? inv.amountDollars : 0
      acc.amountDollars += inv.amountDollars
      acc.gastosFijos += inv.type == 'gastosFijos' ? inv.amountDollars : 0
      acc.comprasDiarias += inv.type == 'comprasDiarias' ? inv.amountDollars : 0
      acc.gastosPersonales += inv.type == 'gastosPersonales' ? inv.amountDollars : 0
      acc.proveedor += inv.type == 'Proveedor' ? inv.amountDollars : 0
      acc.gastosExtraordinarios += inv.type == 'gastosExtraordinarios' ? inv.amountDollars : 0
      return acc;
    },
    {
      efectivoDolares: 0,
      efectivoBs: 0,
      amountDollars: 0,
      gastosFijos: 0,
      comprasDiarias: 0,
      gastosPersonales: 0,
      proveedor: 0,
      gastosExtraordinarios: 0,
    }
  );

  const totalsIncomes = incomes.reduce(
    (acc, inv) => {
      const rate = inv.rate && inv.rate !== 0 ? inv.rate : 100;

      acc.efectivoDolares += inv.efectivoDolares;
      acc.efectivoBs += inv.efectivoBs;
      acc.sitef += inv.sitef;
      acc.pagomovil += inv.pagomovil;
      acc.biopago += inv.biopago;
      acc.puntoExterno += inv.puntoExterno;
      acc.gastosBs += inv.gastosBs;
      acc.gastosDolares += inv.gastosDolares;
      acc.totalSistema += inv.totalSistema

      // Conversión a USD
      acc.efectivoBsUSD += inv.efectivoBs / rate;
      acc.sitefUSD += inv.sitef / rate;
      acc.pagomovilUSD += inv.pagomovil / rate;
      acc.biopagoUSD += inv.biopago / rate;
      acc.puntoExternoUSD += inv.puntoExterno / rate;
      acc.gastosBsUSD += inv.gastosBs / rate;

      return acc;
    },
    {
      efectivoDolares: 0,
      efectivoBs: 0,
      sitef: 0,
      pagomovil: 0,
      biopago: 0,
      puntoExterno: 0,
      gastosBs: 0,
      gastosDolares: 0,
      efectivoBsUSD: 0,
      sitefUSD: 0,
      pagomovilUSD: 0,
      biopagoUSD: 0,
      puntoExternoUSD: 0,
      gastosBsUSD: 0,
      totalSistema: 0
    }
  );

  const totalIngresosUSD =
    totalsIncomes.efectivoDolares +
    totalsIncomes.efectivoBsUSD +
    totalsIncomes.sitefUSD +
    totalsIncomes.pagomovilUSD +
    totalsIncomes.biopagoUSD +
    totalsIncomes.puntoExternoUSD;


  const totalPendienteDolares = invoices
    .filter((inv) => !inv.paid)
    .reduce((acc, inv) => acc + inv.amountDollars, 0);

  const totalPendienteBs = invoices
    .filter((inv) => !inv.paid)
    .reduce((acc, inv) => acc + inv.amountBs, 0);


  const handleApplyFilters = () => {
    applyFilters(startDate, finishDate);
    applyFiltersIncome(startDate, finishDate);
  };


  useEffect(() => {
    if (filterRange.from && filterRange.to) {
      setStartDate(filterRange.from.split('T')[0]);
      setFinishDate(filterRange.to.split('T')[0]);
    }
  }, [filterRange]);

  const [isSidebarOpen, setIsSidebarOpen] = useState(true)

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen)

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <aside
        className={`bg-gray-800 text-white p-6 transition-all duration-300 ${isSidebarOpen ? 'w-64' : 'w-16'
          }`}
      >
        <div className="flex items-center justify-between">
          <h2
            className={`text-2xl font-bold mb-8 transition-opacity duration-300 ${isSidebarOpen ? 'opacity-100' : 'opacity-0'
              }`}
          >
            Dashboard
          </h2>
          <button
            onClick={toggleSidebar}
            className="text-white focus:outline-none"
          >
            {isSidebarOpen ? '«' : '»'}
          </button>
        </div>
        <ul className="space-y-4">
          <li>
            <Link
              to="/ingresos"
              className="hover:text-gray-300 block whitespace-nowrap"
            >
              {isSidebarOpen ? 'Ingresos' : '💰'}
            </Link>
          </li>
          <li>
            <Link
              to="/gastos"
              className="hover:text-gray-300 block whitespace-nowrap"
            >
              {isSidebarOpen ? 'Gastos' : '💸'}
            </Link>
          </li>
          <li>
            <Link
              to="/facturas"
              className="hover:text-gray-300 block whitespace-nowrap"
            >
              {isSidebarOpen ? 'Facturas' : '🧾'}
            </Link>
          </li>
          <li>
            <Link
              to="/empleados"
              className="hover:text-gray-300 block whitespace-nowrap"
            >
              {isSidebarOpen ? 'Empleados' : '👥'}
            </Link>
          </li>
        </ul>
      </aside>

      {/* Main Content */}
      <main className="flex-1  p-6">
        <div className="mb-4 flex items-end justify-start gap-4">
          <div>
            <label className="block text-sm text-gray-600 mb-1">Desde</label>
            <input
              type="date"
              className="input mb-0"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-1">Hasta</label>
            <input
              type="date"
              className="input mb-0"
              value={finishDate}
              onChange={(e) => setFinishDate(e.target.value)}
            />
          </div>

          <div>
            <button
              className="btn"
              onClick={handleApplyFilters}
              disabled={!startDate || !finishDate}
            >
              Filtrar
            </button>
          </div>

          <div className="flex gap-4">
            <div className="bg-white p-4 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-2">Total Ingresos</h2>
              <p className="text-2xl font-bold text-green-600">
                <FormattedAmount amount={totalIngresosUSD} currency="USD" />
              </p>
            </div>

            <div className="bg-white p-4 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-2">Total Gastos</h2>
              <p className="text-2xl font-bold text-red-600">
                <FormattedAmount amount={totalsExpenses.amountDollars} currency="USD" />
              </p>
            </div>

            <div className="bg-white p-4 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-2">Total Facturas</h2>
              <p className="text-2xl font-bold text-blue-600">
                <FormattedAmount amount={totalPendienteDolares} currency="USD" />
              </p>
            </div>
          </div>

        </div>

        <div className='flex'>
          <IncomeExpenseChart
            incomes={totalIngresosUSD}
            expenses={totalsExpenses.amountDollars}
          />

          <IncomesChart incomes={memoizedIncomes} />

        </div>
      </main>
    </div>
  )
}
