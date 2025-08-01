import { useState } from 'react';
import { CreateExpenseForm } from './CreateExpenseForm';
import { EditExpenseForm } from './EditExpenseForm';
import { ExpenseList } from './ExpenseList';
import { Expense, toUpdateExpenseData } from '@/domain/model/Expense';
import { CreateExpenseDTOType } from '@/presentation/dtos/expense/CreateExpenseDto';
import { UpdateExpenseDTOType } from '@/presentation/dtos/expense/UpdateExpenseDto';
import { useExpense } from '@/hooks/useExpense'

export const ExpensePage = () => {

  const { expenses, loading, error, createExpense, updateExpense } = useExpense();

  const [selectedExpense, setSelectedExpense] = useState<UpdateExpenseDTOType | null>(null);


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
      />

    </div>
  );
};
