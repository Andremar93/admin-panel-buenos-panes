import React, { useEffect, useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CreateIncomeDTOType, CreateIncomeDTO } from '@/presentation/dtos/income/createIncomeDto';
import Income from '@/domain/model/Income';
import { Button, Input, Alert } from '@/presentation/components/ui';

interface Props {
    initialData: Income;
    onCreated: (data: CreateIncomeDTOType) => void;
    // onCancel: () => void;
}

export const CreateIncomeForm: React.FC<Props> = ({ initialData, onCreated }) => {
    const [successMessage, setSuccessMessage] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
      
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        watch,
        setValue,
    } = useForm<CreateIncomeDTOType>({
        resolver: zodResolver(CreateIncomeDTO),
    });

    const hasInitialData = useRef(false);

    useEffect(() => {
        if (!initialData || hasInitialData.current) return;

        hasInitialData.current = true;

        reset({
            biopago: Number(initialData.biopago),
            date: new Date(initialData.date).toISOString().split('T')[0], // para input tipo date
            efectivoBs: Number(initialData.efectivoBs),
            efectivoDolares: Number(initialData.efectivoDolares),
            gastosBs: Number(initialData.gastosBs),
            gastosDolares: Number(initialData.gastosDolares),
            notas: initialData.notas,
            pagomovil: Number(initialData.pagomovil),
            puntoExterno: Number(initialData.puntoExterno),
            sitef: Number(initialData.sitef),
            totalSistema: Number(initialData.totalSistema)
        });
    }, [initialData]);

    const onSubmit = async (data: CreateIncomeDTOType) => {
        setIsSubmitting(true);
        try {
            await onCreated(data);
            setSuccessMessage('Ingreso creado exitosamente');
            setTimeout(() => {
                setSuccessMessage('');
                reset();
            }, 3000);
        } catch (err) {
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

            <form onSubmit={handleSubmit(onSubmit)} className="form-container form-container-no-shadow">
                <p className="form-subtitle">
                    Completa la información del ingreso del día. Todos los campos son obligatorios.
                    <br />
                    Si no hay un un numero escribir 0. Los decimales se separan con punto. No usar comas.
                </p>

                {/* Fecha */}
                <div className="form-group">
                    <label className="form-label">Fecha del ingreso</label>
                    <input 
                        type="date" 
                        className="form-input" 
                        {...register('date')} 
                    />
                    {errors.date && <p className="form-error">{errors.date.message}</p>}
                </div>

                {/* Ingresos en Efectivo */}
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
                                placeholder="0.00"
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
                                type="number"
                                step="0.01"
                                className="form-input"
                                placeholder="0.00"
                                {...register('efectivoDolares', {
                                    setValueAs: (v) => {
                                        const str = typeof v === 'string' ? v : String(v ?? '');
                                        const replaced = str.replace(',', '.');
                                        const parsed = parseFloat(replaced);
                                        return parsed;
                                    },
                                })}
                            />
                            {errors.efectivoDolares && <p className="form-error">{errors.efectivoDolares.message}</p>}
                        </div>
                    </div>
                </div>

                {/* Métodos de Pago Electrónicos */}
                <div className="space-y-4 mt-4">
                    <h4 className="text-sm font-semibold text-gray-800 border-b border-gray-100 pb-2">
                        Métodos de Pago Electrónicos
                    </h4>
                    
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        <div className="form-group">
                            <label className="form-label">Sitef</label>
                            <input
                                type="number"
                                step="0.01"
                                className="form-input"
                                placeholder="0.00"
                                {...register('sitef', {
                                    setValueAs: (v) => {
                                        const str = typeof v === 'string' ? v : String(v ?? '');
                                        const replaced = str.replace(',', '.');
                                        const parsed = parseFloat(replaced);
                                        return parsed;
                                    },
                                })}
                            />
                            {errors.sitef && <p className="form-error">{errors.sitef.message}</p>}
                        </div>

                        <div className="form-group">
                            <label className="form-label">Punto Externo</label>
                            <input
                                type="number"
                                step="0.01"
                                className="form-input"
                                placeholder="0.00"
                                {...register('puntoExterno', {
                                    setValueAs: (v) => {
                                        const str = typeof v === 'string' ? v : String(v ?? '');
                                        const replaced = str.replace(',', '.');
                                        const parsed = parseFloat(replaced);
                                        return parsed;
                                    },
                                })}
                            />
                            {errors.puntoExterno && <p className="form-error">{errors.puntoExterno.message}</p>}
                        </div>

                        <div className="form-group">
                            <label className="form-label">Pago Móvil</label>
                            <input
                                type="number"
                                step="0.01"
                                className="form-input"
                                placeholder="0.00"
                                {...register('pagomovil', {
                                    setValueAs: (v) => {
                                        const str = typeof v === 'string' ? v : String(v ?? '');
                                        const replaced = str.replace(',', '.');
                                        const parsed = parseFloat(replaced);
                                        return parsed;
                                    },
                                })}
                            />
                            {errors.pagomovil && <p className="form-error">{errors.pagomovil.message}</p>}
                        </div>

                        <div className="form-group">
                            <label className="form-label">Biopago</label>
                            <input
                                type="number"
                                step="0.01"
                                className="form-input"
                                placeholder="0.00"
                                {...register('biopago', {
                                    setValueAs: (v) => {
                                        const str = typeof v === 'string' ? v : String(v ?? '');
                                        const replaced = str.replace(',', '.');
                                        const parsed = parseFloat(replaced);
                                        return parsed;
                                    },
                                })}
                            />
                            {errors.biopago && <p className="form-error">{errors.biopago.message}</p>}
                        </div>
                    </div>
                </div>

                {/* Gastos */}
                <div className="space-y-4 mt-4">
                    <h4 className="text-sm font-semibold text-gray-800 border-b border-gray-100 pb-2">
                        Gastos del Día
                    </h4>
                    
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div className="form-group">
                            <label className="form-label">Gastos Bs</label>
                            <input
                                type="number"
                                step="0.01"
                                className="form-input"
                                placeholder="0.00"
                                {...register('gastosBs', {
                                    setValueAs: (v) => {
                                        const str = typeof v === 'string' ? v : String(v ?? '');
                                        const replaced = str.replace(',', '.');
                                        const parsed = parseFloat(replaced);
                                        return parsed;
                                    },
                                })}
                            />
                            {errors.gastosBs && <p className="form-error">{errors.gastosBs.message}</p>}
                        </div>

                        <div className="form-group">
                            <label className="form-label">Gastos Dólares</label>
                            <input
                                type="number"
                                step="0.01"
                                className="form-input"
                                placeholder="0.00"
                                {...register('gastosDolares', {
                                    setValueAs: (v) => {
                                        const str = typeof v === 'string' ? v : String(v ?? '');
                                        const replaced = str.replace(',', '.');
                                        const parsed = parseFloat(replaced);
                                        return parsed;
                                    },
                                })}
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
                    
                    <div className="form-group">
                        <label className="form-label">Total Sistema</label>
                        <input
                            type="number"
                            step="0.01"
                            className="form-input"
                            placeholder="0.00"
                            {...register('totalSistema', {
                                setValueAs: (v) => {
                                    const str = typeof v === 'string' ? v : String(v ?? '');
                                    const replaced = str.replace(',', '.');
                                    const parsed = parseFloat(replaced);
                                    return parsed;
                                },
                            })}
                        />
                        {errors.totalSistema && <p className="form-error">{errors.totalSistema.message}</p>}
                    </div>
                </div>

                {/* Notas */}
                <div className="space-y-4 mt-4">
                    <h4 className="text-sm font-semibold text-gray-800 border-b border-gray-100 pb-2">
                        Información Adicional
                    </h4>
                    
                    <div className="form-group">
                        <label className="form-label">Notas</label>
                        <textarea 
                            className="form-textarea" 
                            rows={3}
                            placeholder="Observaciones adicionales sobre el ingreso del día..."
                            {...register('notas')} 
                        />
                        {errors.notas && <p className="form-error">{errors.notas.message}</p>}
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
                                Crear Ingreso
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
};
