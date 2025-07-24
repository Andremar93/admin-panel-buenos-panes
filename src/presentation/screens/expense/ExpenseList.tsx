import { Expense } from '@/domain/model/Expense';
import { useEffect, useState } from 'react';
import { fetchExpensesUseCase } from '@/application/di/expenseInstances';

interface Props {
  expenses: Expense[];
  setExpenses: React.Dispatch<React.SetStateAction<Expense[]>>;
  onEdit: (expense: Expense) => void;
}

export const ExpenseList: React.FC<Props> = ({ expenses, setExpenses, onEdit }) => {

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [filterText, setFilterText] = useState('');


  const filteredExpenses = expenses.filter((expense) =>
    `${expense.description} ${expense.type} ${expense.subType}`
      .toLowerCase()
      .includes(filterText.toLowerCase())
  );


  useEffect(() => {
    const load = async () => {
      try {
        const data = await fetchExpensesUseCase.execute();
        setExpenses(data);
        setError(null);
      } catch (err: any) {
        setError(err.message || 'Error al cargar gastos');
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [setExpenses]);

  if (loading) return <p className="text-gray-500">Cargando gastos...</p>;
  if (error) return <p className="text-red-600 font-medium">Error: {error}</p>;
  if (expenses.length === 0) return <p className="text-gray-400">No hay gastos registrados.</p>;

  return (

    <div style={{ flex: 1, paddingLeft: 20 }}>
      <input
        type="text"
        placeholder="Buscar gasto:"
        value={filterText}
        onChange={(e) => setFilterText(e.target.value)}
        className="input mb-4"
      />

      <h2 className="text-xl font-bold text-gray-800 mb-4">Gastos:</h2>
      <ul className="space-y-4">
        {filteredExpenses.map((expense) => (
          <li key={expense._id} className="bg-white p-4 rounded-lg shadow flex flex-col">
            <div className="font-semibold text-primary">{expense.description}</div>
            <div className="text-sm text-gray-600">
              {expense.amountDollars} $ / {expense.amountBs} Bs
            </div>
            <div className="text-xs text-gray-400">
              Fecha: {new Date(expense.date).toLocaleDateString()}
            </div>
            <button
              onClick={() => onEdit(expense)}
              className="mt-2 text-sm text-blue-500 underline"
            >
              Editar
            </button>
          </li>
        ))}
      </ul>
    </div>



  );
};
