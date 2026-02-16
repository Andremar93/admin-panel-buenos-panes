import { useEffect, useState, useMemo, useCallback } from 'react'
import { useExpense } from '@/hooks/useExpense'
import { useIncome } from '@/hooks/useIncome'
import { useInvoices } from '@/hooks/useInvoice'
import { FormattedAmount } from '../components/FormattedAmount'
import { IncomeExpenseChart } from '@/presentation/screens/dashboard/IncomeExpenseChart'
import { DonutChart } from './DonutChart'

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

      acc.efectivoBs += inv.efectivoBs;
      acc.sitef += inv.sitef;
      acc.pagomovil += inv.pagomovil;
      acc.biopago += inv.biopago;
      acc.puntoExterno += inv.puntoExterno;
      acc.gastosBs += inv.gastosBs;

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

  const totalsIncomesToday = useMemo(() => {
    const inv = incomes[0];
    if (!inv) return {
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
    };

    const rate = inv.rate && inv.rate !== 0 ? inv.rate : 100;

    return {
      efectivoDolares: inv.efectivoDolares,
      efectivoBs: inv.efectivoBs,
      sitef: inv.sitef,
      pagomovil: inv.pagomovil,
      biopago: inv.biopago,
      puntoExterno: inv.puntoExterno,
      gastosBs: inv.gastosBs,
      gastosDolares: inv.gastosDolares,
      totalSistema: inv.totalSistema,

      // Conversión a USD
      efectivoBsUSD: inv.efectivoBs / rate,
      sitefUSD: inv.sitef / rate,
      pagomovilUSD: inv.pagomovil / rate,
      biopagoUSD: inv.biopago / rate,
      puntoExternoUSD: inv.puntoExterno / rate,
      gastosBsUSD: inv.gastosBs / rate
    };
  }, [incomes]);

  const totalsIncomesTheDayBefore = useMemo(() => {
    const inv = incomes[1];
    if (!inv) return {
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
    };

    const rate = inv.rate && inv.rate !== 0 ? inv.rate : 100;

    return {
      efectivoDolares: inv.efectivoDolares,
      efectivoBs: inv.efectivoBs,
      sitef: inv.sitef,
      pagomovil: inv.pagomovil,
      biopago: inv.biopago,
      puntoExterno: inv.puntoExterno,
      gastosBs: inv.gastosBs,
      gastosDolares: inv.gastosDolares,
      totalSistema: inv.totalSistema,

      // Conversión a USD
      efectivoBsUSD: inv.efectivoBs / rate,
      sitefUSD: inv.sitef / rate,
      pagomovilUSD: inv.pagomovil / rate,
      biopagoUSD: inv.biopago / rate,
      puntoExternoUSD: inv.puntoExterno / rate,
      gastosBsUSD: inv.gastosBs / rate
    };
  }, [incomes]);


  // Memoizar el total de ingresos en USD
  const totalIngresosUSD = useMemo(() =>
    totalsIncomes.efectivoDolares +
    totalsIncomes.efectivoBsUSD +
    totalsIncomes.sitefUSD +
    totalsIncomes.pagomovilUSD +
    totalsIncomes.biopagoUSD +
    totalsIncomes.puntoExternoUSD, [totalsIncomes]
  );

  const totalIngresosBs = useMemo(() =>
    totalsIncomes.efectivoBs +
    totalsIncomes.sitef +
    totalsIncomes.pagomovil +
    totalsIncomes.biopago +
    totalsIncomes.puntoExterno, [totalsIncomes]
  );
  // Calcular el promedio diario de ingresos
  const promedioDiarioIngresos = useMemo(() => {
    if (totalIngresosUSD === 0) return 0;

    // Si hay un rango de fechas filtrado, usar ese rango
    if (filterRangeIncome.from && filterRangeIncome.to) {
      const fromDate = new Date(filterRangeIncome.from);
      const toDate = new Date(filterRangeIncome.to);
      const diffTime = Math.abs(toDate.getTime() - fromDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // +1 para incluir ambos días
      return diffDays > 0 ? totalIngresosUSD / diffDays : 0;
    }

    // Si hay fechas seleccionadas manualmente, usar esas
    if (startDate && finishDate) {
      const fromDate = new Date(startDate);
      const toDate = new Date(finishDate);
      const diffTime = Math.abs(toDate.getTime() - fromDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
      return diffDays > 0 ? totalIngresosUSD / diffDays : 0;
    }

    // Si no hay filtros, usar el número de registros de ingresos como base
    const numRegistros = incomes.length;
    return numRegistros > 0 ? totalIngresosUSD / numRegistros : 0;
  }, [totalIngresosUSD, filterRangeIncome, startDate, finishDate, incomes.length]);

  console.log('expenses', expenses)
  // Memoizar el total de gastos
  const totalGastos = useMemo(() =>
    expenses.reduce((acc, expense) => acc + (expense.amountDollars || 0), 0), [expenses]
  );

  const totalGastosBs = useMemo(() =>
    expenses.reduce((acc, expense) => acc + (expense.amountBs || 0), 0), [expenses]
  );


  const expensesToday = useMemo(() => {
    const today = new Date();
    const todayUTCYear = today.getUTCFullYear();
    const todayUTCMonth = today.getUTCMonth();
    const todayUTCDay = today.getUTCDate();

    return expenses.filter(exp => {
      const expenseDate = new Date(exp.date);
      return (
        expenseDate.getUTCFullYear() === todayUTCYear &&
        expenseDate.getUTCMonth() === todayUTCMonth &&
        expenseDate.getUTCDate() === todayUTCDay
      );
    });
  }, [expenses]);


  const expensesYesterday = useMemo(() => {
    const today = new Date();

    // Create a new date for "yesterday" in UTC
    const yesterdayUTC = new Date(Date.UTC(
      today.getUTCFullYear(),
      today.getUTCMonth(),
      today.getUTCDate() - 1
    ));

    const yesterdayYear = yesterdayUTC.getUTCFullYear();
    const yesterdayMonth = yesterdayUTC.getUTCMonth();
    const yesterdayDay = yesterdayUTC.getUTCDate();

    return expenses.filter(exp => {
      const expenseDate = new Date(exp.date);
      return (
        expenseDate.getUTCFullYear() === yesterdayYear &&
        expenseDate.getUTCMonth() === yesterdayMonth &&
        expenseDate.getUTCDate() === yesterdayDay
      );
    });
  }, [expenses]);


  // Total de gastos del día en dólares
  const totalGastosToday = useMemo(() =>
    expensesToday.reduce((acc, expense) => acc + (expense.amountBs || 0), 0),
    [expensesToday]
  );

  // 🔹 Agrupar totales por tipo
  const totalsByType = expenses.reduce((acc, expense) => {
    const { type, amountDollars = 0, amountBs = 0 } = expense;

    if (!acc[type]) {
      acc[type] = { totalDollars: 0, totalBs: 0 };
    }

    acc[type].totalDollars += amountDollars;
    acc[type].totalBs += amountBs;

    return acc;
  }, {} as Record<string, { totalDollars: number; totalBs: number }>);

  // 🔹 Convertir a array legible
  const result = Object.entries(totalsByType).map(([type, totals]) => ({
    type,
    ...(totals as { totalDollars: number; totalBs: number }),
  }));

  // 🔹 Ordenar de mayor a menor por totalDollars
  const sortedResult = [...result].sort((a, b) => b.totalDollars - a.totalDollars);

  // 🔹 Calcular totales generales
  const grandTotals = sortedResult.reduce(
    (acc, curr) => ({
      totalDollars: acc.totalDollars + curr.totalDollars,
      totalBs: acc.totalBs + curr.totalBs,
    }),
    { totalDollars: 0, totalBs: 0 }
  );

  // 🔹 Construir datos para gráfico (ordenado)
  const gastosData = useMemo(() => {
    const data = [
      { label: 'Nómina', value: sortedResult.find(item => item.type === 'Nómina')?.totalDollars || 0, color: '#10b981' },
      { label: 'Proveedores', value: sortedResult.find(item => item.type === 'Proveedor')?.totalDollars || 0, color: '#3b82f6' },
      { label: 'Harina', value: sortedResult.find(item => item.type === 'Harina')?.totalDollars || 0, color: '#d946ef' },
      { label: 'Compras Diarías', value: sortedResult.find(item => item.type === 'comprasDiarias')?.totalDollars || 0, color: '#f59e0b' },
      { label: 'Gastos Fijos', value: sortedResult.find(item => item.type === 'gastosFijos')?.totalDollars || 0, color: '#ef4444' },
      { label: 'Gastos Personales', value: sortedResult.find(item => item.type === 'gastosPersonales')?.totalDollars || 0, color: '#6b7280' },
      { label: 'Gastos Extraordinarios', value: sortedResult.find(item => item.type === 'gastosExtraordinarios')?.totalDollars || 0, color: '#c027b7' }
    ].sort((a, b) => b.value - a.value);

    // Calcular el total para calcular porcentajes
    const total = data.reduce((sum, item) => sum + item.value, 0);

    // Añadir el porcentaje a cada item
    return data.map(item => ({
      ...item,
      percentage: total > 0 ? (item.value / total) * 100 : 0
    }));
  }, [sortedResult]);

  // 🔹 Construir datos para gráfico de ingresos (ordenado)
  const ingresosData = useMemo(() => {
    const data = [
      { label: 'Efectivo Dólares', value: totalsIncomes.efectivoDolares, color: '#10b981' },
      { label: 'Efectivo Bs', value: totalsIncomes.efectivoBsUSD, color: '#3b82f6' },
      { label: 'Sitef', value: totalsIncomes.sitefUSD, color: '#d946ef' },
      { label: 'Pago Móvil', value: totalsIncomes.pagomovilUSD, color: '#f59e0b' },
      { label: 'Biopago', value: totalsIncomes.biopagoUSD, color: '#ef4444' },
      { label: 'Punto Externo', value: totalsIncomes.puntoExternoUSD, color: '#6b7280' }
    ].sort((a, b) => b.value - a.value);

    // Calcular el total para calcular porcentajes
    const total = data.reduce((sum, item) => sum + item.value, 0);

    // Añadir el porcentaje a cada item
    return data.map(item => ({
      ...item,
      percentage: total > 0 ? (item.value / total) * 100 : 0
    }));
  }, [totalsIncomes]);


  // Memoizar el total pendiente de facturas
  const totalPendienteDolares = useMemo(() => invoices
    .filter((inv) => !inv.paid)
    .reduce((acc, inv) => acc + inv.amountDollars, 0), [invoices]
  );

  const totalProveedores = gastosData.find((item) => item.label === "Proveedores")?.value || 0;
  const total = totalProveedores + totalPendienteDolares;
  const pagadoPercent = total ? (totalProveedores / total) * 100 : 0;
  const porPagarPercent = total ? (totalPendienteDolares / total) * 100 : 0;


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
      setStartDate(filterRange.from.split('T')[0] || '');
      setFinishDate(filterRange.to.split('T')[0] || '');
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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b px-6 py-2 flex justify-between items-center">
        <div className="px-6 py-4">
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Resumen financiero de Buenos Panes</p>
        </div>

        <div className="flex gap-4 items-end">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">Fecha Inicial</label>
            <input
              type="date"
              value={startDate}
              onChange={handleStartDateChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">Fecha Final</label>
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

        {/* Dashboard Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-[35%_65%] gap-6 mb-6">
          {/* Cuentas de Bancos */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Cuentas de Bancos</h3>
              <div className="flex items-center text-sm text-gray-500">
                <span>Efectivo & Cuentas</span>
                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
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
                  <FormattedAmount amount={totalsIncomesToday.puntoExterno} currency="Bs" prefix='' />
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
                  <FormattedAmount amount={totalsIncomesToday.biopago + totalsIncomesToday.pagomovil} currency="Bs" prefix='' />
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
                  <FormattedAmount amount={totalsIncomesToday.sitef} currency="Bs" prefix='' />
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
                  <FormattedAmount amount={totalsIncomesToday.efectivoBs} currency="Bs" prefix='' />
                </p>
              </div>

            </div>

            <div className="border-t pt-4 mb-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-600">Balance Bs (Sin efectivo)</span>
                <span className="text-lg font-bold text-green-800">
                  <FormattedAmount amount={
                    + totalsIncomesToday.puntoExterno +
                    totalsIncomesToday.biopago +
                    totalsIncomesToday.pagomovil +
                    totalsIncomesToday.sitef} currency="Bs" prefix='' />
                </span>
              </div>
            </div>

            <div className="pt-4 mb-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-600">Gastos Bs</span>
                <span className="text-lg font-bold text-red-600">
                  - <FormattedAmount amount={totalGastosToday} currency="Bs" prefix='' />
                </span>
              </div>
            </div>

            <div className="border-t pt-4 mb-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-600">Gastos Bs</span>
                <span
                  className={`text-lg font-bold ${totalGastosToday > 0 ? 'text-red-600' : 'text-green-600'
                    }`}
                >
                  <FormattedAmount amount={
                    totalsIncomesToday.puntoExterno +
                    totalsIncomesToday.biopago +
                    totalsIncomesToday.pagomovil +
                    totalsIncomesToday.sitef -
                    totalGastosToday} currency="Bs" prefix='' />
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
                <FormattedAmount amount={totalsIncomesToday.efectivoDolares} currency="USD" />
              </p>
            </div>
          </div>

          {/* Ingresos & Gastos - Gráfico más grande */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-800">Ingresos & Gastos</h3>

            {/* <div className="flex items-center mb-4">
              <div className="flex items-center mr-4">
                <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                <span className="text-sm text-gray-600">Ingresos</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-gray-400 rounded-full mr-2"></div>
                <span className="text-sm text-gray-600">Gastos</span>
              </div>
            </div> */}

            <div className="mb-6">
              <IncomeExpenseChart
                title=""
                incomes={memoizedIncomes}
                expenses={expenses}
                incomeAmountKey="totalSistema"
                expenseAmountKey="amountDollars"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-sm text-gray-600 mb-1">INGRESOS</div>
                <div className="text-lg font-bold text-green-600">
                  <FormattedAmount amount={totalIngresosUSD} />
                  <br />
                  <FormattedAmount amount={totalIngresosBs} currency="Bs" prefix='' />
                </div>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-sm text-gray-600 mb-1">GASTOS</div>
                <div className="text-lg font-bold text-red-600">
                  <FormattedAmount amount={totalGastos} />
                  <br />
                  <FormattedAmount amount={totalGastosBs} currency="Bs" prefix='' />
                </div>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-sm text-gray-600 mb-1">GANANCIA</div>
                <div className="text-lg font-bold text-green-600">
                  <FormattedAmount amount={totalIngresosUSD - totalGastos} />
                  <br />
                  <FormattedAmount amount={totalIngresosBs - totalGastosBs} currency="Bs" prefix='' />
                </div>
              </div>
            </div>
          </div>

          {/* Antigüedad por Cobrar */}
          {/* <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Antigüedad por Cobrar</h3>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Corriente</span>
                <div className="flex items-center">
                  <div className="w-20 h-2 bg-green-500 rounded mr-2"></div>
                  <span className="text-sm font-semibold text-green-600">
                    <FormattedAmount amount={totalPendienteDolares * 0.4} />
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">0-30</span>
                <div className="flex items-center">
                  <div className="w-16 h-2 bg-green-500 rounded mr-2"></div>
                  <span className="text-sm font-semibold text-green-600">
                    <FormattedAmount amount={totalPendienteDolares * 0.3} />
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">31-60</span>
                <div className="flex items-center">
                  <div className="w-12 h-2 bg-green-500 rounded mr-2"></div>
                  <span className="text-sm font-semibold text-green-600">
                    <FormattedAmount amount={totalPendienteDolares * 0.2} />
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">61-90</span>
                <div className="flex items-center">
                  <div className="w-8 h-2 bg-green-500 rounded mr-2"></div>
                  <span className="text-sm font-semibold text-green-600">
                    <FormattedAmount amount={totalPendienteDolares * 0.1} />
                  </span>
                </div>
              </div>
            </div>

            <div className="border-t pt-4 mt-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-600">TOTAL POR COBRAR</span>
                <span className="text-lg font-bold text-green-600">
                  <FormattedAmount amount={totalPendienteDolares} />
                </span>
              </div>
            </div>
          </div> */}

        </div>

        {/* Bottom Row */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Facturas por Pagar */}
          {/* <div className="lg:col-span-2 bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Facturas por Pagar</h3>
              <div className="flex items-center text-sm text-gray-500">
                <span>Mostrar: Semana</span>
                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">Hoy</h4>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-red-500 rounded-full mt-2"></div>
                  <div>
                    <p className="text-sm text-gray-600">Hace 5 días</p>
                    <p className="text-sm text-gray-800">Pago pendiente para la factura #1234 de Terra Performance Inc.</p>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">Esta semana</h4>
                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-gray-400 rounded-full mt-2"></div>
                    <div>
                      <p className="text-sm text-gray-600">Pago entrante</p>
                      <p className="text-sm text-gray-800">Tienes un pago entrante de Joey Mantia.</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-gray-400 rounded-full mt-2"></div>
                    <div>
                      <p className="text-sm text-gray-600">Conciliación bancaria</p>
                      <p className="text-sm text-gray-800">Tu cuenta de cheques del Banco Popular necesita conciliación.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div> */}

          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Facturas</h3>

            <div className="mb-4">
              <div className="w-full h-4 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full flex">
                  <div
                    className="bg-green-500 h-full"
                    style={{ width: `${pagadoPercent}%` }}
                  ></div>
                  <div
                    className="bg-red-500 h-full"
                    style={{ width: `${porPagarPercent}%` }}
                  ></div>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-green-500 rounded mr-2"></div>
                  <span className="text-sm text-gray-600">PAGADO</span>
                </div>
                <span className="text-sm font-semibold text-green-600">
                  <FormattedAmount amount={gastosData.find(item => item.label === 'Proveedores')?.value || 0} />
                </span>
              </div>
              {/* <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-yellow-500 rounded mr-2"></div>
                  <span className="text-sm text-gray-600">PENDIENTE</span>
                </div>
                <span className="text-sm font-semibold text-yellow-600">
                  <FormattedAmount amount={totalPendienteDolares * 0.3} />
                </span>
              </div> */}
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-red-500 rounded mr-2"></div>
                  <span className="text-sm text-gray-600">POR PAGAR</span>
                </div>
                <span className="text-sm font-semibold text-red-600">
                  <FormattedAmount amount={totalPendienteDolares} />
                </span>
              </div>
            </div>

            {/* <h3 className="text-lg font-semibold text-gray-800 mb-4 mt-4">Pagos</h3> */}

          </div>

          {/* Resumen de Gastos */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Resumen de Gastos</h3>

            <div className="mb-4 flex justify-center">
              <DonutChart data={gastosData} size={120} strokeWidth={12} />
            </div>

            <div className="space-y-2">
              {gastosData.map((item, index) => (
                <div key={index} className="flex justify-between items-center">
                  <div className="flex items-center">
                    <div
                      className="w-3 h-3 rounded mr-2"
                      style={{ backgroundColor: item.color }}
                    ></div>
                    <span className="text-sm text-gray-600">
                      {item.label} <span className="text-gray-400">({item.percentage.toFixed(1)}%)</span>
                    </span>
                  </div>
                  <span className="text-sm font-semibold text-gray-800">
                    <FormattedAmount amount={item.value} />
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Resumen de Ingresos */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Resumen de Ingresos</h3>

            <div className="mb-4 flex justify-center">
              <DonutChart data={ingresosData} size={120} strokeWidth={12} />
            </div>

            <div className="space-y-2 mb-4">
              {ingresosData.map((item, index) => (
                <div key={index} className="flex justify-between items-center">
                  <div className="flex items-center">
                    <div
                      className="w-3 h-3 rounded mr-2"
                      style={{ backgroundColor: item.color }}
                    ></div>
                    <span className="text-sm text-gray-600">
                      {item.label} <span className="text-gray-400">({item.percentage.toFixed(1)}%)</span>
                    </span>
                  </div>
                  <span className="text-sm font-semibold text-gray-800">
                    <FormattedAmount amount={item.value} />
                  </span>
                </div>
              ))}
            </div>

            <div className="border-t pt-4 mt-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-600">Promedio Diario</span>
                <span className="text-lg font-bold text-green-600">
                  <FormattedAmount amount={promedioDiarioIngresos} />
                </span>
              </div>
            </div>
          </div>

        </div>

        {/* Antigüedad por Pagar - Nueva fila */}
        {/* <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Antigüedad por Pagar</h3>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Corriente</span>
                <div className="flex items-center">
                  <div className="w-16 h-2 bg-red-500 rounded mr-2"></div>
                  <span className="text-sm font-semibold text-red-600">
                    <FormattedAmount amount={totalGastos * 0.15} />
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">0-30</span>
                <div className="flex items-center">
                  <div className="w-20 h-2 bg-red-500 rounded mr-2"></div>
                  <span className="text-sm font-semibold text-red-600">
                    <FormattedAmount amount={totalGastos * 0.25} />
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">31-60</span>
                <div className="flex items-center">
                  <div className="w-12 h-2 bg-red-500 rounded mr-2"></div>
                  <span className="text-sm font-semibold text-red-600">
                    <FormattedAmount amount={totalGastos * 0.2} />
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">61-90</span>
                <div className="flex items-center">
                  <div className="w-8 h-2 bg-red-500 rounded mr-2"></div>
                  <span className="text-sm font-semibold text-red-600">
                    <FormattedAmount amount={totalGastos * 0.15} />
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">90+</span>
                <div className="flex items-center">
                  <div className="w-4 h-2 bg-red-500 rounded mr-2"></div>
                  <span className="text-sm font-semibold text-red-600">
                    <FormattedAmount amount={totalGastos * 0.1} />
                  </span>
                </div>
              </div>
            </div>

            <div className="border-t pt-4 mt-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-600">TOTAL POR PAGAR</span>
                <span className="text-lg font-bold text-red-600">
                  <FormattedAmount amount={totalGastos * 0.85} />
                </span>
              </div>
            </div>
          </div>


          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Resumen General</h3>
            <div className="space-y-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-sm text-gray-600 mb-1">TOTAL ACTIVOS</div>
                <div className="text-xl font-bold text-blue-600">
                  <FormattedAmount amount={totalIngresosUSD} />
                </div>
              </div>
              <div className="text-center p-4 bg-red-50 rounded-lg">
                <div className="text-sm text-gray-600 mb-1">TOTAL PASIVOS</div>
                <div className="text-xl font-bold text-red-600">
                  <FormattedAmount amount={totalGastos} />
                </div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-sm text-gray-600 mb-1">PATRIMONIO NETO</div>
                <div className="text-xl font-bold text-green-600">
                  <FormattedAmount amount={totalIngresosUSD - totalGastos} />
                </div>
              </div>
            </div>
          </div>
        </div> */}

        {/* Enlaces rápidos */}
        {/* <div className="mt-8 grid grid-cols-2 md:grid-cols-5 gap-4">
          <Link to="/ingresos" className="bg-blue-600 text-white p-4 rounded-lg text-center hover:bg-blue-700 transition-colors">
            <div className="text-sm font-medium">Gestionar Ingresos</div>
          </Link>
          <Link to="/gastos" className="bg-red-600 text-white p-4 rounded-lg text-center hover:bg-red-700 transition-colors">
            <div className="text-sm font-medium">Gestionar Gastos</div>
          </Link>
          <Link to="/facturas" className="bg-yellow-600 text-white p-4 rounded-lg text-center hover:bg-yellow-700 transition-colors">
            <div className="text-sm font-medium">Gestionar Facturas</div>
          </Link>
          <Link to="/salarios" className="bg-green-600 text-white p-4 rounded-lg text-center hover:bg-green-700 transition-colors">
            <div className="text-sm font-medium">Gestionar Salarios</div>
          </Link>
          <Link to="/deudas-empleados" className="bg-purple-600 text-white p-4 rounded-lg text-center hover:bg-purple-700 transition-colors">
            <div className="text-sm font-medium">Deudas Empleados</div>
          </Link>
        </div> */}
      </div>
    </div>
  );
};
