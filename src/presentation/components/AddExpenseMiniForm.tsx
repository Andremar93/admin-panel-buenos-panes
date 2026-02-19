import React, { useEffect, useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CreateExpenseDTO, CreateExpenseDTOType } from '@/presentation/dtos/expense/CreateExpenseDto';
import { Alert } from '@/presentation/components/ui';
import { Employee } from '@/domain/model/Employee';

export interface AddExpenseMiniFormProps {
  /** Default date (e.g. income date) in YYYY-MM-DD */
  defaultDate?: string | undefined;
  /** Add expense (sync or async). When used from create income, this only adds to local state; expenses are sent with the income. */
  onSubmit: (data: CreateExpenseDTOType) => void | Promise<void>;
  onSuccess?: () => void;
  /** Employees list for "Nómina" type expenses */
  employees?: Employee[];
}

const parseAmount = (v: unknown): number => {
  if (typeof v === 'string') {
    const replaced = String(v).replace(',', '.');
    return parseFloat(replaced) || 0;
  }
  return Number(v) ?? 0;
};

export const AddExpenseMiniForm: React.FC<AddExpenseMiniFormProps> = ({
  defaultDate,
  onSubmit,
  onSuccess,
  employees = [],
}) => {
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const todayStr = new Date().toISOString().split('T')[0] as string;

  const { register, handleSubmit, setValue, watch, formState: { errors }, reset } = useForm<CreateExpenseDTOType>({
    resolver: zodResolver(CreateExpenseDTO),
    defaultValues: {
      date: (defaultDate && defaultDate.length > 0 ? defaultDate : todayStr) as string,
      currency: '$',
      paymentMethod: 'dolaresEfectivo', // Efectivo $ cuando es dólares
      paid: true,
    },
  });

  useEffect(() => {
    if (defaultDate) setValue('date', defaultDate);
  }, [defaultDate, setValue]);

  useEffect(() => {
    setValue('paid', true);
  }, [setValue]);

  // Método de pago según moneda: Bs → efectivo Bs, $ → efectivo $
  const currency = watch('currency');
  const expenseType = watch('type');
  useEffect(() => {
    setValue('paymentMethod', currency === 'Bs' ? 'bsEfectivo' : 'dolaresEfectivo');
  }, [currency, setValue]);

  // Limpiar employeeName cuando cambia el tipo y no es Nómina
  useEffect(() => {
    if (expenseType !== 'Nómina') {
      setValue('employeeName', '');
      setValue('employeeId', '');
    }
  }, [expenseType, setValue]);

  const handleAddExpense = async (data: CreateExpenseDTOType) => {
    setIsSubmitting(true);
    setErrorMessage('');
    setSuccessMessage('');
    try {
      await Promise.resolve(onSubmit(data));
      setSuccessMessage('Gasto agregado al total');
      onSuccess?.();
      const cur = watch('currency');
      reset({
        amount: 0,
        description: '',
        type: '',
        paymentMethod: cur === 'Bs' ? 'bsEfectivo' : 'dolaresEfectivo',
        date: (defaultDate && defaultDate.length > 0 ? defaultDate : todayStr) as string,
        currency: cur,
        paid: true,
        employeeName: '',
        employeeId: '',
      });
      setTimeout(() => setSuccessMessage(''), 2500);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error al agregar el gasto';
      setErrorMessage(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="rounded-lg border border-gray-200 bg-gray-50/80 p-4">
      <h5 className="text-sm font-medium text-gray-700 mb-3">Agregar gasto (se enviará con el ingreso)</h5>
      {successMessage && <Alert variant="success" className="mb-3">{successMessage}</Alert>}
      {errorMessage && <Alert variant="error" className="mb-3">{errorMessage}</Alert>}

      <div className="space-y-3">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div className="form-group sm:col-span-2">
            <label className="form-label text-xs">Descripción</label>
            <input
              className="form-input text-sm"
              {...register('description')}
              placeholder="Ej: Compra harina"
            />
            {errors.description && <p className="form-error text-xs">{errors.description.message}</p>}
          </div>

          <div className="form-group">
            <label className="form-label text-xs">Fecha</label>
            <input className="form-input text-sm" type="date" {...register('date')} />
            {errors.date && <p className="form-error text-xs">{errors.date.message}</p>}
          </div>

          <div className="form-group">
            <label className="form-label text-xs">Monto</label>
            <input
              type="number"
              step="0.01"
              className="form-input text-sm"
              placeholder="0.00"
              {...register('amount', { setValueAs: parseAmount })}
            />
            {errors.amount && <p className="form-error text-xs">{errors.amount.message}</p>}
          </div>

          <div className="form-group">
            <label className="form-label text-xs">Moneda</label>
            <div className="flex gap-1">
              <button
                type="button"
                onClick={() => { setValue('currency', '$'); setValue('paymentMethod', 'dolaresEfectivo'); }}
                className={`flex-1 rounded-lg px-3 py-2 text-xs font-medium ${watch('currency') === '$' ? 'bg-blue-600 text-white' : 'border border-gray-300 bg-white text-gray-700'}`}
              >
                $ (efectivo $)
              </button>
              <button
                type="button"
                onClick={() => { setValue('currency', 'Bs'); setValue('paymentMethod', 'bsEfectivo'); }}
                className={`flex-1 rounded-lg px-3 py-2 text-xs font-medium ${watch('currency') === 'Bs' ? 'bg-blue-600 text-white' : 'border border-gray-300 bg-white text-gray-700'}`}
              >
                Bs (efectivo Bs)
              </button>
            </div>
          </div>

          <div className="form-group sm:col-span-2">
            <label className="form-label text-xs">Tipo de gasto</label>
            <select className="form-select text-sm" {...register('type')}>
              <option value="">Selecciona tipo</option>
              <option value="gastosFijos">Gastos Fijos</option>
              <option value="comprasDiarias">Compras Diarias</option>
              <option value="gastosPersonales">Gastos Personales</option>
              <option value="gastosExtraordinarios">Gastos Extraordinarios</option>
              <option value="Nómina">Nómina</option>
              <option value="Servicios">Servicios</option>
              <option value="Mantenimiento">Mantenimiento</option>
              <option value="Proveedor">Proveedor</option>
              <option value="Harina">Harina</option>
            </select>
            {errors.type && <p className="form-error text-xs">{errors.type.message}</p>}
          </div>

          {expenseType === 'Nómina' && (
            <div className="form-group sm:col-span-2">
              <label className="form-label text-xs">Empleado <span className="text-red-500">*</span></label>
              {employees.length > 0 ? (
                <select 
                  className="form-select text-sm" 
                  {...register('employeeId', { 
                    required: expenseType === 'Nómina' ? 'El empleado es requerido para gastos de Nómina' : false 
                  })}
                >
                  <option value="">Selecciona un empleado</option>
                  {employees.map((emp) => (
                    <option key={emp._id} value={emp._id}>
                      {emp.name}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  className="form-input text-sm"
                  {...register('employeeName', { 
                    required: expenseType === 'Nómina' ? 'El nombre del empleado es requerido' : false 
                  })}
                  placeholder="Nombre del empleado"
                />
              )}
              {(errors.employeeId || errors.employeeName) && (
                <p className="form-error text-xs">
                  {errors.employeeId?.message || errors.employeeName?.message || 'El empleado es requerido para gastos de Nómina'}
                </p>
              )}
            </div>
          )}

          <div className="form-group sm:col-span-2">
            <label className="form-label text-xs">Subtipo (opcional)</label>
            <input
              className="form-input text-sm"
              {...register('subType')}
              placeholder="Ej: Harina"
            />
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="button"
            disabled={isSubmitting}
            onClick={() => handleSubmit(handleAddExpense as SubmitHandler<CreateExpenseDTOType>)()}
            className="inline-flex items-center gap-1.5 rounded-lg bg-green-600 px-4 py-2 text-xs font-medium text-white hover:bg-green-700 disabled:opacity-60"
          >
            {isSubmitting ? (
              <>
                <div className="h-3 w-3 animate-spin rounded-full border-2 border-white border-t-transparent" />
                Creando...
              </>
            ) : (
              <>+ Agregar gasto</>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
