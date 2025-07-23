import React from 'react';
import { CreateExpenseForm } from './CreateExpenseForm';
import { ExpenseList } from './ExpenseList';

export const ExpensePage = () => {
  return (
    <div style={{ display: 'flex', gap: 20, padding: 20 }}>
      <div style={{ flex: 1, borderRight: '1px solid #ccc', paddingRight: 20 }}>
        <h2>Crear Gasto</h2>
        <CreateExpenseForm />
      </div>
      <div style={{ flex: 1, paddingLeft: 20 }}>
        <h2>Lista de Gastos</h2>
        <ExpenseList />
      </div>
    </div>
  );
};
