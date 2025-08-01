import React, { useEffect, useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { UpdateInvoiceDTOType, UpdateInvoiceDTO } from '@/presentation/dtos/invoice/UpdateInvoiceDto';
import { Invoice } from '@/domain/model/Invoice';

interface Props {
  initialData: Invoice;
  onUpdated: (id: string, data: Partial<Invoice>) => void;
  onCancel: () => void;
}

export const EditInvoiceForm: React.FC<Props> = ({ initialData, onUpdated, onCancel }) => {
  const [successMessage, setSuccessMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue,
  } = useForm<UpdateInvoiceDTOType>({
    resolver: zodResolver(UpdateInvoiceDTO),
  });

  const hasInitialData = useRef(false);

  useEffect(() => {
    if (!initialData || hasInitialData.current) return;

    hasInitialData.current = true;

    reset({
      _id: initialData._id,
      supplier: initialData.supplier,
      dueDate: new Date(initialData.dueDate).toISOString().split('T')[0],
      amount: initialData.currency === '$' ? initialData.amountDollars : initialData.amountBs,
      currency: initialData.currency,
      type: initialData.type,
      paymentMethod: initialData.paymentMethod || '',
      description: initialData.description,
      date: new Date(initialData.date).toISOString().split('T')[0],
      paid: initialData.paid,
      googleRow: initialData.googleRow,
      numeroFactura: initialData.numeroFactura || '',
    });
  }, [initialData]);


  const onSubmit = async (data: UpdateInvoiceDTOType) => {
    setIsSubmitting(true);
    try {
      await onUpdated(initialData._id, data);
      setSuccessMessage('Factura modificada exitosamente');

      setTimeout(() => {
        setSuccessMessage('');
        reset();
        onCancel();
      }, 3000);
    } catch (err) {
      alert('Error actualizando la factura');
      console.error(err);
    } finally {
      setIsSubmitting(false)
    }
  };

  return (
    <div>
      {successMessage && (
        <div className="bg-green-100 border border-green-300 text-green-700 text-sm px-4 py-2 rounded">
          {successMessage}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 bg-white p-6 rounded-xl shadow-md">
        <h2 className="text-lg font-bold text-primary">Editar Factura</h2>

        <label className="block text-sm font-medium text-gray-700 mb-1">
          Proveedor
        </label>
        <input className="input" {...register('supplier')} placeholder="Proveedor" />
        {errors.supplier && <p className="error-message">{errors.supplier.message}</p>}

        <label className="block text-sm font-medium text-gray-700 mb-1">
          Número factura
        </label>
        <input className="input" {...register('numeroFactura')} placeholder="Número de Factura (opcional)" />
        {errors.numeroFactura && <p className="error-message">{errors.numeroFactura.message}</p>}


        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setValue('currency', '$')}
            className={`btn flex-1 ${watch('currency') === '$' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
          >
            $
          </button>
          <button
            type="button"
            onClick={() => setValue('currency', 'Bs')}
            className={`btn flex-1 ${watch('currency') === 'Bs' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
          >
            Bs
          </button>
        </div>

        <input
          className="input"
          type="text"
          {...register('amount', {
            setValueAs: (v) => {
              const str = typeof v === 'string' ? v : String(v ?? '');
              const replaced = str.replace(',', '.');
              const parsed = parseFloat(replaced);
              return parsed;
            },
          })}
          placeholder="Monto"
        />
        {errors.amount && <p className="error-message">{errors.amount.message}</p>}



        <label className="block text-sm font-medium text-gray-700 mb-1">
          Fecha de emisión:
        </label>
        <input className="input" type="date" {...register('date')} placeholder="Fecha" />
        {errors.date && <p className="error-message">{errors.date.message}</p>}


        <label className="block text-sm font-medium text-gray-700 mb-1">
          Fecha de vencimiento
        </label>
        <input className="input" type="date" {...register('dueDate')} placeholder="Fecha de vencimiento" />
        {errors.dueDate && <p className="error-message">{errors.dueDate.message}</p>}

        <input type="hidden" className="input" {...register('type')} value="Proveedor" />
        <input
          type="hidden"
          {...register('_id')}
          value={watch('_id')}
        />


        <div className="flex justify-between gap-4 pt-4">
          <button type="submit" className="btn flex-1">Actualizar</button>
          <button type="button" onClick={onCancel} className="btn-secondary flex-1">Cancelar</button>
        </div>
      </form>
    </div>
  );
};
