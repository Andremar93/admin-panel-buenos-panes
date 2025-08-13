import { useEffect, useState, useMemo, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { useExpense } from '@/hooks/useExpense'
import { useIncome } from '@/hooks/useIncome'
import { useInvoices } from '@/hooks/useInvoice'
import { FormattedAmount } from '../components/FormattedAmount'
import { IncomeExpenseChart } from '@/presentation/screens/dashboard/IncomeExpenseChart'
import { IncomesChart } from '@/presentation/screens/dashboard/IncomesChart'

export const DashboardPage = () => {

  const { expenses, loading: loadingExpenses, error: errorExpenses, applyFilters, filterRange } = useExpense();
  const { incomes, loading: loadingIncomes, error: errorIncomes, applyFilters: applyFiltersIncome, filterRange: filterRangeIncome } = useIncome();
  const { invoices, loading: loadingInvoices, error: errorInvoices } = useInvoices();
  const [startDate, setStartDate] = useState('');
  const [finishDate, setFinishDate] = useState('');

  // Memoizar los ingresos para evitar recálculos
  const memoizedIncomes = useMemo(() => incomes, [incomes]);

  // Memoizar el cálculo de totales de ingresos
  const totalsIncomes = useMemo(() => incomes.reduce(
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
  ), [incomes]);

  // Memoizar el total de ingresos en USD
  const totalIngresosUSD = useMemo(() =>
    totalsIncomes.efectivoDolares +
    totalsIncomes.efectivoBsUSD +
    totalsIncomes.sitefUSD +
    totalsIncomes.pagomovilUSD +
    totalsIncomes.biopagoUSD +
    totalsIncomes.puntoExternoUSD, [totalsIncomes]
  );

  // Memoizar el total de gastos
  const totalGastos = useMemo(() =>
    expenses.reduce((acc, expense) => acc + (expense.amountDollars || 0), 0), [expenses]
  );

  // Memoizar el total pendiente de facturas
  const totalPendienteDolares = useMemo(() => invoices
    .filter((inv) => !inv.paid)
    .reduce((acc, inv) => acc + inv.amountDollars, 0), [invoices]
  );

  const totalPendienteBs = useMemo(() => invoices
    .filter((inv) => !inv.paid)
    .reduce((acc, inv) => acc + inv.amountBs, 0), [invoices]
  );

  // Memoizar la función de aplicación de filtros
  const handleApplyFilters = useCallback(() => {
    applyFilters(startDate, finishDate);
    applyFiltersIncome(startDate, finishDate);
  }, [startDate, finishDate, applyFilters, applyFiltersIncome]);

  // Memoizar la función de cambio de fecha inicial
  const handleStartDateChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setStartDate(e.target.value);
  }, []);

  // Memoizar la función de cambio de fecha final
  const handleFinishDateChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setFinishDate(e.target.value);
  }, []);

  useEffect(() => {
    if (filterRange.from && filterRange.to) {
      setStartDate(filterRange.from.split('T')[0]);
      setFinishDate(filterRange.to.split('T')[0]);
    }
  }, [filterRange]);

  // Memoizar el estado de carga general
  const isLoading = useMemo(() => 
    loadingExpenses || loadingIncomes || loadingInvoices, 
    [loadingExpenses, loadingIncomes, loadingInvoices]
  );

  // Memoizar si hay errores
  const hasErrors = useMemo(() => 
    errorExpenses || errorIncomes || errorInvoices, 
    [errorExpenses, errorIncomes, errorInvoices]
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl">Cargando dashboard...</div>
      </div>
    );
  }

  if (hasErrors) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p>Error al cargar datos del dashboard</p>
          {errorExpenses && <p>Gastos: {errorExpenses}</p>}
          {errorIncomes && <p>Ingresos: {errorIncomes}</p>}
          {errorInvoices && <p>Facturas: {errorInvoices}</p>}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      
      {/* Filtros de fecha */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <div className="flex gap-4 items-center">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Fecha Inicial
            </label>
            <input
              type="date"
              value={startDate}
              onChange={handleStartDateChange}
              className="border border-gray-300 rounded px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Fecha Final
            </label>
            <input
              type="date"
              value={finishDate}
              onChange={handleFinishDateChange}
              className="border border-gray-300 rounded px-3 py-2"
            />
          </div>
          <button
            onClick={handleApplyFilters}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mt-6"
          >
            Aplicar Filtros
          </button>
        </div>
      </div>

      {/* Resumen de totales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Total Ingresos USD</h3>
          <p className="text-2xl font-bold text-green-600">
            <FormattedAmount amount={totalIngresosUSD} />
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Total Gastos USD</h3>
          <p className="text-2xl font-bold text-red-600">
            <FormattedAmount amount={totalGastos} />
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Pendiente USD</h3>
          <p className="text-2xl font-bold text-yellow-600">
            <FormattedAmount amount={totalPendienteDolares} />
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Pendiente Bs</h3>
          <p className="text-2xl font-bold text-yellow-600">
            <FormattedAmount amount={totalPendienteBs} />
          </p>
        </div>
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <IncomeExpenseChart incomes={totalIngresosUSD} expenses={totalGastos} />
        <IncomesChart incomes={memoizedIncomes} />
      </div>

      {/* Enlaces rápidos */}
      <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
        <Link to="/ingresos" className="bg-blue-500 text-white p-4 rounded-lg text-center hover:bg-blue-600">
          Gestionar Ingresos
        </Link>
        <Link to="/gastos" className="bg-red-500 text-white p-4 rounded-lg text-center hover:bg-red-600">
          Gestionar Gastos
        </Link>
        <Link to="/facturas" className="bg-yellow-500 text-white p-4 rounded-lg text-center hover:bg-yellow-600">
          Gestionar Facturas
        </Link>
        <Link to="/salarios" className="bg-green-500 text-white p-4 rounded-lg text-center hover:bg-green-600">
          Gestionar Salarios
        </Link>
        <Link to="/deudas-empleados" className="bg-green-500 text-white p-4 rounded-lg text-center hover:bg-green-600">
          Gestionar Deudas Empleados
        </Link>
      </div>
    </div>
  );
};
