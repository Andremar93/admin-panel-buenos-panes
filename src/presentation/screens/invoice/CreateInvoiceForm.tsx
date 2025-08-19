import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CreateInvoiceDTO, CreateInvoiceDTOType } from '@/presentation/dtos/invoice/CreateInvoiceDto';
import { Button, Input, Alert } from '@/presentation/components/ui';

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

      setTimeout(() => { 
        setSuccessMessage(''); 
        reset() 
      }, 3000);
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
        <Alert variant="success">
          {successMessage}
        </Alert>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="form-form-container form-container-no-shadow">
        {/* <p className="form-subtitle">
          Completa la información de la factura del proveedor. Todos los campos marcados con * son obligatorios.
        </p> */}

        {/* Información del Proveedor */}
        <div className="">
          <h4 className="text-sm font-semibold text-gray-800 border-b border-gray-100 pb-2">
            Información del Proveedor
          </h4>
          
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="form-group py-4">
              <label className="form-label">Proveedor</label>
              <input 
                className="form-input" 
                {...register('supplier')} 
                placeholder="Nombre del proveedor" 
              />
              {errors.supplier && <p className="form-error">{errors.supplier.message}</p>}
            </div>

            <div className="form-group py-4">
              <label className="form-label">Número de Factura</label>
              <input 
                className="form-input" 
                type="text" 
                {...register('numeroFactura')} 
                placeholder="Número de factura" 
              />
              {errors.numeroFactura && <p className="form-error">{errors.numeroFactura.message}</p>}
            </div>
          </div>
        </div>

        {/* Información Financiera */}
        <div className="pt-4">
          <h4 className="text-sm font-semibold text-gray-800 border-b border-gray-100 pb-2">
            Información Financiera
          </h4>
          
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="form-group py-4">
              <label className="form-label">Monto</label>
              <input
                className="form-input"
                type="number"
                step="0.01"
                placeholder="0.00"
                {...register('amount', {
                  setValueAs: (v) => {
                    const str = typeof v === 'string' ? v : String(v ?? '');
                    const replaced = str.replace(',', '.');
                    const parsed = parseFloat(replaced);
                    return parsed;
                  },
                })}
              />
              {errors.amount && <p className="form-error">{errors.amount.message}</p>}
            </div>

            <div className="form-group py-4">
              <label className="form-label">Tipo de moneda</label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setValue('currency', '$')}
                  className={`flex-1 rounded-xl px-4 py-2.5 text-sm font-medium transition-colors ${
                    watch('currency') === '$' 
                      ? 'bg-blue-600 text-white shadow-sm' 
                      : 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  Dólares ($)
                </button>
                <button
                  type="button"
                  onClick={() => setValue('currency', 'Bs')}
                  className={`flex-1 rounded-xl px-4 py-2.5 text-sm font-medium transition-colors ${
                    watch('currency') === 'Bs' 
                      ? 'bg-blue-600 text-white shadow-sm' 
                      : 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  Bolívares (Bs)
                </button>
              </div>
              {errors.currency && <p className="form-error">{errors.currency.message}</p>}
            </div>
          </div>
        </div>

        {/* Fechas */}
        <div className="">
          <h4 className="text-sm font-semibold text-gray-800 border-b border-gray-100 pb-2">
            Fechas Importantes
          </h4>
          
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="form-group py-4">
              <label className="form-label">Fecha de Emisión</label>
              <input 
                className="form-input" 
                type="date" 
                {...register('date')} 
              />
              {errors.date && <p className="form-error">{errors.date.message}</p>}
            </div>

            <div className="form-group py-4">
              <label className="form-label">Fecha de Vencimiento</label>
              <input 
                className="form-input" 
                type="date" 
                {...register('dueDate')} 
                placeholder="Fecha de vencimiento" 
              />
              {errors.dueDate && <p className="form-error">{errors.dueDate.message}</p>}
            </div>
          </div>
        </div>

        {/* Información Adicional */}
        <div className="space-y-4 mt-4">
          <h4 className="text-sm font-semibold text-gray-800 border-b border-gray-100 pb-2">
            Información Adicional
          </h4>
          
          <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
            <div className="flex items-center gap-3">
              <input
                type="hidden"
                {...register('type')}
                value="Proveedor"
              />
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">
                <svg className="h-5 w-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">Tipo de Factura</p>
                <p className="text-sm text-gray-500">Factura de Proveedor</p>
              </div>
            </div>
          </div>
        </div>

        {/* Botón de envío */}
        <div className="flex justify-end pt-6">
          <button 
            type="submit" 
            disabled={isSubmitting} 
            className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-medium text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? (
              <>
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                Creando...
              </>
            ) : (
              <>
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Crear Factura
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
