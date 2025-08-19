// src/presentation/screens/employee/debts/CreateEmployeeDebtWithItems.tsx
import React, { useMemo } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import {
    CreateEmployeeDebtWithItemsDTO,
    CreateEmployeeDebtWithItemsDTOType,
} from '@/presentation/dtos/employee/CreateEmployeeWithDebtItemDto';
import { DebtApi } from '@/infrastructure/DebtApi';

type Employee = {
    _id: string;
    id?: string;
    name: string;
    position?: string;
};

type Props = {
    employees: Employee[];
    onCreated?: (debt: any) => void; // opcional: lo que devuelva tu backend poblado
    onCancel?: () => void;
};

const inputBase =
    'w-full rounded-xl border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-60';
const selectBase =
    'w-full rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-60';

export const CreateEmployeeDebtWithItems: React.FC<Props> = ({
    employees,
    onCreated,
    onCancel,
}) => {
    const {
        register,
        control,
        handleSubmit,
        watch,
        formState: { errors, isSubmitting, isValid },
    } = useForm<CreateEmployeeDebtWithItemsDTOType>({
        resolver: zodResolver(CreateEmployeeDebtWithItemsDTO),
        mode: 'onChange',
        defaultValues: {
            employeeId: '',
            description: '',
            notes: '',
            items: [{ description: '', unitPrice: 0, quantity: 1 }],
        },
    });

    const { fields, append, remove } = useFieldArray({
        control,
        name: 'items',
    });

    const employeeId = watch('employeeId');
    const items = watch('items');

    // Totales UI (el backend recalcula igual)
    const total = useMemo(
        () =>
            (items ?? []).reduce((acc, it) => {
                const price = Number(it.unitPrice) || 0;
                const qty = Number(it.quantity) || 0;
                return acc + price * qty;
            }, 0),
        [items]
    );

    const selectedEmployee = useMemo(
        () => employees.find((e) => e._id === employeeId || e.id === employeeId),
        [employees, employeeId]
    );

    const onSubmit = async (formData: CreateEmployeeDebtWithItemsDTOType) => {
        try {
            const created = await DebtApi.create(formData);
            if (onCreated) onCreated(created);
            alert('Deuda creada correctamente.');
        } catch (e: any) {
            console.error(e);
            const msg = e?.response?.data?.message || 'Error al crear la deuda';
            alert(msg);
        }
    };

    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
        >
            <div className="mb-6">
                <h2 className="text-lg font-semibold text-gray-900">Crear deuda de empleado</h2>
                <p className="text-sm text-gray-500">
                    Registra una deuda con ítems detallados. El total se calculará también en el servidor.
                </p>
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                {/* Columna izquierda (form principal) */}
                <div className="lg:col-span-2 space-y-5">
                    {/* Empleado */}
                    <div className="max-w-xl">
                        <label className="mb-1 block text-sm font-medium text-gray-700">
                            Empleado
                        </label>
                        <select
                            className={selectBase}
                            {...register('employeeId', { required: true })}
                        >
                            <option value="">Selecciona un empleado</option>
                            {employees.map((emp) => {
                                const value = emp._id || emp.id || '';
                                return (
                                    <option key={value} value={value}>
                                        {emp.name}
                                    </option>
                                );
                            })}
                        </select>
                        {errors.employeeId && (
                            <p className="mt-1 text-xs text-red-600">Selecciona un empleado válido</p>
                        )}
                    </div>

                    {/* Descripción */}
                    <div className="max-w-2xl">
                        <label className="mb-1 block text-sm font-medium text-gray-700">
                            Descripción
                        </label>
                        <input
                            type="text"
                            placeholder="Ej: Préstamo, compra en comedor, adelanto, etc."
                            className={inputBase}
                            {...register('description', {
                                setValueAs: (v) => (typeof v === 'string' ? v.trim() : v),
                            })}
                        />
                        {errors.description && (
                            <p className="mt-1 text-xs text-red-600">
                                {String(errors.description.message)}
                            </p>
                        )}
                    </div>

                    {/* Fechas / Notas */}
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                        <div>
                            <label className="mb-1 block text-sm font-medium text-gray-700">
                                Vence el (opcional)
                            </label>
                            <input type="date" className={inputBase} {...register('dueDate')} />
                        </div>
                        <div className="sm:col-span-2">
                            <label className="mb-1 block text-sm font-medium text-gray-700">
                                Notas (opcional)
                            </label>
                            <input
                                type="text"
                                className={inputBase}
                                placeholder="Observaciones o detalles relevantes…"
                                {...register('notes', {
                                    setValueAs: (v) => (typeof v === 'string' ? v.trim() : v),
                                })}
                            />
                            {errors.notes && (
                                <p className="mt-1 text-xs text-red-600">
                                    {String(errors.notes.message)}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Ítems */}
                    <div className="rounded-xl border border-gray-200">
                        <div className="flex items-center justify-between border-b border-gray-100 p-3">
                            <h3 className="text-sm font-semibold text-gray-900">Ítems</h3>
                            <button
                                type="button"
                                onClick={() =>
                                    append({ description: '', unitPrice: 0, quantity: 1 })
                                }
                                className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50"
                            >
                                Agregar ítem
                            </button>
                        </div>

                        <div className="divide-y divide-gray-100">
                            {fields.map((field, index) => (
                                <div key={field.id} className="grid grid-cols-1 gap-4 p-4 sm:grid-cols-12">
                                    <div className="sm:col-span-5">
                                        <label className="mb-1 block text-sm font-medium text-gray-700">
                                            Descripción
                                        </label>
                                        <input
                                            type="text"
                                            className={inputBase}
                                            {...register(`items.${index}.description`, {
                                                setValueAs: (v) => (typeof v === 'string' ? v.trim() : v),
                                            })}
                                        />
                                        {errors.items?.[index]?.description && (
                                            <p className="mt-1 text-xs text-red-600">
                                                {String(errors.items[index]?.description?.message)}
                                            </p>
                                        )}
                                    </div>

                                    <div className="sm:col-span-3">
                                        <label className="mb-1 block text-sm font-medium text-gray-700">
                                            Precio unitario (USD)
                                        </label>
                                        <input
                                            type="number"
                                            inputMode="decimal"
                                            step="0.01"
                                            min={0}
                                            className={inputBase}
                                            {...register(`items.${index}.unitPrice`, {
                                                setValueAs: (v) =>
                                                    v === '' ? 0 : Number(String(v).replace(',', '.')),
                                            })}
                                        />
                                        {errors.items?.[index]?.unitPrice && (
                                            <p className="mt-1 text-xs text-red-600">
                                                {String(errors.items[index]?.unitPrice?.message)}
                                            </p>
                                        )}
                                    </div>

                                    <div className="sm:col-span-2">
                                        <label className="mb-1 block text-sm font-medium text-gray-700">
                                            Cantidad
                                        </label>
                                        <input
                                            type="number"
                                            inputMode="numeric"
                                            step="1"
                                            min={1}
                                            className={inputBase}
                                            {...register(`items.${index}.quantity`, {
                                                setValueAs: (v) => (v === '' ? 1 : parseInt(String(v), 10)),
                                            })}
                                        />
                                        {errors.items?.[index]?.quantity && (
                                            <p className="mt-1 text-xs text-red-600">
                                                {String(errors.items[index]?.quantity?.message)}
                                            </p>
                                        )}
                                    </div>

                                    <div className="sm:col-span-2">
                                        <label className="mb-1 block text-sm font-medium text-gray-700">
                                            Subtotal
                                        </label>
                                        <input
                                            type="number"
                                            className={inputBase}
                                            value={Number(items?.[index]?.unitPrice || 0) * Number(items?.[index]?.quantity || 0)}
                                            readOnly
                                        />
                                    </div>

                                    <div className="sm:col-span-12 flex justify-end">
                                        <button
                                            type="button"
                                            onClick={() => remove(index)}
                                            className="rounded-lg border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-medium text-red-700 hover:bg-red-100"
                                        >
                                            Quitar
                                        </button>
                                    </div>
                                </div>
                            ))}

                            {/* Validación de lista */}
                            {typeof errors.items?.message === 'string' && (
                                <p className="px-4 pb-4 text-xs text-red-600">
                                    {errors.items?.message}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Acciones */}
                    <div className="flex flex-wrap items-center gap-3 pt-2">
                        <button
                            type="submit"
                            disabled={isSubmitting || !isValid || !employeeId}
                            className="inline-flex items-center justify-center rounded-xl bg-indigo-600 px-5 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {isSubmitting ? 'Creando…' : 'Crear deuda'}
                        </button>
                        {onCancel && (
                            <button
                                type="button"
                                onClick={onCancel}
                                className="inline-flex items-center justify-center rounded-xl border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                            >
                                Cancelar
                            </button>
                        )}
                    </div>
                </div>

                {/* Columna derecha (resumen) */}
                <aside className="space-y-4">
                    <div className="rounded-xl border border-gray-200 p-4">
                        <p className="text-xs text-gray-500">Resumen</p>
                        <div className="mt-2 space-y-1">
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-gray-500">Empleado</span>
                                <span className="font-medium text-gray-900">
                                    {selectedEmployee?.name || '—'}
                                </span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-gray-500">Ítems</span>
                                <span className="font-medium text-gray-900">{items?.length ?? 0}</span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-gray-500">Total estimado</span>
                                <span className="font-semibold text-gray-900">
                                    ${Number.isFinite(total) ? total.toFixed(2) : '0.00'}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-xl border border-blue-200 bg-blue-50 p-4 text-sm text-blue-900">
                        <p className="font-medium">Tip</p>
                        <p className="mt-1">
                            El subtotal de cada ítem y el total final se recalculan en el servidor para garantizar
                            consistencia.
                        </p>
                    </div>
                </aside>
            </div>
        </form>
    );
};

export default CreateEmployeeDebtWithItems;
