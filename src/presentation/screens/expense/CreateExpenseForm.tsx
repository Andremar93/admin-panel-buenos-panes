import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CreateExpenseDTO, CreateExpenseDTOType } from '@/presentation/dtos/expense/CreateExpenseDto';
import { Button, Input, Alert } from '@/presentation/components/ui';

interface Props {
  onCreated: (data: CreateExpenseDTOType) => void;
}

export const CreateExpenseForm: React.FC<Props> = ({ onCreated }) => {
  const [successMessage, setSuccessMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, handleSubmit, setValue, watch, formState: { errors }, reset } = useForm<CreateExpenseDTOType>({
    resolver: zodResolver(CreateExpenseDTO),
  });

  useEffect(() => {
    setValue('paid', true);
  }, [setValue]);

  const onSubmit = async (data: CreateExpenseDTOType) => {
    setIsSubmitting(true);

    try {
      await onCreated(data);
      setSuccessMessage('Gasto creado exitosamente');
      setTimeout(() => {
        setSuccessMessage('');
        reset({ paid: true });
      }, 3000);
    } catch (error) {
      console.error(error);
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

      <form onSubmit={handleSubmit(onSubmit)} className="form-container form-container-no-shadow">
        {/* <p className="form-subtitle">
          Completa la información del gasto. Todos los campos marcados con * son obligatorios.
        </p> */}

        {/* Información Básica */}
        <div className="space-y-4">
          <h4 className="text-sm font-semibold text-gray-800 border-b border-gray-100 pb-2">
            Información Básica
          </h4>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="form-group">
              <label className="form-label">Fecha del gasto</label>
              <input
                className="form-input"
                type="date"
                {...register('date')}
              />
              {errors.date && <p className="form-error">{errors.date.message}</p>}
            </div>

            <div className="form-group">
              <label className="form-label">Monto</label>
              <input
                type="number"
                step="0.01"
                className="form-input"
                placeholder="0.00"
                {...register('amount', {
                  setValueAs: (v) => {
                    if (typeof v === 'string') {
                      const replaced = v.replace(',', '.');
                      return parseFloat(replaced);
                    }
                    return v;
                  },
                })}
              />
              {errors.amount && <p className="form-error">{errors.amount.message}</p>}
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Descripción</label>
            <input
              className="form-input"
              {...register('description')}
              placeholder="Descripción detallada del gasto"
            />
            {errors.description && <p className="form-error">{errors.description.message}</p>}
          </div>
        </div>

        {/* Configuración del Gasto */}
        <div className="space-y-4 mt-4">
          <h4 className="text-sm font-semibold text-gray-800 border-b border-gray-100 pb-2">
            Configuración del Gasto
          </h4>


          <div className="form-group">
            <label className="form-label">Tipo de gasto</label>
            <select className="form-select" {...register('type')}>
              <option value="">Selecciona un tipo de gasto</option>
              <option value="gastosFijos">Gastos Fijos</option>
              <option value="comprasDiarias">Compras Diarias</option>
              <option value="gastosPersonales">Gastos Personales</option>
              <option value="gastosExtraordinarios">Gastos Extraordinarios</option>
              <option value="Nómina">Nómina</option>
              <option value="Servicios">Servicios</option>
              <option value="Mantenimiento">Mantenimiento</option>
            </select>
            {errors.type && <p className="form-error">{errors.type.message}</p>}
          </div>

          <div className="gap-4">
            <div className="form-group">
              <label className="form-label">Tipo de moneda</label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setValue('currency', '$')}
                  className={`flex-1 rounded-xl px-4 py-2.5 text-sm font-medium transition-colors ${watch('currency') === '$'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                    }`}
                >
                  Dólares ($)
                </button>
                <button
                  type="button"
                  onClick={() => setValue('currency', 'Bs')}
                  className={`flex-1 rounded-xl px-4 py-2.5 text-sm font-medium transition-colors ${watch('currency') === 'Bs'
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
            <label className="form-label">Método de pago</label>
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

          {/* <div className="form-group">
            <label className="form-label">Subtipo (opcional)</label>
            <input 
              className="form-input" 
              type="text" 
              {...register('subType')} 
              placeholder="Subtipo específico del gasto" 
            />
          </div> */}
        </div>

        {/* Estado del Pago */}
        {/* <div className="space-y-4">
          <h4 className="text-sm font-semibold text-gray-800 border-b border-gray-100 pb-2">
            Estado del Pago
          </h4>
          
          <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="paid"
                className="form-checkbox"
                {...register('paid')}
                defaultChecked={true}
              />
              <label htmlFor="paid" className="text-sm font-medium text-gray-700">
                Gasto ya pagado
              </label>
              <span className="text-xs text-gray-500">
                (Selecciona si el gasto ya fue pagado, desmarca si está pendiente)
              </span>
            </div>
          </div>
        </div> */}

        {/* Botón de envío */}
        <div className="flex justify-end pt-6">
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center gap-2 rounded-xl bg-green-600 px-6 py-3 text-sm font-medium text-white shadow-sm transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60"
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
                Crear Gasto
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
