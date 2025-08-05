import { Expense, toUpdateExpenseData } from '@/domain/model/Expense';
import { useState } from 'react';
import { FormattedAmount } from '../components/FormattedAmount';
interface Props {
  expenses: Expense[];
  loading: boolean;
  error: string | null;
  onEdit: (expense: Expense) => void;
  startDate: string;
  finishDate: string;
  setStartDate: (value: string) => void;
  setFinishDate: (value: string) => void;
  onFilter: () => void;
}

export const ExpenseList: React.FC<Props> = ({ expenses, loading, error, onEdit, startDate, finishDate, setStartDate, setFinishDate, onFilter }) => {

  const [filterText, setFilterText] = useState('');

  const filteredExpenses = expenses.filter((expense) =>
    `${expense.description} ${expense.type} ${expense.subType}`
      .toLowerCase()
      .includes(filterText.toLowerCase())
  );

  const totals = filteredExpenses.reduce(
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


  if (loading) return <p className="text-gray-500">Cargando gastos...</p>;
  if (error) return <p className="text-red-600 font-medium">Error: {error}</p>;
  if (expenses.length === 0) return <p className="text-gray-400">No hay gastos registrados.</p>;

  return (

    <div style={{ flex: 1, paddingLeft: 20 }}>

      <div className="mb-6 p-4 bg-yellow-50 border border-yellow-300 rounded-xl shadow-sm">
        <h3 className="text-base font-semibold text-yellow-800 mb-3">💰 Totales Gastos: <FormattedAmount amount={totals.amountDollars} currency="USD" /></h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-yellow-900">
          {/* Efectivo */}
          <div>
            <p className="font-medium">💵 Efectivo USD:
              <FormattedAmount amount={totals.efectivoDolares} currency="USD" />
            </p>
          </div>

          <div>
            <p className="font-medium">💴 Efectivo Bs:
              <FormattedAmount amount={totals.efectivoBs} currency="USD" />
            </p>
          </div>

          {/* Detalles de gastos */}
          <div>
            <p className="font-medium">🧾 Gastos Fijos:
              <FormattedAmount amount={totals.gastosFijos} currency="USD" />
            </p>
          </div>

          <div>
            <p className="font-medium">🛒 Compras Diarias:
              <FormattedAmount amount={totals.comprasDiarias} currency="USD" />
            </p>
          </div>

          <div>
            <p className="font-medium">👤 Gastos Personales:
              <FormattedAmount amount={totals.gastosPersonales} currency="USD" />
            </p>
          </div>

          <div>
            <p className="font-medium">🏭 Proveedores:
              <FormattedAmount amount={totals.proveedor} currency="USD" />
            </p>
          </div>

          <div>
            <p className="font-medium">⚠️ Gastos Extraordinarios:
              <FormattedAmount amount={totals.gastosExtraordinarios} currency="USD" />
            </p>
          </div>
        </div>

      </div>

      <input
        type="text"
        placeholder="Buscar gasto:"
        value={filterText}
        onChange={(e) => setFilterText(e.target.value)}
        className="input mb-4"
      />

      <div className="mb-4 flex items-end gap-4">
        <div>
          <label className="block text-sm text-gray-600 mb-1">Desde</label>
          <input
            type="date"
            className="input"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm text-gray-600 mb-1">Hasta</label>
          <input
            type="date"
            className="input"
            value={finishDate}
            onChange={(e) => setFinishDate(e.target.value)}
          />
        </div>

        <button
          className="btn"
          onClick={onFilter}
          disabled={!startDate || !finishDate}
        >
          Filtrar
        </button>
      </div>

      <h2 className="text-xl font-bold text-gray-800 mb-4">Gastos:</h2>
      <ul className="space-y-4">
        {filteredExpenses.map((expense) => (
          <li key={expense._id} className="bg-white p-4 rounded-lg shadow flex flex-col space-y-2 text-sm">
            {/* Descripción + Fecha */}
            <div className="flex justify-between items-start">
              <div className="text-base font-semibold text-primary">{expense.description}</div>
              <div className="text-xs text-gray-500">{new Date(expense.date).toLocaleDateString()}</div>
            </div>

            {/* Etiquetas: tipo y método de pago */}
            <div className="flex flex-wrap gap-2">
              <span className="px-2 py-0.5 bg-yellow-100 text-yellow-800 text-xs rounded-full border border-yellow-300">
                {expense.type}
              </span>
              <span className="px-2 py-0.5 bg-blue-100 text-blue-800 text-xs rounded-full border border-blue-300">
                {expense.paymentMethod}
              </span>
            </div>

            {/* Montos */}
            <div className="flex justify-between text-gray-700">
              <span className="font-medium">Monto USD:</span>
              <span>
                <FormattedAmount amount={expense.amountDollars} currency="USD" />
              </span>
            </div>
            <div className="flex justify-between text-gray-700">
              <span className="font-medium">Monto Bs:</span>
              <FormattedAmount amount={expense.amountBs} currency="Bs" />
            </div>

            {/* Botón editar */}
            <button
              onClick={() => {
                // Scroll al tope de la página
                window.scrollTo({ top: 0, behavior: 'smooth' });

                // Lógica de edición
                onEdit(toUpdateExpenseData(expense));
              }}
              className="mt-2 text-blue-500 underline self-start"
            >
              Editar
            </button>
          </li>
        ))}
      </ul>
    </div>



  );
};
