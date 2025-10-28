import React, { useState, useMemo } from 'react';
import { Expense } from '@/domain/model/Expense';
import { FormattedAmount } from '../components/FormattedAmount';
import { FormattedDate } from '../components/FormattedDate';

// Utility function to convert date to UTC
const toUTCDate = (date: string | Date): Date => {
  const d = new Date(date);
  return new Date(d.getTime() + (d.getTimezoneOffset() * 60000));
};

interface Props {
  expenses: Expense[];
  loading: boolean;
  error: string | null;
  onEdit: (expense: any) => void;
  startDate: string;
  finishDate: string;
  setStartDate: (date: string) => void;
  setFinishDate: (date: string) => void;
  onFilter: () => void;
}

export const ExpenseList: React.FC<Props> = ({ 
  expenses, 
  loading, 
  error, 
  onEdit, 
  startDate, 
  finishDate, 
  setStartDate, 
  setFinishDate, 
  onFilter 
}) => {

  const [filterText, setFilterText] = useState('');

  // Memoizar gastos filtrados por texto
  const filteredExpenses = useMemo(() => 
    expenses.filter((expense) => {
      // Convert expense date to UTC for consistent handling
      const expenseDate = toUTCDate(expense.date);
      
      return `${expense.description} ${expense.type} ${expense.subType || ''}`
        .toLowerCase()
        .includes(filterText.toLowerCase());
    }), [expenses, filterText]
  );

  // Memoizar cálculos de totales
  const totals = useMemo(() => filteredExpenses.reduce(
    (acc, inv) => {
      const amount = inv.amountDollars || 0;
      acc.efectivoDolares += inv.paymentMethod === 'dolaresEfectivo' ? inv.amountDollars : 0;
      acc.efectivoBs += inv.paymentMethod === 'bsEfectivo' ? inv.amountDollars : 0;
      acc.amountDollars += inv.amountDollars;
      acc.gastosFijos += inv.type === 'gastosFijos' ? inv.amountDollars : 0;
      acc.comprasDiarias += inv.type === 'comprasDiarias' ? inv.amountDollars : 0;
      acc.gastosPersonales += inv.type === 'gastosPersonales' ? inv.amountDollars : 0;
      acc.proveedor += inv.type === 'Proveedor' ? inv.amountDollars : 0;
      acc.gastosExtraordinarios += inv.type === 'gastosExtraordinarios' ? inv.amountDollars : 0;
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
  ), [filteredExpenses]);

  // Memoizar función de cambio de filtro de texto
  const handleFilterTextChange = useMemo(() => 
    (e: React.ChangeEvent<HTMLInputElement>) => setFilterText(e.target.value), 
    []
  );

  // Memoizar función de cambio de fecha inicial
  const handleStartDateChange = useMemo(() => 
    (e: React.ChangeEvent<HTMLInputElement>) => setStartDate(e.target.value), 
    [setStartDate]
  );

  // Memoizar función de cambio de fecha final
  const handleFinishDateChange = useMemo(() => 
    (e: React.ChangeEvent<HTMLInputElement>) => setFinishDate(e.target.value), 
    [setFinishDate]
  );

  if (loading) return <p className="text-gray-500">Cargando gastos...</p>;
  if (error) return <p className="text-red-600 font-medium">Error: {error}</p>;
  if (expenses.length === 0) return <p className="text-gray-400">No hay gastos registrados.</p>;

  return (
    <div className="flex-1">
      
      {/* Filtros */}
      <div className="mb-4 p-4 bg-gray-50 rounded-lg">
        <div className="flex gap-4 items-end mb-4">
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
            onClick={onFilter}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Filtrar
          </button>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Buscar por descripción, tipo o subtipo
          </label>
          <input
            type="text"
            value={filterText}
            onChange={handleFilterTextChange}
            placeholder="Buscar gastos..."
            className="border border-gray-300 rounded px-3 py-2 w-full"
          />
        </div>
      </div>

      {/* Resumen de totales */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-3 rounded-lg shadow text-center">
          <h4 className="text-sm font-medium text-gray-500">Total USD</h4>
          <p className="text-lg font-bold text-blue-600">
            <FormattedAmount amount={totals.amountDollars} />
          </p>
        </div>
        <div className="bg-white p-3 rounded-lg shadow text-center">
          <h4 className="text-sm font-medium text-gray-500">Efectivo USD</h4>
          <p className="text-lg font-bold text-green-600">
            <FormattedAmount amount={totals.efectivoDolares} />
          </p>
        </div>
        <div className="bg-white p-3 rounded-lg shadow text-center">
          <h4 className="text-sm font-medium text-gray-500">Efectivo Bs</h4>
          <p className="text-lg font-bold text-yellow-600">
            <FormattedAmount amount={totals.efectivoBs} />
          </p>
        </div>
        <div className="bg-white p-3 rounded-lg shadow text-center">
          <h4 className="text-sm font-medium text-gray-500">Gastos Fijos</h4>
          <p className="text-lg font-bold text-red-600">
            <FormattedAmount amount={totals.gastosFijos} />
          </p>
        </div>
      </div>

      {/* Lista de gastos */}
      <div className="bg-white rounded-lg shadow overflow-x-auto max-h-[600px] overflow-y-auto pr-2">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Descripción
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tipo
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Método de Pago
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Monto USD
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Monto Bs
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Fecha
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredExpenses.map((expense) => (
              <tr key={expense._id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {expense.description}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {expense.type}
                  </span>
                  {expense.subType && (
                    <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                      {expense.subType}
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {expense.paymentMethod}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  <FormattedAmount amount={expense.amountDollars} />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  <FormattedAmount amount={expense.amountBs} />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  <FormattedDate date={toUTCDate(expense.date)} />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    onClick={() => onEdit(expense)}
                    className="text-indigo-600 hover:text-indigo-900"
                  >
                    Editar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
