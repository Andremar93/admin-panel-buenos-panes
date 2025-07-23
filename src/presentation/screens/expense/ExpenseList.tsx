import { useEffect, useState } from 'react';
import { Expense } from '@/domain/model/Expense';
import { FetchExpensesUseCase } from '@/application/use_case/FetchExpensesUseCase';

const fetchExpensesUseCase = new FetchExpensesUseCase();

export const ExpenseList = () => {
    const [expenses, setExpenses] = useState<Expense[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
  
    useEffect(() => {
      const loadExpenses = async () => {
        setLoading(true);
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
  
      loadExpenses();
    }, []);
  
    if (loading) return <p className="text-gray-500">Cargando gastos...</p>;
    if (error) return <p className="text-red-600 font-medium">Error: {error}</p>;
    if (expenses.length === 0) return <p className="text-gray-400">No hay gastos registrados.</p>;
  
    return (
      <ul className="space-y-4">
        {expenses.map((expense, index) => (
          <li key={index} className="bg-white p-4 rounded-lg shadow flex flex-col">
            <div className="font-semibold text-primary">{expense.description}</div>
            <div className="text-sm text-gray-600">
              {expense.amountDollars} $ / {expense.amountBs} Bs
            </div>
            <div className="text-xs text-gray-400">
              Fecha: {new Date(expense.date).toLocaleDateString()}
            </div>
          </li>
        ))}
      </ul>
    );
  };
  
