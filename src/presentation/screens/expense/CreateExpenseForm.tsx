import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CreateExpenseDTO, CreateExpenseDTOType } from '@/presentation/dtos/expense/CreateExpenseDto';

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

  useEffect(() => {
    console.log('errors', errors);
  }, [errors]);


  const onSubmit = async (data: CreateExpenseDTOType) => {
    setIsSubmitting(true);
    console.log(errors);

    try {
      await onCreated(data);
      setSuccessMessage('Gasto creado exitosamente');
      setTimeout(() => {
        setSuccessMessage('');
        reset({ paid: true });
      }, 3000);
    } catch (error) {
      console.error(error);
    }
    finally {
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

        <h2 className="text-lg font-bold text-primary">Crear Gasto</h2>


        <label className="block text-sm font-medium text-gray-700 mb-1">Fecha del gasto:</label>
        <input className="input" type="date" {...register('date')} />
        {errors.date && <p className="error-message">{errors.date.message}</p>}

        <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Descripción:</label>
          <input className="input" {...register('description')} placeholder="Descripción" />
          {errors.description && <p className="error-message">{errors.description.message}</p>}
        </div>

        <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de moneda:</label>
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
        {errors.currency && <p className="error-message">{errors.currency.message}</p>}



        <label className="block text-sm font-medium text-gray-700 mb-1">Monto:</label>
        <input
          type="number"
          step="0.01"
          className="input"
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
        {errors.amount && <p className="error-message">{errors.amount.message}</p>}


        <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de gasto:</label>
        <div>
          <select className="input" {...register('type')}>
            <option value="">Selecciona un tipo de gasto</option>
            <option value="gastosFijos">Gastos Fijos</option>
            <option value="comprasDiarias">Compras Diarias</option>
            <option value="gastosPersonales">Gastos Personales</option>
            <option value="gastosExtraordinarios">Gastos Extraordinarios</option>
          </select>
          {errors.type && <p className="error-message">{errors.type.message}</p>}
        </div>


        <label className="block text-sm font-medium text-gray-700 mb-1">Metódo de pago:</label>
        <div>
          <select className="input" {...register('paymentMethod')}>
            <option value="">Selecciona un método de pago</option>
            <option value="cuentaBs">Cuentas Bs.</option>
            <option value="bsEfectivo">Efectivo Bs.</option>
            <option value="dolaresEfectivo">Efectivo $</option>
          </select>
          {errors.paymentMethod && <p className="error-message">{errors.paymentMethod.message}</p>}
        </div>


        {/* <input className="input" type="text" {...register('subType')} placeholder="Subtipo (opcional)" /> */}


        <button type="submit" className="btn w-full" disabled={isSubmitting}>
          {isSubmitting ? 'Creando...' : 'Crear Gasto'}
        </button>

      </form>

    </div>
  );
};
