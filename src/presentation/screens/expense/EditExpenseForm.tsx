import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ExpenseDTO, ExpenseDTOType } from '@/presentation/dtos/ExpenseDto';
import { Expense } from '@/domain/model/Expense';
import { updateExpenseUseCase } from '@/application/di/expenseInstances';

interface EditExpenseFormProps {
    initialData: Expense;
    onClose: () => void;
    onSave: (updatedExpense: Expense) => void;
}

export const EditExpenseForm: React.FC<EditExpenseFormProps> = ({ initialData, onClose, onSave }) => {
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset
    } = useForm<ExpenseDTOType>({
        resolver: zodResolver(ExpenseDTO),
        defaultValues: {
            ...initialData,
            date: new Date(initialData.date).toISOString().split('T')[0] // Para input type="date"
        }
    });

    const onSubmit = async (data: ExpenseDTOType) => {
        try {
            const updated = await updateExpenseUseCase.execute(initialData._id, data);
            onSave(updated);
        } catch (error) {
            alert('Error al actualizar el gasto');
            console.error(error);
        }
    };

    return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 bg-white p-6 rounded-xl shadow-md">
            <h2 className="text-lg font-bold text-primary">Editar Gasto</h2>

            <div>
                <input className="input" {...register('description')} placeholder="Descripción" />
                {errors.description && <p className="error-message">{errors.description.message}</p>}
            </div>

            <div className="flex gap-4">
                <input className="input" type="number" step="0.01" {...register('amountDollars')} placeholder="Monto $" />
                <input className="input" type="number" step="0.01" {...register('amountBs')} placeholder="Monto Bs" />
            </div>

            <select className="input" {...register('currency')}>
                <option value="$">$</option>
                <option value="Bs">Bs</option>
            </select>

            <input className="input" type="text" {...register('type')} placeholder="Tipo de gasto" />
            {errors.type && <p className="error-message">{errors.type.message}</p>}

            <input className="input" type="date" {...register('date')} />
            {errors.date && <p className="error-message">{errors.date.message}</p>}

            {/* <label className="flex items-center gap-2">
                <input type="checkbox" {...register('paid')} className="form-checkbox" />
                <span className="text-sm">Pagado</span>
            </label> */}


            <input className="input" type="text" {...register('subType')} placeholder="Subtipo (opcional)" />
            <input className="input" type="text" {...register('paymentMethod')} placeholder="Método de pago (opcional)" />
            {/* <input className="input" type="text" {...register('invoiceId')} placeholder="ID Factura (opcional)" /> */}

            <div className="flex justify-between gap-4">
                <button type="submit" className="btn w-full">Guardar</button>
                <button type="button" className="btn w-full bg-gray-200 text-gray-800" onClick={onClose}>Cancelar</button>
            </div>
        </form>
    );
};
