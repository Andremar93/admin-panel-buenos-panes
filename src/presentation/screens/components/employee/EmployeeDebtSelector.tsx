import React, { useEffect, useMemo, useState } from 'react';

/** ==== Tipos base (ajústalos si ya los tienes tipados globalmente) ==== */
export type DebtStatus = 'pending' | 'paid' | 'overdue' | 'cancelled';

export interface EmployeeDebtItem {
    concept: string;
    unitAmount: number; // USD si type=standard, Bs si type=vale
    quantity: number;
}

export interface EmployeeDebt {
    _id: string;
    description?: string;
    type: 'standard' | 'vale';
    status: DebtStatus;
    totalAmount: number; // en USD (el back ya convierte si es vale)
    createdAt: string;
    paymentDate?: string;
    items?: EmployeeDebtItem[];
    // Si tu back añade exchangeRateSnapshot, úsalo para convertir vales por ítem:
    // exchangeRateSnapshot?: { rate?: number; date?: string; source?: string };
    [k: string]: any; // para tolerar props extras
}

export interface Employee {
    _id: string;
    name: string;
    weeklySalary?: number;
    debts?: EmployeeDebt[];
}

/** ==== Props del selector ==== */
type Props = {
    employee: Employee;
    baseSalaryUSD: number; // normalmente employee.weeklySalary
    disableWhenNetNegative?: boolean; // default: true => evita neto negativo
    onChange?: (data: {
        totalUSD: number;
        netSalaryUSD: number;
        byDebt: Record<string, number>; // total USD por deuda seleccionada
        selectedItemKeys: string[]; // ids únicos de ítems seleccionados
    }) => void;
};

/** Util: ID único por ítem (por índice) */
const itemKey = (debtId: string, idx: number) => `${debtId}::${idx}`;

/** Redondeo 2 decimales */
const round2 = (n: number) => Number.isFinite(n) ? Number(n.toFixed(2)) : 0;

