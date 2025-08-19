import { useEffect, useState } from 'react';
import { CreateExpenseForm } from './CreateExpenseForm';
import { EditExpenseForm } from './EditExpenseForm';
import { ExpenseList } from './ExpenseList';
import { CreateExpenseDTOType } from '@/presentation/dtos/expense/CreateExpenseDto';
import { UpdateExpenseDTOType } from '@/presentation/dtos/expense/UpdateExpenseDto';
import { useExpense } from '@/hooks/useExpense';
import { Expense } from '@/domain/model/Expense';

export const ExpensePage = () => {

  const { expenses, loading, error, createExpense, updateExpense, applyFilters, filterRange } = useExpense();
  const [selectedExpense, setSelectedExpense] = useState<Expense | null>(null);
  const [startDate, setStartDate] = useState('');
  const [finishDate, setFinishDate] = useState('');

  useEffect(() => {
    if (filterRange.from && filterRange.to && filterRange.from !== '' && filterRange.to !== '') {
      const fromDate = filterRange.from.split('T')[0];
      const toDate = filterRange.to.split('T')[0];
      if (fromDate && toDate) {
        setStartDate(fromDate);
        setFinishDate(toDate);
      }
    }
  }, [filterRange]);

  const handleCreated = async (data: CreateExpenseDTOType) => {
    await createExpense(data);
  };

  const handleUpdated = async (data: UpdateExpenseDTOType) => {
    await updateExpense(data);
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">Gestión de Gastos</h1>
        <p className="page-subtitle">
          Crea nuevos gastos y administra los existentes
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[450px_minmax(0,1fr)]">
        {/* Columna Izquierda - Formulario */}
        <div className="space-y-6">
          <div className="card">
            <div className="card-header">
              <h2 className="text-lg font-semibold text-gray-900">
                {selectedExpense ? 'Editar Gasto' : 'Crear Nuevo Gasto'}
              </h2>
            </div>
            <div className="card-body">
              {selectedExpense ? (
                <EditExpenseForm
                  initialData={selectedExpense}
                  onCancel={() => setSelectedExpense(null)}
                  onUpdated={handleUpdated}
                />
              ) : (
                <CreateExpenseForm
                  onCreated={handleCreated}
                />
              )}
            </div>
          </div>
        </div>

        {/* Columna Derecha - Lista de Gastos */}
        <div className="space-y-6">
          <div className="card">
            <div className="card-header">
              <h2 className="text-lg font-semibold text-gray-900">Lista de Gastos</h2>
            </div>
            <div className="card-body">
              <ExpenseList
                expenses={expenses}
                loading={loading}
                error={error}
                onEdit={setSelectedExpense}
                startDate={startDate}
                finishDate={finishDate}
                setStartDate={setStartDate}
                setFinishDate={setFinishDate}
                onFilter={() => applyFilters(startDate, finishDate)}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
