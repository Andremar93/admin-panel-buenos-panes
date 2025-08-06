import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CreateInvoiceDTO, CreateInvoiceDTOType } from '@/presentation/dtos/invoice/CreateInvoiceDto';

interface Props {
  onCreated: (data: CreateInvoiceDTOType) => void;
}

export const CreateInvoiceForm: React.FC<Props> = ({ onCreated }) => {
  const [successMessage, setSuccessMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<CreateInvoiceDTOType>({
    resolver: zodResolver(CreateInvoiceDTO),
  });

  const onSubmit = async (data: CreateInvoiceDTOType) => {
    setIsSubmitting(true);
    try {
      await onCreated(data);
      setSuccessMessage('Factura creada exitosamente');

      setTimeout(() => { setSuccessMessage(''), reset() }, 3000);
    } catch (err) {
      alert(err);
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

        <h2 className="text-lg font-bold text-primary">Nueva Factura</h2>

        <label className="block text-sm font-medium text-gray-700 mb-1">
          Proveedor
        </label>
        <input className="input" {...register('supplier')} placeholder="Proveedor" />
        {errors.supplier && <p className="error-message">{errors.supplier.message}</p>}


        <label className="block text-sm font-medium text-gray-700 mb-1">
          Número factura
        </label>
        <input className="input" type="text" {...register('numeroFactura')} placeholder="Número de factura" />
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


        <input type="hidden" {...register('type')} value="Proveedor" />


        <label className="block text-sm font-medium text-gray-700 mb-1">
          Fecha de emisión:
        </label>
        <input className="input" type="date" {...register('date')} />
        {errors.date && <p className="error-message">{errors.date.message}</p>}

        <label className="block text-sm font-medium text-gray-700 mb-1">
          Fecha de Vencimiento:
        </label>
        <input className="input" type="date" {...register('dueDate')} placeholder="Fecha de vencimiento" />
        {errors.dueDate && <p className="error-message">{errors.dueDate.message}</p>}


        <button type="submit" className="btn w-full" disabled={isSubmitting}>
          {isSubmitting ? 'Creando...' : 'Crear Factura'}
        </button>

      </form>
    </div>


  );
};
