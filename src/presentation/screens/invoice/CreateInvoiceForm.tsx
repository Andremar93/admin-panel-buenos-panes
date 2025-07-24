import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useInvoices } from '@/hooks/useInvoice';
import { InvoiceDTO, InvoiceDTOType } from '@/presentation/dtos/InvoiceDto';
import { Invoice } from '@/domain/model/Invoice';

interface Props {
  onCreated: (invoice: Invoice) => void;
}

export const CreateInvoiceForm: React.FC<Props> = ({ onCreated }) => {
  const { createInvoice } = useInvoices();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<InvoiceDTOType>({
    resolver: zodResolver(InvoiceDTO),
  });

  const onSubmit = async (data: InvoiceDTOType) => {
    try {
      const created = await createInvoice(data);
      onCreated(created);
      reset();
    } catch (err) {
      alert('Error creando la factura');
      console.error(err);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 bg-white p-6 rounded-xl shadow-md">
      <h2 className="text-lg font-bold text-primary">Nueva Factura</h2>

      <input className="input" {...register('supplier')} placeholder="Proveedor" />
      {errors.supplier && <p className="error-message">{errors.supplier.message}</p>}

      <input className="input" {...register('description')} placeholder="Descripción" />
      {errors.description && <p className="error-message">{errors.description.message}</p>}

      <div className="flex gap-4">
        <input
          className="input"
          type="number"
          step="0.01"
          {...register('amountDollars')}
          placeholder="Monto en dólares"
        />
        <input
          className="input"
          type="number"
          step="0.01"
          {...register('amountBs')}
          placeholder="Monto en Bs"
        />
      </div>

      <select className="input" {...register('currency')}>
        <option value="$">$</option>
        <option value="Bs">Bs</option>
      </select>

      <input className="input" {...register('type')} placeholder="Tipo" />
      {errors.type && <p className="error-message">{errors.type.message}</p>}

      <input className="input" type="text" {...register('subType')} placeholder="Subtipo (opcional)" />
      <input className="input" type="text" {...register('paymentMethod')} placeholder="Método de pago (opcional)" />
      <input className="input" type="text" {...register('numeroFactura')} placeholder="Número de factura (opcional)" />

      <input className="input" type="date" {...register('date')} />
      {errors.date && <p className="error-message">{errors.date.message}</p>}

      <input className="input" type="date" {...register('dueDate')} placeholder="Fecha de vencimiento" />
      {errors.dueDate && <p className="error-message">{errors.dueDate.message}</p>}

      <label className="flex items-center gap-2">
        <input type="checkbox" {...register('paid')} className="form-checkbox" />
        <span className="text-sm">Pagado</span>
      </label>

      <button type="submit" className="btn w-full">Crear Factura</button>
    </form>
  );
};
