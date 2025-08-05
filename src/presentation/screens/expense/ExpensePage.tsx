import { useEffect, useState } from 'react';
import { CreateExpenseForm } from './CreateExpenseForm';
import { EditExpenseForm } from './EditExpenseForm';
import { ExpenseList } from './ExpenseList';
import { CreateExpenseDTOType } from '@/presentation/dtos/expense/CreateExpenseDto';
import { UpdateExpenseDTOType } from '@/presentation/dtos/expense/UpdateExpenseDto';
import { useExpense } from '@/hooks/useExpense'

export const ExpensePage = () => {

  const { expenses, loading, error, createExpense, updateExpense, applyFilters, filterRange } = useExpense();
  const [selectedExpense, setSelectedExpense] = useState<UpdateExpenseDTOType | null>(null);
  const [startDate, setStartDate] = useState('');
  const [finishDate, setFinishDate] = useState('');

  useEffect(() => {
    if (filterRange.from && filterRange.to) {
      setStartDate(filterRange.from.split('T')[0]);
      setFinishDate(filterRange.to.split('T')[0]);
    }
  }, [filterRange]);


  const handleCreated = async (data: CreateExpenseDTOType) => {
    await createExpense(data);
  };


  const handleUpdated = async (data: UpdateExpenseDTOType) => {
    await updateExpense(data);
  };


  return (
    <div style={{ display: 'flex', gap: 20, padding: 20 }}>
      <div style={{ flex: 1, borderRight: '1px solid #ccc', paddingRight: 20 }}>
        {/* <h2>{selectedExpense ? 'Editar Gasto' : 'Crear Gasto'}</h2> */}
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
  );
};
