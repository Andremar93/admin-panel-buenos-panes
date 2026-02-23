import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useExpense } from '@/hooks/useExpense';
import { useIncome } from '@/hooks/useIncome';
import { useInvoices } from '@/hooks/useInvoice';
import { useDashboardStats, type CurrencyView } from '@/hooks/useDashboardStats';
import { FormattedAmount } from '../components/FormattedAmount';
import { IncomeExpenseChart } from '@/presentation/screens/dashboard/IncomeExpenseChart';
import { DonutChart } from './DonutChart';

// Keep this outside the component so it doesn't get recreated on every render
const EXPENSE_COLOR_MAP: Record<string, string> = {
  'Nómina': '#10b981',
  'Proveedor': '#3b82f6',
  'Harina': '#d946ef',
  'comprasDiarias': '#f59e0b',
  'gastosFijos': '#ef4444',
  'gastosPersonales': '#6b7280',
  'gastosExtraordinarios': '#c027b7',
};

export const DashboardPage = () => {
  const [currencyView, setCurrencyView] = useState<CurrencyView>('USD');

  const {
    expenses,
    loading: loadingExpenses,
    error: errorExpenses,
    applyFilters,
    filterRange,
  } = useExpense();

  const {
    incomes,
    loading: loadingIncomes,
    error: errorIncomes,
    applyFilters: applyFiltersIncome,
    filterRange: filterRangeIncome,
  } = useIncome();

  const {
    invoices,
    loading: loadingInvoices,
    error: errorInvoices,
  } = useInvoices();

  const [startDate, setStartDate] = useState('');
  const [finishDate, setFinishDate] = useState('');

  // Apply both income + expense filters together
  const handleApplyFilters = useCallback(() => {
    applyFilters(startDate, finishDate);
    applyFiltersIncome(startDate, finishDate);
  }, [startDate, finishDate, applyFilters, applyFiltersIncome]);

  const handleStartDateChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => setStartDate(e.target.value),
    []
  );

  const handleFinishDateChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => setFinishDate(e.target.value),
    []
  );

  // Sync local inputs when expense range changes (keeps your original behavior)
  useEffect(() => {
    if (filterRange.from && filterRange.to) {
      setStartDate(filterRange.from.split('T')[0] || '');
      setFinishDate(filterRange.to.split('T')[0] || '');
    }
  }, [filterRange]);

  const isLoading = useMemo(
    () => loadingExpenses || loadingIncomes || loadingInvoices,
    [loadingExpenses, loadingIncomes, loadingInvoices]
  );

  const hasErrors = useMemo(
    () => Boolean(errorExpenses || errorIncomes || errorInvoices),
    [errorExpenses, errorIncomes, errorInvoices]
  );

  // All derived stats in one place
  const stats = useDashboardStats({
    incomes,
    expenses,
    invoices,
    currencyView,
    filterRangeIncome,
    startDate,
    finishDate,
    expenseColorMap: EXPENSE_COLOR_MAP,
  });

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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b px-6 py-2 flex justify-between items-center">
        <div className="px-6 py-4">
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Resumen financiero de Buenos Panes</p>
        </div>

        <div className="flex gap-4 items-end">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Fecha Inicial
            </label>
            <input
              type="date"
              value={startDate}
              onChange={handleStartDateChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Fecha Final
            </label>
            <input
              type="date"
              value={finishDate}
              onChange={handleFinishDateChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            onClick={handleApplyFilters}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Aplicar Filtros
          </button>
        </div>
      </div>

      <div className="px-6 py-4">
        {/* Top row */}
        <div className="grid grid-cols-1 lg:grid-cols-[35%_65%] gap-6 mb-6">
          {/* Bank accounts */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Cuentas de Bancos</h3>
              <div className="flex items-center text-sm text-gray-500">
                <span>Efectivo &amp; Cuentas</span>
                <svg
                  className="w-4 h-4 ml-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            </div>

            <div className="space-y-3 mb-4">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-bold mr-3">
                    BE
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">Bancamiga Externa</p>
                    <p className="text-sm text-gray-500">Actualizado</p>
                  </div>
                </div>
                <p className="font-semibold text-gray-800">
                  <FormattedAmount
                    amount={stats.incomeToday.puntoExterno}
                    currency="Bs"
                    prefix=""
                  />
                </p>
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center text-white text-sm font-bold mr-3">
                    VE
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">Banco Venezuela</p>
                    <p className="text-sm text-gray-500">Actualizado</p>
                  </div>
                </div>
                <p className="font-semibold text-gray-800">
                  <FormattedAmount
                    amount={stats.incomeToday.biopago + stats.incomeToday.pagomovil}
                    currency="Bs"
                    prefix=""
                  />
                </p>
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-yellow-600 rounded-full flex items-center justify-center text-white text-sm font-bold mr-3">
                    BE
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">Bancamiga Empresa</p>
                    <p className="text-sm text-gray-500">Actualizado</p>
                  </div>
                </div>
                <p className="font-semibold text-gray-800">
                  <FormattedAmount amount={stats.incomeToday.sitef} currency="Bs" prefix="" />
                </p>
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center text-white text-sm font-bold mr-3">
                    Bs
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">Efectivo Bolívares</p>
                    <p className="text-sm text-gray-500">Actualizado</p>
                  </div>
                </div>
                <p className="font-semibold text-gray-800">
                  <FormattedAmount amount={stats.incomeToday.efectivoBs} currency="Bs" prefix="" />
                </p>
              </div>
            </div>

            <div className="border-t pt-4 mb-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-600">Balance Bs (Sin efectivo)</span>
                <span className="text-lg font-bold text-green-800">
                  <FormattedAmount
                    amount={
                      stats.incomeToday.puntoExterno +
                      stats.incomeToday.biopago +
                      stats.incomeToday.pagomovil +
                      stats.incomeToday.sitef
                    }
                    currency="Bs"
                    prefix=""
                  />
                </span>
              </div>
            </div>

            <div className="pt-4 mb-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-600">Gastos Bs</span>
                <span className="text-lg font-bold text-red-600">
                  - <FormattedAmount amount={stats.totalGastosTodayBs} currency="Bs" prefix="" />
                </span>
              </div>
            </div>

            <div className="border-t pt-4 mb-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-600">Balance Bs (Con gastos)</span>
                <span
                  className={`text-lg font-bold ${
                    stats.totalGastosTodayBs > 0 ? 'text-red-600' : 'text-green-600'
                  }`}
                >
                  <FormattedAmount
                    amount={
                      stats.incomeToday.puntoExterno +
                      stats.incomeToday.biopago +
                      stats.incomeToday.pagomovil +
                      stats.incomeToday.sitef -
                      stats.totalGastosTodayBs
                    }
                    currency="Bs"
                    prefix=""
                  />
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center text-white text-sm font-bold mr-3">
                  $
                </div>
                <div>
                  <p className="font-medium text-gray-800">Efectivo Dólares</p>
                  <p className="text-sm text-gray-500">Actualizado</p>
                </div>
              </div>
              <p className="font-semibold text-gray-800">
                <FormattedAmount amount={stats.incomeToday.efectivoDolares} currency="USD" />
              </p>
            </div>
          </div>

          {/* Income & expense chart */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-800">Ingresos &amp; Gastos</h3>

            <div className="mb-6">
              <IncomeExpenseChart
                title=""
                incomes={incomes}
                expenses={expenses}
                incomeAmountKey="totalSistema"
                expenseAmountKey="amountDollars"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-sm text-gray-600 mb-1">INGRESOS</div>
                <div className="text-lg font-bold text-green-600">
                  <FormattedAmount amount={stats.totalIngresosUSD} />
                  <br />
                  <FormattedAmount amount={stats.totalIngresosBs} currency="Bs" prefix="" />
                </div>
              </div>

              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-sm text-gray-600 mb-1">GASTOS</div>
                <div className="text-lg font-bold text-red-600">
                  <FormattedAmount amount={stats.totalGastosUSD} />
                  <br />
                  <FormattedAmount amount={stats.totalGastosBs} currency="Bs" prefix="" />
                </div>
              </div>

              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-sm text-gray-600 mb-1">GANANCIA</div>
                <div className="text-lg font-bold text-green-600">
                  <FormattedAmount amount={stats.totalIngresosUSD - stats.totalGastosUSD} />
                  <br />
                  <FormattedAmount
                    amount={stats.totalIngresosBs - stats.totalGastosBs}
                    currency="Bs"
                    prefix=""
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom row */}
        <div className="grid grid-cols-1 lg:grid-cols-[30%_70%] gap-6">
          {/* Invoices */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Facturas</h3>

            <div className="mb-4">
              <div className="w-full h-4 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full flex">
                  <div className="bg-green-500 h-full" style={{ width: `${stats.pagadoPercent}%` }} />
                  <div className="bg-red-500 h-full" style={{ width: `${stats.porPagarPercent}%` }} />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-green-500 rounded mr-2" />
                  <span className="text-sm text-gray-600">PAGADO</span>
                </div>
                <span className="text-sm font-semibold text-green-600">
                  <FormattedAmount amount={stats.totalProveedoresUSD} />
                </span>
              </div>

              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-red-500 rounded mr-2" />
                  <span className="text-sm text-gray-600">POR PAGAR</span>
                </div>
                <span className="text-sm font-semibold text-red-600">
                  <FormattedAmount amount={stats.totalPendienteDolares} />
                </span>
              </div>
            </div>
          </div>

          {/* Donuts + currency toggle */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex justify-center mb-6">
              <div className="relative flex bg-gray-100 rounded-xl p-1 w-40">
                <div
                  className={`absolute top-1 bottom-1 w-1/2 rounded-lg bg-blue-600 transition-all duration-300 ${
                    currencyView === 'USD' ? 'left-1' : 'left-1/2'
                  }`}
                />

                <button
                  onClick={() => setCurrencyView('USD')}
                  className={`relative z-10 w-1/2 py-1.5 text-sm font-medium transition-colors duration-200 ${
                    currencyView === 'USD' ? 'text-white' : 'text-gray-600'
                  }`}
                >
                  USD
                </button>

                <button
                  onClick={() => setCurrencyView('Bs')}
                  className={`relative z-10 w-1/2 py-1.5 text-sm font-medium transition-colors duration-200 ${
                    currencyView === 'Bs' ? 'text-white' : 'text-gray-600'
                  }`}
                >
                  Bs
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              {/* Expense summary */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Resumen de Gastos</h3>

                <div className="mb-4 flex justify-center">
                  <DonutChart data={stats.gastosChartData} size={120} strokeWidth={12} />
                </div>

                <div className="space-y-2">
                  {stats.gastosChartData.map((item, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <div className="flex items-center">
                        <div className="w-3 h-3 rounded mr-2" style={{ backgroundColor: item.color }} />
                        <span className="text-sm text-gray-600">
                          {item.label}{' '}
                          <span className="text-gray-400">({item.percentage.toFixed(1)}%)</span>
                        </span>
                      </div>
                      <span className="text-sm font-semibold text-gray-800">
                        <FormattedAmount amount={item.value} currency={currencyView} />
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Income summary */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Resumen de Ingresos</h3>

                <div className="mb-4 flex justify-center">
                  <DonutChart data={stats.ingresosChartData} size={120} strokeWidth={12} />
                </div>

                <div className="space-y-2 mb-4">
                  {stats.ingresosChartData.map((item, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <div className="flex items-center">
                        <div className="w-3 h-3 rounded mr-2" style={{ backgroundColor: item.color }} />
                        <span className="text-sm text-gray-600">
                          {item.label}{' '}
                          <span className="text-gray-400">({item.percentage.toFixed(1)}%)</span>
                        </span>
                      </div>
                      <span className="text-sm font-semibold text-gray-800">
                        <FormattedAmount amount={item.value} currency={currencyView} />
                      </span>
                    </div>
                  ))}
                </div>

                <div className="border-t pt-4 mt-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-600">Promedio Diario</span>
                    <span className="text-lg font-bold text-green-600">
                      <FormattedAmount amount={stats.promedioDiarioIngresos} />
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* If you want to use these later:
                stats.expensesYesterday, stats.incomeYesterday */}
          </div>
        </div>
      </div>
    </div>
  );
};