import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { UpdateExpenseDTO, UpdateExpenseDTOType } from '@/presentation/dtos/expense/UpdateExpenseDto';
import { Expense } from '@/domain/model/Expense';
interface EditExpenseFormProps {
    initialData: Expense;
    onCancel: () => void;
    onUpdated: (data: UpdateExpenseDTOType) => void;
}

export const EditExpenseForm: React.FC<EditExpenseFormProps> = ({ initialData, onCancel, onUpdated }) => {
    const [successMessage, setSuccessMessage] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { errors },
        reset
    } = useForm<UpdateExpenseDTOType>({
        resolver: zodResolver(UpdateExpenseDTO),
        defaultValues: {
            ...initialData,
            amount: (initialData.currency == "$")? Number(initialData.amountDollars) : Number(initialData.amountBs),
            date: new Date(initialData.date).toISOString().split('T')[0]
        }
    });

    const onSubmit = async (data: UpdateExpenseDTOType) => {
        setIsSubmitting(true);
        try {
            await onUpdated(data)
            setSuccessMessage('Gasto actualizado exitosamente')
            setTimeout(() => {
                setSuccessMessage('');
                reset();
                onCancel();
            }, 3000);
        } catch (error) {
            alert('Error al actualizar el gasto');
            console.error(error);
        }
        finally {
            setIsSubmitting(false)
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="form-container form-container-no-shadow">


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

                    <div className='form-group'>
                        <label className="form-label">Monto</label>

                        <input
                            className="form-input"
                            type="number"
                            step="0.01"
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
                        {errors.amount && <p className="error-message">{errors.amount.message}</p>}
                    </div>
                </div>


                <div className="form-group">
                    <label className="form-label">Descripción</label>
                    <input className="form-input" {...register('description')} placeholder="Descripción detallada del gasto" />
                    {errors.description && <p className="error-message">{errors.description.message}</p>}
                </div>

            </div>
            <div className="space-y-4 mt-4">
                <h4 className="text-sm font-semibold text-gray-800 border-b border-gray-100 pb-2">
                    Configuración del Gasto
                </h4>

                <div className="space-y-4 mt-4">

                    <div className='form-group'>
                        <label className="form-label">Tipo de gasto:</label>
                        <select className="form-select" {...register('type')}>
                            <option value="">Selecciona un tipo de gasto</option>
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
                        {errors.type && <p className="error-message">{errors.type.message}</p>}
                    </div>


                    <div className="gap-4">
                        <div className='form-group'>
                            <label className="form-label">Tipo de moneda:</label>
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
                        </div>
                    </div>
                    <div className='form-group'>
                        {/* <input className="input" type="text" {...register('subType')} placeholder="Subtipo (opcional)" /> */}
                        <label className="form-label">Metódo de pago:</label>
                        <div>
                            <select className="form-select" {...register('paymentMethod')}>
                                <option value="">Selecciona un método de pago</option>
                                <option value="cuentaBs">Cuentas Bs.</option>
                                <option value="bsEfectivo">Efectivo Bs.</option>
                                <option value="dolaresEfectivo">Efectivo $</option>
                                <option value="Transferencia">Transferencia</option>
                            </select>
                            {errors.paymentMethod && <p className="error-message">{errors.paymentMethod.message}</p>}
                        </div>

                    </div>
                </div>
            </div>

            {/* <input className="input" type="text" {...register('invoiceId')} placeholder="ID Factura (opcional)" /> */}
            <div className="flex justify-end gap-3 pt-6">
                <button
                    type="button"
                    onClick={onCancel}
                    className="rounded-xl border border-gray-300 bg-white px-6 py-3 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
                >
                    Cancelar
                </button>

                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-medium 
               text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                    {isSubmitting ? (
                        <>
                            <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                            Guardando...
                        </>
                    ) : (
                        <>
                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            Guardar Cambios
                        </>
                    )}
                </button>
            </div>

        </form>
    );
};
