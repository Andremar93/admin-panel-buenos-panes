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
            date: new Date(initialData.date).toISOString().split('T')[0],
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

            <form onSubmit={handleSubmit(onSubmit)} className="form-container form-container-no-shadow">
                <div className='form-group'>

                    <label className="form-label">Fecha del ingreso:</label>
                    <input type="date" className="form-input" {...register('date')} />
                    {errors.date && <p className="form-error">{errors.date.message}</p>}
                </div>

                <div className="space-y-4 mt-4">

                    <h4 className="text-sm font-semibold text-gray-800 border-b border-gray-100 pb-2">
                        Ingresos en Efectivo
                    </h4>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div className="form-group">
                            <label className="form-label">Efectivo Bs</label>

                            <input
                                type="number"
                                step="0.01"
                                className="form-input"
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
                            {errors.efectivoBs && <p className="form-error">{errors.efectivoBs.message}</p>}
                        </div>

                        <div className="form-group">

                            <label className="form-label">Efectivo Dólares</label>
                            <input
                                className="form-input"
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
                            {errors.efectivoDolares && <p className="form-error">{errors.efectivoDolares.message}</p>}
                        </div>
                    </div>

                </div>

                <div className="space-y-4 mt-4">
                    <h4 className="text-sm font-semibold text-gray-800 border-b border-gray-100 pb-2">
                        Métodos de Pago Electrónicos
                    </h4>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        <div className="form-group">
                            <label className="form-label">Sitef</label>
                            <input
                                className="form-input"
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
                            {errors.sitef && <p className="form-error">{errors.sitef.message}</p>}
                        </div>
                        <div className="form-group">
                            <label className="form-label">Punto Externo</label>
                            <input
                                className="form-input"
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
                            {errors.puntoExterno && <p className="form-error">{errors.puntoExterno.message}</p>}
                        </div>
                        <div className="form-group">
                            <label className="form-label">Pago Móvil</label>
                            <input
                                className="form-input"
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
                            {errors.pagomovil && <p className="form-error">{errors.pagomovil.message}</p>}
                        </div>
                        <div className="form-group">
                            <label className="form-label">Biopago</label>
                            <input
                                className="form-input"
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
                            {errors.biopago && <p className="form-error">{errors.biopago.message}</p>}
                        </div>

                    </div>
                </div>


                <div className="space-y-4 mt-4">
                    <h4 className="text-sm font-semibold text-gray-800 border-b border-gray-100 pb-2">
                        Gastos del Día
                    </h4>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

                        <div className="form-group">
                            <label className="form-label">Gastos Bs</label>
                            <input
                                className="form-input"
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
                            {errors.gastosBs && <p className="form-error">{errors.gastosBs.message}</p>}
                        </div>
                        <div className="form-group">
                            <label className="form-label">Gastos Dólares</label>
                            <input
                                className="form-input"
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
                            {errors.gastosDolares && <p className="form-error">{errors.gastosDolares.message}</p>}
                        </div>
                    </div>
                </div>



                {/* Total del Sistema */}
                <div className="space-y-4 mt-4">
                    <h4 className="text-sm font-semibold text-gray-800 border-b border-gray-100 pb-2">
                        Total del Sistema
                    </h4>

                    <div className='form-group'>
                        <label className="form-label">Total Sistema</label>
                        <input
                            className="form-input"
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
                        {errors.totalSistema && <p className="form-error">{errors.totalSistema.message}</p>}
                    </div>
                </div>


                <div className="space-y-4 mt-4">
                    <label className="form-label">Notas</label>
                    <textarea className="form-input" {...register('notas')} />
                    {errors.notas && <p className="form-error">{errors.notas.message}</p>}

                    <input
                        type="hidden"
                        {...register('_id')}
                        value={watch('_id')}
                    />

                </div>


                <div className="flex justify-between gap-4 pt-4">
                    <button type="submit" disabled={isSubmitting} className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-medium text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60">
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
