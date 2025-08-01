import React, { useEffect, useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { UpdateIncomeDTOType, UpdateIncomeDTO } from '@/presentation/dtos/income/UpdateIncomeDto';
import Income from '@/domain/model/Income';

interface Props {
    initialData: Income;
    onUpdated: (id: string, data: Partial<Income>) => void;
    onCancel: () => void;
}

export const EditIncomeForm: React.FC<Props> = ({ initialData, onUpdated, onCancel }) => {
    const [successMessage, setSuccessMessage] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        watch,
        setValue,
    } = useForm<UpdateIncomeDTOType>({
        resolver: zodResolver(UpdateIncomeDTO),
    });

    const hasInitialData = useRef(false);

    useEffect(() => {
        if (!initialData || hasInitialData.current) return;

        hasInitialData.current = true;

        reset({
            biopago: initialData.biopago,
            date:  new Date(initialData.date).toISOString().split('T')[0],
            efectivoBs: initialData.efectivoBs,
            efectivoDolares: initialData.efectivoDolares,
            gastosBs: initialData.gastosBs,
            gastosDolares: initialData.gastosDolares,
            notas: initialData.notas,
            pagomovil: initialData.pagomovil,
            puntoExterno: initialData.puntoExterno,
            sitef: initialData.sitef,
            totalSistema: initialData.totalSistema
        });
    }, [initialData]);


    const onSubmit = async (data: UpdateIncomeDTOType) => {
        setIsSubmitting(true);
        try {
            await onUpdated(initialData._id, data);
            setSuccessMessage('Ingreso modificado exitosamente');

            setTimeout(() => {
                setSuccessMessage('');
                reset();
                onCancel();
            }, 3000);
        } catch (err) {
            alert('Error actualizando el ingreso');
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
                <h2 className="text-lg font-bold text-primary">Editar Ingreso</h2>

                <label className="block text-sm font-medium text-gray-700 mb-1">Fecha del ingreso:</label>
                <input type="date" className="input" {...register('date')} />
                {errors.date && <p className="error-message">{errors.date.message}</p>}

                <label className="block text-sm font-medium text-gray-700 mb-1">Efectivo Bs</label>

                <input
                    type="number"
                    step="0.01"
                    className="input"
                    {...register('efectivoBs', {
                        setValueAs: (v) => {
                            if (typeof v === 'string') {
                                const replaced = v.replace(',', '.');
                                return parseFloat(replaced);
                            }
                            return v;
                        },
                    })}
                />
                {errors.efectivoBs && <p className="error-message">{errors.efectivoBs.message}</p>}

                <label className="block text-sm font-medium text-gray-700 mb-1">Efectivo Dólares</label>
                <input
                    className="input"
                    type="text"
                    {...register('efectivoDolares', {
                        setValueAs: (v) => {
                            const str = typeof v === 'string' ? v : String(v ?? '');
                            const replaced = str.replace(',', '.');
                            const parsed = parseFloat(replaced);
                            return parsed;
                        },
                    })}
                    placeholder="Monto"
                />
                {errors.efectivoDolares && <p className="error-message">{errors.efectivoDolares.message}</p>}


                <label className="block text-sm font-medium text-gray-700 mb-1">Sitef</label>
                <input
                    className="input"
                    type="text"
                    {...register('sitef', {
                        setValueAs: (v) => {
                            const str = typeof v === 'string' ? v : String(v ?? '');
                            const replaced = str.replace(',', '.');
                            const parsed = parseFloat(replaced);
                            return parsed;
                        },
                    })}
                    placeholder="Monto"
                />
                {errors.sitef && <p className="error-message">{errors.sitef.message}</p>}

                <label className="block text-sm font-medium text-gray-700 mb-1">Punto Externo</label>
                <input
                    className="input"
                    type="text"
                    {...register('puntoExterno', {
                        setValueAs: (v) => {
                            const str = typeof v === 'string' ? v : String(v ?? '');
                            const replaced = str.replace(',', '.');
                            const parsed = parseFloat(replaced);
                            return parsed;
                        },
                    })}
                    placeholder="Monto"
                />
                {errors.puntoExterno && <p className="error-message">{errors.puntoExterno.message}</p>}

                <label className="block text-sm font-medium text-gray-700 mb-1">Pago Móvil</label>
                <input
                    className="input"
                    type="text"
                    {...register('pagomovil', {
                        setValueAs: (v) => {
                            const str = typeof v === 'string' ? v : String(v ?? '');
                            const replaced = str.replace(',', '.');
                            const parsed = parseFloat(replaced);
                            return parsed;
                        },
                    })}
                    placeholder="Monto"
                />
                {errors.pagomovil && <p className="error-message">{errors.pagomovil.message}</p>}

                <label className="block text-sm font-medium text-gray-700 mb-1">Biopago</label>
                <input
                    className="input"
                    type="text"
                    {...register('biopago', {
                        setValueAs: (v) => {
                            const str = typeof v === 'string' ? v : String(v ?? '');
                            const replaced = str.replace(',', '.');
                            const parsed = parseFloat(replaced);
                            return parsed;
                        },
                    })}
                    placeholder="Monto"
                />
                {errors.biopago && <p className="error-message">{errors.biopago.message}</p>}

                <label className="block text-sm font-medium text-gray-700 mb-1">Gastos Bs</label>
                <input
                    className="input"
                    type="text"
                    {...register('gastosBs', {
                        setValueAs: (v) => {
                            const str = typeof v === 'string' ? v : String(v ?? '');
                            const replaced = str.replace(',', '.');
                            const parsed = parseFloat(replaced);
                            return parsed;
                        },
                    })}
                    placeholder="Monto"
                />
                {errors.gastosBs && <p className="error-message">{errors.gastosBs.message}</p>}

                <label className="block text-sm font-medium text-gray-700 mb-1">Gastos Dólares</label>
                <input
                    className="input"
                    type="text"
                    {...register('gastosDolares', {
                        setValueAs: (v) => {
                            const str = typeof v === 'string' ? v : String(v ?? '');
                            const replaced = str.replace(',', '.');
                            const parsed = parseFloat(replaced);
                            return parsed;
                        },
                    })}
                    placeholder="Monto"
                />
                {errors.gastosDolares && <p className="error-message">{errors.gastosDolares.message}</p>}

                <label className="block text-sm font-medium text-gray-700 mb-1">Total Sistema</label>
                <input
                    className="input"
                    type="text"
                    {...register('totalSistema', {
                        setValueAs: (v) => {
                            const str = typeof v === 'string' ? v : String(v ?? '');
                            const replaced = str.replace(',', '.');
                            const parsed = parseFloat(replaced);
                            return parsed;
                        },
                    })}
                    placeholder="Monto"
                />
                {errors.totalSistema && <p className="error-message">{errors.totalSistema.message}</p>}

                <label className="block text-sm font-medium text-gray-700 mb-1">Notas</label>
                <textarea className="input" {...register('notas')} />
                {errors.notas && <p className="error-message">{errors.notas.message}</p>}

                <input
                    type="hidden"
                    {...register('_id')}
                    value={watch('_id')}
                />


                <div className="flex justify-between gap-4 pt-4">
                    <button type="submit" disabled={isSubmitting} className="btn flex-1">
                        {isSubmitting ? 'Actualizando...' : 'Actualizar'}
                    </button>
                    <button type="button" onClick={onCancel} className="btn-secondary flex-1">
                        Cancelar
                    </button>
                </div>
            </form>
        </div>
    );
};
