import React, { useEffect, useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { UpdateInvoiceDTOType, UpdateInvoiceDTO } from '@/presentation/dtos/invoice/UpdateInvoiceDto';
import { Invoice } from '@/domain/model/Invoice';
import { Button, Input, Alert } from '@/presentation/components/ui';

interface Props {
  initialData: Invoice;
  onUpdated: (id: string, data: UpdateInvoiceDTOType) => void;
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
  }, [initialData, reset]);

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
        <Alert variant="success">
          {successMessage}
        </Alert>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="form-container">
        <h2 className="form-title">Editar Factura</h2>
        <p className="form-subtitle">
          Modifica la información de la factura del proveedor. Todos los campos marcados con * son obligatorios.
        </p>

        {/* Información del Proveedor */}
        <div className="space-y-4">
          <h4 className="text-sm font-semibold text-gray-800 border-b border-gray-100 pb-2">
            Información del Proveedor
          </h4>
          
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="form-group">
              <label className="form-label">Proveedor</label>
              <input 
                className="form-input" 
                {...register('supplier')} 
                placeholder="Nombre del proveedor" 
              />
              {errors.supplier && <p className="form-error">{errors.supplier.message}</p>}
            </div>

            <div className="form-group">
              <label className="form-label">Número de Factura</label>
              <input 
                className="form-input" 
                {...register('numeroFactura')} 
                placeholder="Número de Factura (opcional)" 
              />
              {errors.numeroFactura && <p className="form-error">{errors.numeroFactura.message}</p>}
            </div>
          </div>
        </div>

        {/* Información Financiera */}
        <div className="space-y-4">
          <h4 className="text-sm font-semibold text-gray-800 border-b border-gray-100 pb-2">
            Información Financiera
          </h4>
          
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="form-group">
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

            <div className="form-group">
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

          <div className="form-group">
            <label className="form-label">Método de Pago</label>
            <select className="form-select" {...register('paymentMethod')}>
              <option value="">Selecciona un método de pago</option>
              <option value="cuentaBs">Cuenta Bs</option>
              <option value="bsEfectivo">Efectivo Bs</option>
              <option value="dolaresEfectivo">Efectivo $</option>
              <option value="transferencia">Transferencia</option>
              <option value="cheque">Cheque</option>
            </select>
            {errors.paymentMethod && <p className="form-error">{errors.paymentMethod.message}</p>}
          </div>

          <div className="form-group">
            <label className="form-label">Descripción</label>
            <textarea 
              className="form-textarea" 
              {...register('description')} 
              placeholder="Descripción detallada de la factura" 
              rows={3}
            />
            {errors.description && <p className="form-error">{errors.description.message}</p>}
          </div>
        </div>

        {/* Fechas */}
        <div className="space-y-4">
          <h4 className="text-sm font-semibold text-gray-800 border-b border-gray-100 pb-2">
            Fechas Importantes
          </h4>
          
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="form-group">
              <label className="form-label">Fecha de Emisión</label>
              <input 
                className="form-input" 
                type="date" 
                {...register('date')} 
              />
              {errors.date && <p className="form-error">{errors.date.message}</p>}
            </div>

            <div className="form-group">
              <label className="form-label">Fecha de Vencimiento</label>
              <input 
                className="form-input" 
                type="date" 
                {...register('dueDate')} 
              />
              {errors.dueDate && <p className="form-error">{errors.dueDate.message}</p>}
            </div>
          </div>
        </div>

        {/* Estado de Pago */}
        <div className="space-y-4">
          <h4 className="text-sm font-semibold text-gray-800 border-b border-gray-100 pb-2">
            Estado de Pago
          </h4>
          
          <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="paid"
                className="form-checkbox"
                {...register('paid')}
              />
              <label htmlFor="paid" className="text-sm font-medium text-gray-700">
                Factura pagada
              </label>
              <span className="text-xs text-gray-500">
                (Selecciona si la factura ya fue pagada)
              </span>
            </div>
          </div>
        </div>

        {/* Botones de acción */}
        <div className="flex justify-end gap-3 pt-6">
          <button 
            type="button" 
            onClick={onCancel}
            className="inline-flex items-center gap-2 rounded-xl border border-gray-300 bg-white px-6 py-3 text-sm font-medium text-gray-700 shadow-sm transition hover:bg-gray-50"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
            Cancelar
          </button>
          
          <button 
            type="submit" 
            disabled={isSubmitting} 
            className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-medium text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? (
              <>
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                Actualizando...
              </>
            ) : (
              <>
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Actualizar Factura
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
