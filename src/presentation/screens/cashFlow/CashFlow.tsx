import { useEffect, useState, useMemo } from 'react';
import { useIncome } from '@/hooks/useIncome';
import { FormattedAmount } from '../components/FormattedAmount';

export const CashFlow = () => {
    const { incomes, loading, error, applyFilters } = useIncome();
    const [startDate, setStartDate] = useState('');
    const [finishDate, setFinishDate] = useState('');

    // Get yesterday's date in YYYY-MM-DD format
    useEffect(() => {
        const today = new Date();
        const yesterdayDate = new Date(today);
        yesterdayDate.setDate(today.getDate() - 1);
        const dateStr = yesterdayDate.toISOString().split('T')[0];
        if (dateStr) {
            setStartDate(dateStr);
            setFinishDate(dateStr);
        }
    }, []);

    // Apply filters when dates change
    useEffect(() => {
        if (startDate && finishDate) {
            applyFilters(startDate, finishDate);
        }
    }, [startDate, finishDate, applyFilters]);

    // Calculate grouped account balances from yesterday's incomes
    const accountBalances = useMemo(() => {
        const accounts = {
            cuentaExterna: 0,
            cuentaExternaDolares: 0,
            venezuela: 0,
            venezuelaDolares: 0,
            empresa: 0,
            empresaDolares: 0,
            efectivoDolares: 0,
            efectivoBs: 0,
            efectivoBsDolares: 0,
        };

        incomes.forEach((income) => {
            const rate = income.rate && income.rate !== 0 ? income.rate : 100;

            // CuentaExterna = puntoExterno
            accounts.cuentaExterna += income.puntoExterno;
            accounts.cuentaExternaDolares += income.puntoExterno / rate;

            // Venezuela = biopago + pagomovil
            accounts.venezuela += (income.biopago + income.pagomovil);
            accounts.venezuelaDolares += (income.biopago + income.pagomovil) / rate;

            // Empresa = sitef
            accounts.empresa += income.sitef;
            accounts.empresaDolares += income.sitef / rate;

            // Efectivo en dólares
            accounts.efectivoDolares += income.efectivoDolares;

            //Efectivo en Bolívares
            accounts.efectivoBs += income.efectivoBs;
            accounts.efectivoBsDolares += income.efectivoBs / rate;
        });

        return accounts;
    }, [incomes]);

    const totalExpected = accountBalances.cuentaExterna +
        accountBalances.venezuela +
        accountBalances.empresa +
        accountBalances.efectivoBs;

    const totalExpectedDolares = accountBalances.cuentaExternaDolares +
        accountBalances.venezuelaDolares +
        accountBalances.empresaDolares +
        accountBalances.efectivoBsDolares;

    return (
        <div className="page-container">
            <div className="page-header">
                <h1 className="page-title">Flujo de Caja</h1>
                <p className="page-subtitle">
                    Saldos esperados según ingresos del día anterior
                </p>
            </div>

            {error && <p className="text-red-600 font-medium">{error}</p>}
            {loading && <p className="text-gray-500">Cargando ingresos...</p>}

            <div className="page-content">
                {/* Date selector */}
                <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                    <div className="flex gap-4 items-end">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Fecha</label>
                            <input
                                type="date"
                                className="border border-gray-300 rounded px-3 py-2"
                                value={startDate}
                                onChange={(e) => {
                                    const selectedDate = e.target.value;
                                    setStartDate(selectedDate);
                                    setFinishDate(selectedDate);
                                }}
                            />
                        </div>
                        <button
                            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                            onClick={() => {
                                const today = new Date();
                                const yesterdayDate = new Date(today);
                                yesterdayDate.setDate(today.getDate() - 1);
                                const dateStr = yesterdayDate.toISOString().split('T')[0];
                                if (dateStr) {
                                    setStartDate(dateStr);
                                    setFinishDate(dateStr);
                                }
                            }}
                        >
                            Ver Ayer
                        </button>
                    </div>
                </div>

                {/* Account balances */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                    {/* Cuenta Externa */}
                    <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-blue-500">
                        <h3 className="text-lg font-semibold text-gray-800 mb-2">
                            Cuenta Externa <small className='text-xs text-gray-500'> ( <FormattedAmount amount={accountBalances.cuentaExternaDolares} currency="USD" />)</small>
                        </h3>
                        {/* <p className="text-sm text-gray-600 mb-3">
                            (Punto Externo)
                        </p> */}
                        <p className="text-2xl font-bold text-blue-600">
                            <FormattedAmount amount={accountBalances.cuentaExterna} currency="Bs" />
                        </p>
                    </div>

                    {/* Venezuela */}
                    <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-yellow-500">
                        <h3 className="text-lg font-semibold text-gray-800 mb-2">
                            Venezuela <small className='text-xs text-gray-500'> ( <FormattedAmount amount={accountBalances.venezuelaDolares} currency="USD" />)</small>
                        </h3>
                        {/* <p className="text-sm text-gray-600 mb-3">
                            (Biopago + Pago Móvil)
                        </p> */}
                        <p className="text-2xl font-bold text-yellow-600">
                            <FormattedAmount amount={accountBalances.venezuela} currency="Bs" />
                        </p>
                    </div>

                    {/* Empresa */}
                    <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-green-500">
                        <h3 className="text-lg font-semibold text-gray-800 mb-2">
                            Empresa <small className='text-xs text-gray-500'> ( <FormattedAmount amount={accountBalances.empresaDolares} currency="USD" />)</small>
                        </h3>
                        {/* <p className="text-sm text-gray-600 mb-3">
                            (Sitef)
                        </p> */}
                        <p className="text-2xl font-bold text-green-600">
                            <FormattedAmount amount={accountBalances.empresa} currency="Bs" />
                        </p>
                    </div>

                    {/* Efectivo USD */}
                    <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-purple-500">
                        <h3 className="text-lg font-semibold text-gray-800 mb-2">
                            Efectivo Bolívares <small className='text-xs text-gray-500'> ( <FormattedAmount amount={accountBalances.efectivoBsDolares} currency="USD" />)</small>
                        </h3>
                        {/* <p className="text-sm text-gray-600 mb-3">
                            (Efectivo en Dólares)
                        </p> */}
                        <p className="text-2xl font-bold text-purple-600">
                            <FormattedAmount amount={accountBalances.efectivoBs} currency="Bs" />
                        </p>
                    </div>

                    {/* Efectivo USD */}
                    {/* <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-purple-500">
                        <h3 className="text-lg font-semibold text-gray-800 mb-2">
                            Efectivo USD
                        </h3>
                         <p className="text-sm text-gray-600 mb-3">
                            (Efectivo en Dólares)
                        </p> 
                        <p className="text-2xl font-bold text-purple-600">
                            <FormattedAmount amount={accountBalances.efectivoDolares} currency="USD" />
                        </p>
                    </div> */}
                </div>

                {/* Total summary */}
                <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-6 rounded-xl shadow-lg text-white">
                    <div className="flex justify-between items-center">
                        <div>
                            <h2 className="text-2xl font-bold mb-1">Total Esperado</h2>
                            <p className="text-indigo-100">
                                Total de saldos esperados para {startDate}
                            </p>
                        </div>
                        <p className="text-4xl font-bold">
                            <FormattedAmount amount={totalExpected} currency="Bs" />
                            <small className='text-xs text-white'> ( <FormattedAmount amount={totalExpectedDolares} currency="USD" />)</small>
                        </p>

                    </div>
                </div>

                {/* Breakdown table */}
                <div className="mt-6 bg-white rounded-xl shadow-md overflow-hidden">
                    <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
                        <h3 className="text-lg font-semibold text-gray-800">
                            Desglose Detallado
                        </h3>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Cuenta
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Componentes
                                    </th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Monto (Bs)
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                <tr>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                        Cuenta Externa
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        Punto Externo
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-semibold text-blue-600">
                                        <FormattedAmount amount={accountBalances.cuentaExterna} currency="USD" />
                                    </td>
                                </tr>
                                <tr>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                        Venezuela
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        Biopago + Pago Móvil
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-semibold text-yellow-600">
                                        <FormattedAmount amount={accountBalances.venezuela} currency="USD" />
                                    </td>
                                </tr>
                                <tr>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                        Empresa
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        Sitef
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-semibold text-green-600">
                                        <FormattedAmount amount={accountBalances.empresa} currency="USD" />
                                    </td>
                                </tr>
                                <tr>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                        Efectivo Bolívares
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        Efectivo en Bolívares
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-semibold text-purple-600">
                                        <FormattedAmount amount={accountBalances.efectivoBs} currency="Bs" />
                                    </td>
                                </tr>
                                {/* <tr>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                        Efectivo USD
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        Efectivo en Dólares
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-semibold text-purple-600">
                                        <FormattedAmount amount={accountBalances.efectivoDolares} currency="USD" />
                                    </td>
                                </tr> */}

                                <tr className="bg-gray-50 font-bold">
                                    <td colSpan={2} className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                        Total
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-semibold text-gray-900">
                                        <FormattedAmount amount={totalExpected} currency="USD" />
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};