/** ==== Componente ==== */
const EmployeeDebtsSelector: React.FC<Props> = ({
    employee,
    baseSalaryUSD,
    disableWhenNetNegative = true,
    onChange,
}) => {
    const debts = employee.debts ?? [];

    // Estado local: ítems seleccionados (por key único)
    const [selected, setSelected] = useState<Set<string>>(new Set());

    // Normalizamos filas por deuda/ítem con montos y conversión USD si aplica
    const rows = useMemo(() => {
        const out: Array<{
            debtId: string;
            debtType: 'standard' | 'vale';
            debtStatus: DebtStatus;
            debtDescription?: string;
            exchangeRate?: number; // si disponible
            createdAt?: string;
            itemIndex: number;
            concept: string;
            qty: number;
            unit: number; // USD si standard, Bs si vale
            usd?: number; // calculado por ítem (si podemos)
            bs?: number;  // para vale
            key: string;
        }> = [];

        for (const d of debts) {
            const items = d.items ?? [];
            const rate = d.exchangeRateSnapshot?.rate as number | undefined; // si existe

            items.forEach((it, idx) => {
                const key = itemKey(d._id, idx);
                if (d.type === 'standard') {
                    const usd = it.unitAmount * it.quantity;
                    out.push({
                        debtId: d._id,
                        debtType: d.type,
                        debtStatus: d.status,
                        debtDescription: d.description,
                        exchangeRate: undefined,
                        createdAt: d.createdAt,
                        itemIndex: idx,
                        concept: it.concept,
                        qty: it.quantity,
                        unit: it.unitAmount,
                        usd: usd,
                        key,
                    });
                } else {
                    // vale: montos en Bs. Si hay tasa, convertimos por ítem.
                    const bs = it.unitAmount * it.quantity;
                    const usd = rate && rate > 0 ? bs / rate : undefined;
                    out.push({
                        debtId: d._id,
                        debtType: d.type,
                        debtStatus: d.status,
                        debtDescription: d.description,
                        exchangeRate: rate,
                        createdAt: d.createdAt,
                        itemIndex: idx,
                        concept: it.concept,
                        qty: it.quantity,
                        unit: it.unitAmount,
                        bs,
                        usd,
                        key,
                    });
                }
            });
        }
        return out;
    }, [debts]);

    // Totales por selección
    const summary = useMemo(() => {
        let totalUSD = 0;
        const byDebtUSD: Record<string, number> = {};

        for (const r of rows) {
            if (!selected.has(r.key)) continue;

            // Solo sumamos al total si sabemos el USD del ítem.
            if (typeof r.usd === 'number' && isFinite(r.usd)) {
                totalUSD += r.usd;
                byDebtUSD[r.debtId] = (byDebtUSD[r.debtId] ?? 0) + r.usd;
            } else if (r.debtType === 'vale' && typeof r.bs === 'number') {
                // Si NO hay tasa por ítem (vale sin rate), no sumamos aquí.
                // Podrías optar por prohibir selección del ítem en el UI.
            }
        }

        const netSalaryUSD = round2(baseSalaryUSD - totalUSD);
        return {
            totalUSD: round2(totalUSD),
            netSalaryUSD,
            byDebtUSD: Object.fromEntries(
                Object.entries(byDebtUSD).map(([k, v]) => [k, round2(v)])
            ),
        };
    }, [rows, selected, baseSalaryUSD]);

    // Notificar a quien use el componente
    useEffect(() => {
        onChange?.({
            totalUSD: summary.totalUSD,
            netSalaryUSD: summary.netSalaryUSD,
            byDebt: summary.byDebtUSD,
            selectedItemKeys: Array.from(selected),
        });
    }, [summary, selected, onChange]);

    // Helpers de UI
    const toggleItem = (key: string, enabled: boolean) => {
        setSelected((prev) => {
            const next = new Set(prev);
            if (enabled) next.add(key);
            else next.delete(key);
            return next;
        });
    };

    const selectAllOfDebt = (debtId: string, enable: boolean) => {
        const keys = rows.filter(r => r.debtId === debtId).map(r => r.key);
        setSelected((prev) => {
            const next = new Set(prev);
            for (const k of keys) enable ? next.add(k) : next.delete(k);
            return next;
        });
    };

    const allSelectedForDebt = (debtId: string) => {
        const keys = rows.filter(r => r.debtId === debtId).map(r => r.key);
        return keys.length > 0 && keys.every(k => selected.has(k));
    };

    const someSelectedForDebt = (debtId: string) => {
        const keys = rows.filter(r => r.debtId === debtId).map(r => r.key);
        return keys.some(k => selected.has(k)) && !allSelectedForDebt(debtId);
    };

    // No permitir neto negativo (opcional)
    const disabledByNet = disableWhenNetNegative && summary.netSalaryUSD < 0;

    return (
        <div className="rounded-2xl border border-gray-200 bg-white">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-gray-200 p-4">
                <div>
                    <h3 className="text-base font-semibold text-gray-900">Deudas de {employee.name}</h3>
                    <p className="text-xs text-gray-500">Selecciona ítems para descontar del salario.</p>
                </div>
                <div className="flex items-center gap-2 text-sm">
                    <span className="rounded-full bg-slate-100 px-2.5 py-1">Salario: ${round2(baseSalaryUSD)}</span>
                    <span className="rounded-full bg-indigo-50 px-2.5 py-1 text-indigo-700">Descuento: ${summary.totalUSD}</span>
                    <span className={`rounded-full px-2.5 py-1 ${summary.netSalaryUSD >= 0 ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'}`}>
                        Neto: ${summary.netSalaryUSD}
                    </span>
                </div>
            </div>

            {/* Contenido por deuda */}
            <div className="divide-y divide-gray-200">
                {debts.length === 0 && (
                    <div className="p-4 text-sm text-gray-500">Sin deudas registradas.</div>
                )}

                {debts.map((d) => {
                    const debtRows = rows.filter(r => r.debtId === d._id);
                    const allSel = allSelectedForDebt(d._id);
                    const someSel = someSelectedForDebt(d._id);

                    const canSelectDebt =
                        d.status === 'pending' &&
                        (d.type === 'standard' || (d.type === 'vale' && (d as any).exchangeRateSnapshot?.rate));

                    const debtUSDFromSelection = debtRows
                        .filter(r => selected.has(r.key) && typeof r.usd === 'number')
                        .reduce((sum, r) => sum + (r.usd || 0), 0);

                    return (
                        <section key={d._id} className="p-4">
                            <div className="mb-2 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    {/* Checkbox seleccionar toda la deuda */}
                                    <input
                                        type="checkbox"
                                        className="h-4 w-4 rounded border-gray-300"
                                        checked={allSel}
                                        onChange={(e) => selectAllOfDebt(d._id, e.target.checked)}
                                        ref={(el) => {
                                            if (el) el.indeterminate = someSel;
                                        }}
                                        disabled={!canSelectDebt || disabledByNet}
                                        title={!canSelectDebt ? 'No se puede seleccionar esta deuda (status o falta de tasa)' : undefined}
                                    />
                                    <div className="space-y-0.5">
                                        <div className="flex items-center gap-2">
                                            <span className="font-medium text-gray-900">
                                                {d.description || '(Sin descripción)'}
                                            </span>
                                            <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs">
                                                {d.type === 'vale' ? 'Vale (Bs→USD)' : 'Standard (USD)'}
                                            </span>
                                            <span className={`rounded-full px-2 py-0.5 text-xs ${d.status === 'pending' ? 'bg-amber-50 text-amber-700'
                                                    : d.status === 'paid' ? 'bg-emerald-50 text-emerald-700'
                                                        : d.status === 'overdue' ? 'bg-red-50 text-red-700'
                                                            : 'bg-slate-100 text-slate-700'
                                                }`}>
                                                {d.status}
                                            </span>
                                        </div>
                                        <div className="text-xs text-gray-500">
                                            Creada: {new Date(d.createdAt).toLocaleDateString()} · Total USD de la deuda: ${round2(d.totalAmount)}
                                        </div>
                                    </div>
                                </div>

                                <div className="text-sm">
                                    <span className="text-gray-600">Seleccionado USD:</span>{' '}
                                    <span className="font-semibold tabular-nums">${round2(debtUSDFromSelection)}</span>
                                </div>
                            </div>

                            {/* Tabla de items */}
                            <div className="overflow-hidden rounded-xl border border-gray-200">
                                <div className="grid grid-cols-12 bg-gray-50 px-3 py-2 text-xs font-medium text-gray-600">
                                    <div className="col-span-6">Concepto</div>
                                    <div className="col-span-2 text-right">{d.type === 'vale' ? 'Precio (Bs)' : 'Precio (USD)'}</div>
                                    <div className="col-span-1 text-right">Cant.</div>
                                    <div className="col-span-2 text-right">{d.type === 'vale' ? 'Subtotal (Bs)' : 'Subtotal (USD)'}</div>
                                    <div className="col-span-1 text-center">Sel.</div>
                                </div>

                                {debtRows.length === 0 ? (
                                    <div className="p-3 text-sm text-gray-500">Sin ítems</div>
                                ) : (
                                    <ul className="divide-y divide-gray-200">
                                        {debtRows.map((r) => {
                                            const checked = selected.has(r.key);
                                            const canSelectItem =
                                                d.status === 'pending' &&
                                                (r.debtType === 'standard' || (typeof r.usd === 'number' && isFinite(r.usd)));

                                            return (
                                                <li key={r.key} className="grid grid-cols-12 items-center gap-3 px-3 py-2 text-sm">
                                                    <div className="col-span-6 truncate" title={r.concept}>
                                                        {r.concept}
                                                    </div>
                                                    <div className="col-span-2 text-right tabular-nums">
                                                        {r.debtType === 'vale' ? `${round2(r.unit)} Bs` : `$${round2(r.unit)}`}
                                                    </div>
                                                    <div className="col-span-1 text-right tabular-nums">{r.qty}</div>
                                                    <div className="col-span-2 text-right tabular-nums">
                                                        {r.debtType === 'vale'
                                                            ? `${round2(r.bs ?? 0)} Bs`
                                                            : `$${round2(r.usd ?? 0)}`}
                                                        {r.debtType === 'vale' && typeof r.usd === 'number' && (
                                                            <span className="ml-2 text-xs text-gray-500">(${round2(r.usd)} USD)</span>
                                                        )}
                                                    </div>
                                                    <div className="col-span-1 flex justify-center">
                                                        <input
                                                            type="checkbox"
                                                            className="h-4 w-4 rounded border-gray-300"
                                                            checked={checked}
                                                            onChange={(e) => toggleItem(r.key, e.target.checked)}
                                                            disabled={!canSelectItem || disabledByNet}
                                                            title={
                                                                !canSelectItem
                                                                    ? (d.status !== 'pending'
                                                                        ? 'Deuda no pendiente'
                                                                        : 'Sin tasa → no se puede convertir a USD por ítem')
                                                                    : undefined
                                                            }
                                                        />
                                                    </div>
                                                </li>
                                            );
                                        })}
                                    </ul>
                                )}
                            </div>

                            {/* Nota para vales sin tasa */}
                            {d.type === 'vale' && !(d as any).exchangeRateSnapshot?.rate && (
                                <p className="mt-2 text-xs text-amber-700">
                                    Esta deuda es un vale pero no trae tasa por ítem. Puedes marcar toda la deuda con el checkbox superior
                                    (se liquidará por el total en USD), o ajustar el back para incluir <code>exchangeRateSnapshot.rate</code>.
                                </p>
                            )}
                        </section>
                    );
                })}
            </div>

            {/* Footer resumen */}
            <div className="flex items-center justify-between border-t border-gray-200 p-4 text-sm">
                <div className="text-gray-600">
                    Seleccionados: <strong className="tabular-nums">${summary.totalUSD}</strong> · Neto:{' '}
                    <strong className={`tabular-nums ${summary.netSalaryUSD >= 0 ? 'text-emerald-700' : 'text-red-700'}`}>
                        ${summary.netSalaryUSD}
                    </strong>
                </div>
                {disabledByNet && (
                    <span className="rounded-lg bg-red-50 px-2 py-1 text-xs text-red-700">
                        El neto no puede ser negativo
                    </span>
                )}
            </div>
        </div>
    );
};

export default EmployeeDebtsSelector;
