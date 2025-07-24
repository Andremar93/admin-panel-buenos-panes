import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ExpenseDTO, ExpenseDTOType } from '@/presentation/dtos/ExpenseDto';
import { Expense } from '@/domain/model/Expense';
import { createExpenseUseCase } from '@/application/di/expenseInstances'; // ⬅️ Importás desde DI

interface Props {
  onCreated?: (expense: Expense) => void;
}

export const CreateExpenseForm: React.FC<Props> = ({ onCreated }) => {
  const { register, handleSubmit, formState: { errors }, reset } = useForm<ExpenseDTOType>({
    resolver: zodResolver(ExpenseDTO),
  });

  const onSubmit = async (data: ExpenseDTOType) => {
    try {
      const created = await createExpenseUseCase.execute(data);
      alert('Gasto creado correctamente!');
      reset();
      onCreated?.(created);
    } catch (error) {
      alert('Error creando el gasto');
      console.error(error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 bg-white p-6 rounded-xl shadow-md">
    {/* <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 bg-white p-6 rounded-xl shadow-md max-w-md w-full"> */}
      <h2 className="text-lg font-bold text-primary">Crear Gasto</h2>

      <div>
        <input className="input" {...register('description')} placeholder="Descripción" />
        {errors.description && <p className="error-message">{errors.description.message}</p>}
      </div>

      <div className="flex gap-4">
        <input className="input" type="number" step="0.01" {...register('amountDollars')} placeholder="Monto $" />
        <input className="input" type="number" step="0.01" {...register('amountBs')} placeholder="Monto Bs" />
      </div>

      <select className="input" {...register('currency')}>
        <option value="$">$</option>
        <option value="Bs">Bs</option>
      </select>

      <input className="input" type="text" {...register('type')} placeholder="Tipo de gasto" />
      {errors.type && <p className="error-message">{errors.type.message}</p>}

      <input className="input" type="date" {...register('date')} />
      {errors.date && <p className="error-message">{errors.date.message}</p>}

      <label className="flex items-center gap-2">
        <input type="checkbox" {...register('paid')} className="form-checkbox" />
        <span className="text-sm">Pagado</span>
      </label>

      <input className="input" type="text" {...register('subType')} placeholder="Subtipo (opcional)" />
      <input className="input" type="text" {...register('paymentMethod')} placeholder="Método de pago (opcional)" />
      {/* <input className="input" type="text" {...register('invoiceId')} placeholder="ID Factura (opcional)" /> */}

      <button type="submit" className="btn w-full">Crear Gasto</button>
    </form>
  );
};
