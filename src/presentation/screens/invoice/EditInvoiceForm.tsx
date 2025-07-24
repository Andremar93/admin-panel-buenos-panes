import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { InvoiceDTO, InvoiceDTOType } from '@/presentation/dtos/InvoiceDto';
import { useInvoices } from '@/hooks/useInvoice';
import { Invoice } from '@/domain/model/Invoice';

interface Props {
  initialData: Invoice;
  onUpdated: (id: string, data: Partial<Invoice>) => void;
  onCancel: () => void;
}

export const EditInvoiceForm: React.FC<Props> = ({ initialData, onUpdated, onCancel }) => {
  const { updateInvoice } = useInvoices();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<InvoiceDTOType>({
    resolver: zodResolver(InvoiceDTO),
  });

  useEffect(() => {
    if (initialData && typeof initialData.supplier === 'string' && initialData.supplier.trim() !== '') {
      reset({
        supplier: initialData.supplier,
        dueDate: new Date(initialData.dueDate).toISOString().split('T')[0],
        amountDollars: initialData.amountDollars,
        amountBs: initialData.amountBs,
        currency: initialData.currency,
        type: initialData.type,
        subType: initialData.subType || '',
        paymentMethod: initialData.paymentMethod || '',
        description: initialData.description,
        date: new Date(initialData.date).toISOString().split('T')[0],
        paid: initialData.paid,
        googleRow: initialData.googleRow,
        numeroFactura: initialData.numeroFactura || '',
      });
    }
  }, [initialData, reset]);


  const onSubmit = async (data: InvoiceDTOType) => {
    try {
      const updatedInvoice = await updateInvoice(data);
      onUpdated(initialData._id, updatedInvoice);
      reset(); // limpiar el formulario después de actualizar
    } catch (err) {
      alert('Error actualizando la factura');
      console.error(err);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 bg-white p-6 rounded-xl shadow-md">
      <h2 className="text-lg font-bold text-primary">Editar Factura</h2>

      <label className="block text-sm font-medium text-gray-700 mb-1">
        Proveedor
      </label>
      <input className="input" {...register('supplier')} placeholder="Proveedor" />
      {errors.supplier && <p className="error-message">{errors.supplier.message}</p>}


      <label className="block text-sm font-medium text-gray-700 mb-1">
        Fecha de vencimiento
      </label>
      <input className="input" type="date" {...register('dueDate')} placeholder="Fecha de vencimiento" />
      {errors.dueDate && <p className="error-message">{errors.dueDate.message}</p>}

      <div className="flex gap-4">
        <input className="input" type="number" step="0.01" {...register('amountDollars')} placeholder="Monto $" />
        <input className="input" type="number" step="0.01" {...register('amountBs')} placeholder="Monto Bs" />
      </div>

      <select className="input" {...register('currency')}>
        <option value="$">$</option>
        <option value="Bs">Bs</option>
      </select>

      <input className="input" {...register('type')} placeholder="Tipo de factura" />
      {/* <input className="input" {...register('subType')} placeholder="Subtipo (opcional)" /> */}
      {/* <input className="input" {...register('paymentMethod')} placeholder="Método de pago (opcional)" /> */}
      <input className="input" {...register('description')} placeholder="Descripción" />
      <input className="input" type="date" {...register('date')} placeholder="Fecha" />

      {/* <label className="flex items-center gap-2">
        <input type="checkbox" {...register('paid')} className="form-checkbox" />
        <span className="text-sm">Pagada</span>
      </label> */}

      <input className="input" {...register('numeroFactura')} placeholder="Número de Factura (opcional)" />

      <div className="flex justify-between gap-4 pt-4">
        <button type="submit" className="btn flex-1">Actualizar</button>
        <button type="button" onClick={onCancel} className="btn-secondary flex-1">Cancelar</button>
      </div>
    </form>
  );
};
