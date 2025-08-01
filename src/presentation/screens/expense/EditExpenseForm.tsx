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
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 bg-white p-6 rounded-xl shadow-md">
            <h2 className="text-lg font-bold text-primary">Editar Gasto</h2>

            <div>
                <input className="input" {...register('description')} placeholder="Descripción" />
                {errors.description && <p className="error-message">{errors.description.message}</p>}
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


            <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de gasto:</label>
            <div>
                <select className="input" {...register('type')}>
                    <option value="">Selecciona un tipo de gasto</option>
                    <option value="gastosFijos">Gastos Fijos</option>
                    <option value="comprasDiarias">Compras Diarias</option>
                    <option value="gastosPersonales">Gastos Personales</option>
                    <option value="gastosExtraordinarios">Gastos Extraordinarios</option>
                    <option value="Proveedor">Proveedor</option>
                </select>
                {errors.type && <p className="error-message">{errors.type.message}</p>}
            </div>
            <input className="input" type="date" {...register('date')} />
            {errors.date && <p className="error-message">{errors.date.message}</p>}


            {/* <input className="input" type="text" {...register('subType')} placeholder="Subtipo (opcional)" /> */}
            <label className="block text-sm font-medium text-gray-700 mb-1">Metódo de pago:</label>
            <div>
                <select className="input" {...register('paymentMethod')}>
                    <option value="">Selecciona un método de pago</option>
                    <option value="cuentaBs">Cuentas Bs.</option>
                    <option value="bsEfectivo">Efectivo Bs.</option>
                    <option value="dolaresEfectivo">Efectivo $</option>
                    <option value="Transferencia">Transferencia</option>
                </select>
                {errors.paymentMethod && <p className="error-message">{errors.paymentMethod.message}</p>}
            </div>
            {/* <input className="input" type="text" {...register('invoiceId')} placeholder="ID Factura (opcional)" /> */}

            <div className="flex justify-between gap-4">
                <button type="submit" className="btn w-full">Guardar</button>
                <button type="button" className="btn w-full bg-gray-200 text-gray-800" onClick={onCancel}>Cancelar</button>
            </div>
        </form>
    );
};
