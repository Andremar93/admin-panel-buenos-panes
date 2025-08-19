// src/presentation/screens/employee/debt/CreateEmployeeDebt.tsx
import React, { useEffect, useMemo } from 'react';
import { useEmployeeDebt } from '@/hooks/useEmployeeDebt';
import { useFieldArray, useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
    CreateEmployeeDebtDTOType,
    CreateEmployeeDebtFormDTO,
    CreateEmployeeDebtFormDTOType
} from '@/presentation/dtos/employee/CreateEmployeeDebtDto';

type Props = {
    employees: Employee[];
    currentUserId: string;
    onCreated?: (d: any) => void;
    onCancel?: () => void;
};

export const CreateEmployeeDebt: React.FC<Props> = ({
    employees,
    currentUserId,
    onCreated,
    onCancel
}) => {
    const { createDebt, loading, error } = useEmployeeDebt();

    const {
        register,
        handleSubmit,
        control,
        setValue,
        formState: { errors, isValid, isSubmitting },
    } = useForm<CreateEmployeeDebtFormDTOType>({
        resolver: zodResolver(CreateEmployeeDebtFormDTO),
        mode: 'onChange',
        defaultValues: {
            employeeId: '',
            description: '',
            totalAmount: 0,
            notes: '',
            type: 'standard',
            paymentDate: undefined, // reused as Vale snapshot date
            items: []
        }
    });

    const { fields, append, remove } = useFieldArray({ control, name: 'items' });

    // Watch fields
    const items = useWatch({ control, name: 'items' }) ?? [];
    const type = useWatch({ control, name: 'type' }) || 'standard';

    // Auto-create a first row when switching to "vale" so the Bs input is visible
    useEffect(() => {
        if (type === 'vale' && fields.length === 0) {
            append({ concept: 'Vale', unitAmount: 0, quantity: 1 });
        }
    }, [type, fields.length, append]);

    // Totals: compute once (works for both types)
    const computed = useMemo(() => {
        const rows = items.map((it) => {
            const price = Number(it?.unitAmount || 0);
            const qty = Number(it?.quantity || 0);
            const subtotal = price * qty;
            return { price, qty, subtotal };
        });
        const subtotal = rows.reduce((acc, r) => acc + (isFinite(r.subtotal) ? r.subtotal : 0), 0);
        const hasAnyQty = rows.some((r) => r.qty > 0);
        const hasAnyPrice = rows.some((r) => r.price > 0);
        return { rows, subtotal, hasAnyQty, hasAnyPrice };
    }, [items]);

    // Keep totalAmount synced for UI only:
    // - standard => totalAmount = subtotal USD
    // - vale => set 0; backend will compute USD after resolving rate
    useEffect(() => {
        const t = type === 'standard' ? Number(computed.subtotal.toFixed(2)) : 0;
        setValue('totalAmount', t, { shouldValidate: true, shouldDirty: true });
    }, [computed.subtotal, setValue, type]);

    const onInvalid = (errs: any) => {
        console.warn('Form inválido:', errs);
    };

    const onSubmit = async (data: CreateEmployeeDebtFormDTOType) => {
        const payload: CreateEmployeeDebtDTOType = {
            employeeId: data.employeeId,
            description: data.description,
            notes: data.notes,
            type: data.type,
            paymentDate: data.paymentDate!,
            items: (data.items ?? []).map((it) => ({
                concept: it.concept.trim(),
                unitAmount: Number(it.unitAmount || 0),
                quantity: Number(it.quantity || 1),
            })),
        };

        const created = await createDebt(payload);
        onCreated?.(created);
    };

    const inputBase =
        'w-full rounded-xl border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-60';
    const selectBase =
        'w-full rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-60';
    const pill = 'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium';

    const canSubmit =
        !loading &&
        isValid &&
        (items?.length ?? 0) > 0 &&
        computed.subtotal > 0;

    const currencyLabel = type === 'vale' ? 'Bs' : 'USD';

    return (
        <form
            onSubmit={handleSubmit(onSubmit, onInvalid)}
            className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
        >
            {/* Header */}
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h2 className="text-lg font-semibold text-gray-900">Nueva deuda</h2>
                    <p className="text-sm text-gray-500">
                        Registra la compra/deuda y sus ítems.
                    </p>
                </div>

                <div className="flex items-center gap-2">
                    {type === 'standard' ? (
                        <span className={`${pill} bg-indigo-50 text-indigo-700`}>
                            Total USD: ${computed.subtotal.toFixed(2)}
                        </span>
                    ) : (
                        <>
                            <span className={`${pill} bg-slate-100 text-slate-700`}>
                                Subtotal Bs: {computed.subtotal.toFixed(2)}
                            </span>
                            <span className={`${pill} bg-amber-50 text-amber-700`}>
                                USD se calculará al guardar
                            </span>
                        </>
                    )}
                    {error && <span className={`${pill} bg-red-50 text-red-700`}>Error</span>}
                </div>
            </div>

            {/* Content */}
            <div className="grid gap-6 lg:grid-cols-3">
                {/* Left: form */}
                <div className="space-y-5 lg:col-span-2">
                    {/* Employee */}
                    <div className="max-w-xl">
                        <label className="mb-1 block text-sm font-medium text-gray-700">
                            Empleado <span className="text-red-500">*</span>
                        </label>
                        <select
                            className={selectBase}
                            aria-invalid={!!errors.employeeId}
                            {...register('employeeId', { required: true })}
                        >
                            <option value="">Selecciona un empleado</option>
                            {employees.map((e) => {
                                const val = (e as any)._id ?? (e as any).id ?? '';
                                return (
                                    <option key={val} value={val}>
                                        {e.name}
                                    </option>
                                );
                            })}
                        </select>
                        {errors.employeeId && (
                            <p className="mt-1 text-xs text-red-600">Empleado requerido</p>
                        )}
                    </div>

                    {/* Type */}
                    <div className="max-w-xs">
                        <label className="mb-1 block text-sm font-medium text-gray-700">Tipo</label>
                        <select className={selectBase} {...register('type')}>
                            <option value="standard">Standard (USD)</option>
                            <option value="vale">Vale (Bs → USD)</option>
                        </select>
                    </div>

                    {/* Date (for vale snapshot) */}
                    <div className="max-w-xs">
                        <label className="mb-1 block text-sm font-medium text-gray-700">
                            Fecha de la compra / vale
                        </label>
                        <input className={inputBase} type="date" {...register('paymentDate')} />
                        {errors.paymentDate && (
                            <p className="mt-1 text-xs text-red-600">
                                {String(errors.paymentDate.message)}
                            </p>
                        )}
                        {type === 'vale' && (
                            <p className="mt-1 text-xs text-gray-500">
                                Se usará para obtener la tasa y calcular USD en el servidor.
                            </p>
                        )}
                    </div>

                    {/* Description */}
                    <div className="max-w-2xl">
                        <label className="mb-1 block text-sm font-medium text-gray-700">
                            Descripción
                        </label>
                        <input
                            type="text"
                            placeholder="Ej: Compra en comedor, insumos, préstamo, etc."
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

                    {/* ITEMS */}
                    {type === 'vale' ? (
                        /* ---------- Compact VALE UI ---------- */
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <h4 className="font-medium">Ítems (Vale)</h4>
                                {fields.length === 0 && (
                                    <button
                                        type="button"
                                        onClick={() => append({ concept: 'Vale', unitAmount: 0, quantity: 1 })}
                                        className="rounded-lg bg-gray-100 px-3 py-1 text-sm hover:bg-gray-200"
                                    >
                                        + Agregar ítem (Bs)
                                    </button>
                                )}
                            </div>

                            {fields.length === 0 ? (
                                <div className="p-4 text-sm text-gray-500">
                                    No hay ítems agregados. Usa “Agregar ítem (Bs)” para empezar.
                                </div>
                            ) : (
                                <div className="grid gap-3 sm:grid-cols-6">
                                    {/* Concept */}
                                    <div className="sm:col-span-3">
                                        <label className="mb-1 block text-sm font-medium text-gray-700">Concepto</label>
                                        <input
                                            className={inputBase}
                                            placeholder="Vale"
                                            {...register(`items.0.concept`, {
                                                required: 'Concepto requerido',
                                                setValueAs: (v) => (typeof v === 'string' ? v.trim() : v),
                                            })}
                                        />
                                        {errors.items?.[0]?.concept && (
                                            <p className="mt-1 text-xs text-red-600">
                                                {String(errors.items[0]?.concept?.message)}
                                            </p>
                                        )}
                                    </div>

                                    {/* Monto (Bs) */}
                                    <div className="sm:col-span-2">
                                        <label className="mb-1 block text-sm font-medium text-gray-700">Monto (Bs)</label>
                                        <input
                                            type="number"
                                            inputMode="decimal"
                                            step="0.01"
                                            min={0}
                                            className={`${inputBase} text-right`}
                                            {...register(`items.0.unitAmount`, {
                                                valueAsNumber: true,
                                                min: { value: 0, message: 'Debe ser ≥ 0' },
                                            })}
                                        />
                                        {errors.items?.[0]?.unitAmount && (
                                            <p className="mt-1 text-xs text-red-600">
                                                {String(errors.items[0]?.unitAmount?.message)}
                                            </p>
                                        )}
                                    </div>

                                    {/* Cantidad */}
                                    <div className="sm:col-span-1">
                                        <label className="mb-1 block text-sm font-medium text-gray-700">Cant.</label>
                                        <input
                                            type="number"
                                            inputMode="numeric"
                                            step="1"
                                            min={1}
                                            className={`${inputBase} text-right`}
                                            {...register(`items.0.quantity`, {
                                                valueAsNumber: true,
                                                min: { value: 1, message: '≥ 1' },
                                                validate: (v) => Number.isInteger(Number(v)) || 'Entero',
                                            })}
                                        />
                                        {errors.items?.[0]?.quantity && (
                                            <p className="mt-1 text-xs text-red-600">
                                                {String(errors.items[0]?.quantity?.message)}
                                            </p>
                                        )}
                                    </div>

                                    {/* Optional: remove button for the single row */}
                                    <div className="sm:col-span-6">
                                        <div className="flex items-center justify-between text-sm">
                                            <div className="text-gray-600">
                                                Subtotal (Bs): <span className="font-medium tabular-nums">{computed.subtotal.toFixed(2)}</span>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => remove(0)}
                                                className="rounded-lg bg-red-50 px-2 py-1 text-sm text-red-700 hover:bg-red-100"
                                            >
                                                Eliminar
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : (
                        /* ---------- Standard (USD) table ---------- */
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <h4 className="font-medium">Ítems</h4>
                                <button
                                    type="button"
                                    onClick={() => append({ concept: '', unitAmount: 0, quantity: 1 })}
                                    className="rounded-lg bg-gray-100 px-3 py-1 text-sm hover:bg-gray-200"
                                >
                                    + Agregar ítem
                                </button>
                            </div>

                            <div className="overflow-hidden rounded-xl border border-gray-200">
                                <div className="grid grid-cols-12 bg-gray-50 px-3 py-2 text-xs font-medium text-gray-600">
                                    <div className="col-span-6">Producto / Concepto</div>
                                    <div className="col-span-2 text-right">Precio ({currencyLabel})</div>
                                    <div className="col-span-2 text-right">Cantidad</div>
                                    <div className="col-span-1 text-right">Subtotal</div>
                                    <div className="col-span-1" />
                                </div>

                                {fields.length === 0 ? (
                                    <div className="p-4 text-sm text-gray-500">
                                        No hay ítems agregados. Usa “Agregar ítem” para empezar.
                                    </div>
                                ) : (
                                    <ul className="divide-y divide-gray-200">
                                        {fields.map((field, index) => {
                                            const price = Number(items?.[index]?.unitAmount || 0);
                                            const qty = Number(items?.[index]?.quantity || 0);
                                            const rowSubtotal = (price * qty) || 0;

                                            return (
                                                <li key={field.id} className="grid grid-cols-12 gap-3 px-3 py-3">
                                                    {/* Concept */}
                                                    <div className="col-span-6">
                                                        <input
                                                            className={inputBase}
                                                            placeholder="Ej. Adelanto, comedor, insumo…"
                                                            {...register(`items.${index}.concept` as const, {
                                                                required: 'Concepto requerido',
                                                                setValueAs: (v) => (typeof v === 'string' ? v.trim() : v),
                                                            })}
                                                            onKeyDown={(e) => {
                                                                const isLast = index === fields.length - 1;
                                                                if (isLast && e.key === 'Enter') {
                                                                    e.preventDefault();
                                                                    append({ concept: '', unitAmount: 0, quantity: 1 });
                                                                }
                                                            }}
                                                        />
                                                        {errors.items?.[index]?.concept && (
                                                            <p className="mt-1 text-xs text-red-600">
                                                                {String(errors.items[index]?.concept?.message)}
                                                            </p>
                                                        )}
                                                    </div>

                                                    {/* Unit Amount */}
                                                    <div className="col-span-2">
                                                        <input
                                                            type="number"
                                                            inputMode="decimal"
                                                            step="0.01"
                                                            min={0}
                                                            className={`${inputBase} text-right`}
                                                            {...register(`items.${index}.unitAmount` as const, {
                                                                valueAsNumber: true,
                                                                min: { value: 0, message: 'Debe ser ≥ 0' },
                                                            })}
                                                        />
                                                        {errors.items?.[index]?.unitAmount && (
                                                            <p className="mt-1 text-xs text-red-600">
                                                                {String(errors.items[index]?.unitAmount?.message)}
                                                            </p>
                                                        )}
                                                    </div>

                                                    {/* Quantity */}
                                                    <div className="col-span-2">
                                                        <input
                                                            type="number"
                                                            inputMode="numeric"
                                                            step="1"
                                                            min={1}
                                                            className={`${inputBase} text-right`}
                                                            {...register(`items.${index}.quantity` as const, {
                                                                valueAsNumber: true,
                                                                min: { value: 1, message: 'Debe ser ≥ 1' },
                                                                validate: (v) =>
                                                                    Number.isInteger(Number(v)) || 'Debe ser un entero',
                                                            })}
                                                        />
                                                        {errors.items?.[index]?.quantity && (
                                                            <p className="mt-1 text-xs text-red-600">
                                                                {String(errors.items[index]?.quantity?.message)}
                                                            </p>
                                                        )}
                                                    </div>

                                                    {/* Subtotal (read-only) */}
                                                    <div className="col-span-1 flex items-center justify-end text-sm font-medium tabular-nums">
                                                        {type === 'vale' ? (
                                                            <span>{rowSubtotal.toFixed(2)} Bs</span>
                                                        ) : (
                                                            <span>${rowSubtotal.toFixed(2)}</span>
                                                        )}
                                                    </div>

                                                    {/* Remove */}
                                                    <div className="col-span-1 flex items-center justify-end">
                                                        <button
                                                            type="button"
                                                            onClick={() => remove(index)}
                                                            className="rounded-lg bg-red-50 px-2 py-1 text-sm text-red-700 hover:bg-red-100"
                                                            aria-label={`Eliminar ítem ${index + 1}`}
                                                            title="Eliminar ítem"
                                                        >
                                                            ×
                                                        </button>
                                                    </div>
                                                </li>
                                            );
                                        })}
                                    </ul>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Notes */}
                    <div className="max-w-2xl">
                        <label className="mb-1 block text-sm font-medium text-gray-700">Notas (opcional)</label>
                        <textarea
                            rows={3}
                            className={inputBase}
                            placeholder="Detalles adicionales relevantes…"
                            {...register('notes', {
                                setValueAs: (v) => (typeof v === 'string' ? v.trim() : v),
                            })}
                        />
                        {errors.notes && (
                            <p className="mt-1 text-xs text-red-600">{String(errors.notes.message)}</p>
                        )}
                    </div>
                </div>

                {/* Right: summary */}
                <aside className="lg:col-span-1">
                    <div className="sticky top-6 rounded-2xl border border-gray-200 bg-gray-50 p-4">
                        <h3 className="mb-3 text-sm font-semibold text-gray-800">Resumen</h3>

                        <dl className="space-y-2 text-sm">
                            <div className="flex justify-between">
                                <dt className="text-gray-600">Ítems</dt>
                                <dd className="font-medium">{items?.length || 0}</dd>
                            </div>

                            {type === 'vale' ? (
                                <>
                                    <div className="flex justify-between">
                                        <dt className="text-gray-600">Subtotal (Bs)</dt>
                                        <dd className="font-medium tabular-nums">
                                            {computed.subtotal.toFixed(2)}
                                        </dd>
                                    </div>
                                    <div className="mt-3 border-t border-gray-200 pt-3">
                                        <div className="flex items-baseline justify-between">
                                            <dt className="text-gray-700">Total (USD)</dt>
                                            <dd className="text-sm font-medium text-gray-500">
                                                Se calculará al guardar
                                            </dd>
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <div className="mt-3 border-t border-gray-200 pt-3">
                                    <div className="flex items-baseline justify-between">
                                        <dt className="text-gray-700">Total</dt>
                                        <dd className="text-lg font-semibold tabular-nums">
                                            ${computed.subtotal.toFixed(2)}
                                        </dd>
                                    </div>
                                </div>
                            )}
                        </dl>

                        {/* Hidden totalAmount (UI-only) */}
                        <input type="hidden" {...register('totalAmount', { valueAsNumber: true })} />

                        {/* Actions */}
                        <div className="mt-4 flex flex-col gap-2">
                            <button
                                type="submit"
                                className="inline-flex items-center justify-center rounded-xl bg-indigo-600 px-5 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
                                disabled={!canSubmit || isSubmitting || loading}
                            >
                                {loading || isSubmitting ? 'Creando…' : 'Crear deuda'}
                            </button>

                            {onCancel && (
                                <button
                                    type="button"
                                    onClick={onCancel}
                                    className="inline-flex items-center justify-center rounded-xl bg-white px-5 py-2 text-sm font-semibold text-gray-700 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                                >
                                    Cancelar
                                </button>
                            )}

                            {error && (
                                <p className="text-xs text-red-600">{String(error)}</p>
                            )}

                            {!isValid && (
                                <p className="text-xs text-amber-700">
                                    Revisa los campos marcados para continuar.
                                </p>
                            )}
                            {computed.subtotal <= 0 && (items?.length ?? 0) > 0 && (
                                <p className="text-xs text-amber-700">
                                    El total debe ser mayor a 0.
                                </p>
                            )}
                        </div>
                    </div>
                </aside>
            </div>
        </form>
    );
};
