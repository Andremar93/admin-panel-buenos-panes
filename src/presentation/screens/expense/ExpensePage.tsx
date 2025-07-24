import React, { useState } from 'react';
import { CreateExpenseForm } from './CreateExpenseForm';
import { EditExpenseForm } from './EditExpenseForm';
import { ExpenseList } from './ExpenseList';
import { Expense } from '@/domain/model/Expense';

export const ExpensePage = () => {
  const [selectedExpense, setSelectedExpense] = useState<Expense | null>(null);
  const [expenses, setExpenses] = useState<Expense[]>([]);

  // Cuando se actualiza un gasto editado, lo reemplaza en la lista
  const handleSave = (updated: Expense) => {
    setExpenses((prev) =>
      prev.map((exp) => (exp._id === updated._id ? updated : exp))
    );
    setSelectedExpense(null);
  };

  return (
    <div style={{ display: 'flex', gap: 20, padding: 20 }}>
      <div style={{ flex: 1, borderRight: '1px solid #ccc', paddingRight: 20 }}>
        {/* <h2>{selectedExpense ? 'Editar Gasto' : 'Crear Gasto'}</h2> */}
        {selectedExpense ? (
          <EditExpenseForm
            initialData={selectedExpense}
            onClose={() => setSelectedExpense(null)}
            onSave={handleSave}
          />
        ) : (
          <CreateExpenseForm
            onCreated={(newExpense) => setExpenses((prev) => [newExpense, ...prev])}
          />
        )}
      </div>

      <ExpenseList
        expenses={expenses}
        setExpenses={setExpenses}
        onEdit={setSelectedExpense}
      />

    </div>
  );
};
