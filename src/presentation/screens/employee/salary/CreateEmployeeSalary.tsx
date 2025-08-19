import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useForm, useFieldArray, Controller, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  CreateEmployeesSalaryDTO,
  CreateEmployeesSalaryDTOType,
} from '@/presentation/dtos/employee/CreateEmployeesSalaryDto';
import { Employee } from '@/domain/model/Employee';
import { useMarkDebtItemsPaid } from '@/hooks/useMarkDebtItemsPaid';

type DebtStatus = 'pending' | 'paid' | 'overdue' | 'cancelled';

type DebtItem = {
  concept: string;
  quantity: number;
  isPaid?: boolean;
  unitAmount: number; // USD si standard, Bs si vale
};

type EmployeeDebt = {
  _id: string;
  type: 'standard' | 'vale';
  description?: string;
  status: DebtStatus;
  totalAmount: number; // USD (el back ya convierte para vale)
  createdAt?: string;
  items?: DebtItem[];
  exchangeRateSnapshot?: { rate?: number; date?: string; source?: string };
};

type EmployeeWithDebts = Employee & {
  debts?: EmployeeDebt[];
};

type Props = {
  onCreated: (data: CreateEmployeesSalaryDTOType & { debtItemsToMark?: Array<{ debtId: string; itemIndexes: number[] }> }) => void;
  employees: EmployeeWithDebts[];
  exchangeRate: string; // string -> se parsea a number
};

const inputBase =
  'w-full rounded-xl border border-gray-300 px-3 py-2.5 text-sm text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-60 disabled:bg-gray-50 disabled:cursor-not-allowed transition-colors duration-200';

const pill = 'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium';
  const round2 = (n: number) => (Number.isFinite(n) ? Math.round((n + Number.EPSILON) * 100) / 100 : 0);

// key único por ítem dentro de una deuda
const itemKey = (debtId: string, idx: number) => `${debtId}::${idx}`;



// =================== COMPONENTE ===================
export const CreateEmployeeSalary: React.FC<Props> = ({
  onCreated,
  employees,
  exchangeRate,
}) => {
  const { markMultipleItemsPaid, loading: markingItemsLoading } = useMarkDebtItemsPaid();
  const {
    register,
    control,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors, isSubmitting, isValid },
  } = useForm<any>({
    resolver: zodResolver(CreateEmployeesSalaryDTO),
    mode: 'onChange',
    defaultValues: {
      date: new Date().toISOString().split('T')[0], // YYYY-MM-DD
      salaries: [
        {
          name: '',
          amountUSD: 0,
          amountBs: 0,
          bsDiscounts: 0,
          usdDiscounts: 0,
          netUSD: 0,
          extraDescription: '',
          usdBonus: 0,
        },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({ control, name: 'salaries' });
  const salaries = useWatch({ control, name: 'salaries' }) ?? [];

  const [expandedRows, setExpandedRows] = useState<Set<number>>(new Set([0]));
  const [openDebtsRows, setOpenDebtsRows] = useState<Set<number>>(new Set()); // panel de deudas abierto por fila

  // Selecciones por fila:
  // - itemKeys: Set de keys "debtId::idx"
  // - debtIds: Set de deudas completas (se usa para vale sin tasa)
  // - totalUSD: suma en USD de la selección
  const [debtSelections, setDebtSelections] = useState<
    Record<number, { itemKeys: Set<string>; debtIds: Set<string>; totalUSD: number }>
  >({});

  const rate = useMemo(() => {
    const r = parseFloat(exchangeRate);
    return Number.isFinite(r) && r > 0 ? r : null;
  }, [exchangeRate]);

  // Función helper para recalcular una fila con descuentos de deudas
  const recalcRowWithDebts = useCallback((rowIdx: number, debtDiscountUSD: number) => {
    setTimeout(() => {
      const row = getValues(`salaries.${rowIdx}`);
      if (!row) return;

      const amountUSD = Number(row.amountUSD) || 0;
      const usdDiscountsManual = Number(row.usdDiscounts) || 0;
      const bsDiscountsManual = Number(row.bsDiscounts) || 0;
      const usdBonus = Number(row.usdBonus) || 0;

      const bsDiscountsUSD = rate ? bsDiscountsManual / rate : 0;
      const grossUSD = amountUSD + usdBonus - usdDiscountsManual - bsDiscountsUSD - debtDiscountUSD;
      const netUSD = Math.max(0, round2(grossUSD));
      const amountBs = rate ? round2(netUSD * rate) : 0;

      setValue(`salaries.${rowIdx}.netUSD`, netUSD, { shouldDirty: true, shouldValidate: false });
      setValue(`salaries.${rowIdx}.amountBs`, amountBs, { shouldDirty: true, shouldValidate: false });
    }, 0);
  }, [getValues, setValue, rate]);

  const recalcRow = useCallback(
    (idx: number) => {
      const row = getValues(`salaries.${idx}`);
      if (!row) return;

      const amountUSD = Number(row.amountUSD) || 0;
      const usdDiscountsManual = Number(row.usdDiscounts) || 0;
      const bsDiscountsManual = Number(row.bsDiscounts) || 0;
      const usdBonus = Number(row.usdBonus) || 0;

      const selectedUSD = debtSelections[idx]?.totalUSD ?? 0;

      const bsDiscountsUSD = rate ? bsDiscountsManual / rate : 0;
      const grossUSD = amountUSD + usdBonus - usdDiscountsManual - bsDiscountsUSD - selectedUSD;
      const netUSD = Math.max(0, round2(grossUSD));
      const amountBs = rate ? round2(netUSD * rate) : 0;

      setValue(`salaries.${idx}.netUSD`, netUSD, { shouldDirty: true, shouldValidate: false });
      setValue(`salaries.${idx}.amountBs`, amountBs, { shouldDirty: true, shouldValidate: false });
    },
    [getValues, setValue, rate, debtSelections]
  );

  // Recalcular todo si cambia la tasa o las selecciones de deudas
  useEffect(() => {
    fields.forEach((_, i) => recalcRow(i));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rate, fields.length, debtSelections]);

  // Recalcular cuando cambien las selecciones de deudas
  useEffect(() => {
    fields.forEach((_, i) => recalcRow(i));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debtSelections]);

  const toggleRow = (i: number) =>
    setExpandedRows((prev) => {
      const next = new Set(prev);
      next.has(i) ? next.delete(i) : next.add(i);
      return next;
    });

  const toggleDebtsPanel = (i: number) =>
    setOpenDebtsRows((prev) => {
      const next = new Set(prev);
      next.has(i) ? next.delete(i) : next.add(i);
      return next;
    });

  const onSubmit = async (data: CreateEmployeesSalaryDTOType) => {
    // Preparar la información de deudas seleccionadas para marcarlas como pagadas después
    const debtItemsToMark = new Map<string, number[]>();

    Object.entries(debtSelections).forEach(([rowIndexStr, selection]) => {
      const rowIndex = parseInt(rowIndexStr);
      const employeeName = data.salaries[rowIndex]?.name;

      if (!employeeName || (!selection.itemKeys.size && !selection.debtIds.size)) {
        return;
      }

      const employee = employees.find(e => e.name === employeeName);
      if (!employee?.debts) return;

      // Procesar items seleccionados por deuda
      selection.itemKeys.forEach(itemKey => {
        const [debtId, itemIndexStr] = itemKey.split('::');
        if (!debtId || !itemIndexStr) return;
        const itemIndex = parseInt(itemIndexStr);
        const debtIdStr = debtId;

        if (!debtItemsToMark.has(debtIdStr)) {
          debtItemsToMark.set(debtIdStr, []);
        }
        debtItemsToMark.get(debtIdStr)!.push(itemIndex);
      });

      // Para deudas completas seleccionadas, marcar todos los items
      selection.debtIds.forEach(debtId => {
        if (debtId) {
          const debt = employee.debts!.find(d => d._id === debtId);
          if (debt?.items) {
            const allItemIndexes = debt.items.map((_, index) => index);
            const debtIdStr = debtId;
            if (!debtItemsToMark.has(debtIdStr)) {
              debtItemsToMark.set(debtIdStr, []);
            }
            debtItemsToMark.get(debtIdStr)!.push(...allItemIndexes);
          }
        }
      });
    });

    try {
      // Marcar todos los items de deudas como pagados
      const debtItemsToMarkArray = Array.from(debtItemsToMark.entries()).map(([debtId, itemIndexes]) => ({
        debtId,
        itemIndexes
      }));

      // Marcar items como pagados usando la función optimizada
      if (debtItemsToMarkArray.length > 0) {
        await markMultipleItemsPaid(debtItemsToMarkArray);
      }

      // Llamar al callback con la información de deudas para marcarlas después
      onCreated({
        ...data,
        debtItemsToMark: debtItemsToMarkArray
      });
    } catch (error) {
      console.error('Error al marcar items como pagados:', error);
      // Aún así llamar al callback para que se cree el expense
      onCreated({
        ...data,
        debtItemsToMark: Array.from(debtItemsToMark.entries()).map(([debtId, itemIndexes]) => ({
          debtId,
          itemIndexes
        }))
      });
    }
  };

  const selectedNames = useMemo(
    () => new Set((salaries ?? []).map((s: any) => s?.name || '')),
    [salaries]
  );

  // ---------- Helpers de deudas ----------

  // Añade esto arriba junto a otros helpers
  function computeRowTotalUSD(
    selection: { itemKeys: Set<string>; debtIds: Set<string> },
    debts: EmployeeDebt[]
  ) {
    let totalUSD = 0;

    // 1) Deudas completas
    for (const d of debts) {
      const isInSelection = selection.debtIds.has(d._id);
      const isPending = d.status === 'pending';
      
     
      
      if (isInSelection && isPending) {
        const debtAmount = Number(d.totalAmount || 0);
        totalUSD += debtAmount;
      }
    }

    // 2) Ítems por deuda
    for (const d of debts) {
      const items = d.items ?? [];
      const rate = d.exchangeRateSnapshot?.rate;
      if (d.status !== 'pending') continue;

      items.forEach((it, idx) => {
        const key = `${d._id}::${idx}`;
        if (!selection.itemKeys.has(key)) return;

        if (d.type === 'standard') {
          totalUSD += (Number(it.unitAmount) || 0) * (Number(it.quantity) || 0);
        } else if (typeof rate === 'number' && rate > 0) {
          const bs = (Number(it.unitAmount) || 0) * (Number(it.quantity) || 0);
          totalUSD += bs / rate;
        }
        // si vale SIN tasa, nunca habilitamos el ítem (UI lo deshabilita)
      });
    }
    return round2(totalUSD);
  }


  const onToggleItem = (rowIdx: number, debt: EmployeeDebt, idx: number, enabled: boolean) => {
    const name = getValues(`salaries.${rowIdx}.name`);
    const emp = employees.find((e) => e.name === name);
    const debts = (emp as any)?.debts ?? [];

    setDebtSelections((prev) => {
      const current = prev[rowIdx] || { itemKeys: new Set<string>(), debtIds: new Set<string>(), totalUSD: 0 };
      const nextSel = {
        itemKeys: new Set(current.itemKeys),
        debtIds: new Set(current.debtIds),
        totalUSD: 0,
      };

      const key = `${debt._id}::${idx}`;
      if (enabled) nextSel.itemKeys.add(key);
      else nextSel.itemKeys.delete(key);

      // asegurarnos de no mezclar “deuda completa” + ítems de la misma deuda
      nextSel.debtIds.delete(debt._id);

      const totalUSD = computeRowTotalUSD(nextSel, debts);
      const next = { ...prev, [rowIdx]: { ...nextSel, totalUSD } };

      // Recalcular neto usando el valor calculado directamente
      recalcRowWithDebts(rowIdx, totalUSD);

      return next;
    });
  };

  const onToggleDebtFull = (rowIdx: number, debt: EmployeeDebt, enabled: boolean) => {
    const name = getValues(`salaries.${rowIdx}.name`);
    const emp = employees.find((e) => e.name === name);
    const debts = (emp as any)?.debts ?? [];


    setDebtSelections((prev) => {
      const current = prev[rowIdx] || { itemKeys: new Set<string>(), debtIds: new Set<string>(), totalUSD: 0 };
      
      const nextSel = {
        itemKeys: new Set(current.itemKeys),
        debtIds: new Set(current.debtIds),
        totalUSD: 0,
      };

      if (enabled) {
        nextSel.debtIds.add(debt._id);
        // desmarcar ítems de esa deuda si estuvieran tildados
        const items = debt.items ?? [];
        items.forEach((_, i) => nextSel.itemKeys.delete(`${debt._id}::${i}`));
      } else {
        nextSel.debtIds.delete(debt._id);
      }


      const totalUSD = computeRowTotalUSD(nextSel, debts);
      const next = { ...prev, [rowIdx]: { ...nextSel, totalUSD } };

      // Recalcular neto usando el valor calculado directamente
      recalcRowWithDebts(rowIdx, totalUSD);

      return next;
    });
  };


  // limpiar selección si cambia el empleado de una fila
  const clearSelectionForRow = (rowIdx: number) => {
    setDebtSelections((prev) => {
      const next = { ...prev };
      delete next[rowIdx];
      return next;
    });
    
    // Recalcular neto sin descuentos de deudas
    recalcRowWithDebts(rowIdx, 0);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
    >
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-900">Crear salarios</h2>
        <p className="text-sm text-gray-500">
          Completa la fecha y agrega a los empleados a pagar esta semana.
        </p>

        {!rate && (
          <div className="mt-3 rounded-lg border border-yellow-200 bg-yellow-50 p-3 text-sm text-yellow-800">
            No hay una tasa válida. Calcularemos Bs cuando haya una tasa &gt; 0.
          </div>
        )}

        {markingItemsLoading && (
          <div className="mt-3 rounded-lg border border-blue-200 bg-blue-50 p-3 text-sm text-blue-800">
            <div className="flex items-center gap-2">
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-blue-600 border-t-transparent"></div>
              Marcando items de deuda como pagados...
            </div>
          </div>
        )}
      </div>

      {/* Fecha */}
      <div className="mb-6 max-w-xs">
        <label className="mb-1 block text-sm font-medium text-gray-700">Fecha de pago</label>
        <input type="date" {...register('date')} className={inputBase} />
        {errors.date && (
          <div className="mt-2 rounded-lg border border-red-200 bg-red-50 p-2">
            <p className="text-xs text-red-700">{String(errors.date.message)}</p>
          </div>
        )}
      </div>

      {/* Lista de filas */}
      <div className="space-y-4">
        {fields.map((field, index) => {
          const currentName = salaries?.[index]?.name ?? '';
          const emp = employees.find((x) => x.name === currentName);
          const empDebts: EmployeeDebt[] = (emp as any)?.debts ?? [];

          const debtSelectionUSD = debtSelections[index]?.totalUSD ?? 0;

          return (
            <div key={field.id} className="rounded-xl border border-gray-200">
              {/* Header fila */}
              <div className="flex items-center justify-between gap-3 border-b border-gray-100 p-4 bg-gray-50">
                <div className="flex items-center gap-3">
                  <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-sm font-semibold text-blue-700">
                    {index + 1}
                  </span>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-gray-900">
                      {currentName || <span className="text-gray-400">Sin empleado</span>}
                    </span>
                    {debtSelectionUSD > 0 && (
                      <span className="text-xs text-blue-600">
                        Descuento por deudas: ${round2(debtSelectionUSD)} USD
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => toggleDebtsPanel(index)}
                    className="inline-flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-xs font-medium text-gray-700 hover:bg-gray-100 transition-colors"
                    disabled={!emp}
                    title={!emp ? 'Selecciona un empleado' : undefined}
                  >
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    {openDebtsRows.has(index) ? 'Ocultar deudas' : 'Ver deudas'}
                  </button>
                  <button
                    type="button"
                    onClick={() => toggleRow(index)}
                    className="inline-flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-xs font-medium text-gray-700 hover:bg-gray-100 transition-colors"
                  >
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={expandedRows.has(index) ? "M5 15l7-7 7 7" : "M19 9l-7 7-7-7"} />
                    </svg>
                    {expandedRows.has(index) ? 'Minimizar' : 'Expandir'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      remove(index);
                      // limpiar selección de la fila
                      clearSelectionForRow(index);
                    }}
                    className="inline-flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs font-medium text-red-700 hover:bg-red-100 transition-colors"
                  >
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    Quitar
                  </button>
                </div>
              </div>

              {/* Panel de deudas */}
              {openDebtsRows.has(index) && (
                <div className="space-y-4 border-b border-gray-100 p-4 bg-gray-50">
                  <div className="flex items-center gap-2 mb-4">
                    <svg className="h-5 w-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    <h4 className="text-sm font-semibold text-gray-800">Deudas del empleado</h4>
                  </div>

                  {(!emp || empDebts.length === 0) ? (
                    <div className="rounded-lg border border-gray-200 bg-gray-50 p-6 text-center">
                      <svg className="mx-auto h-12 w-12 text-gray-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <p className="text-sm text-gray-600">
                        {emp ? 'No hay deudas registradas para este empleado.' : 'Selecciona un empleado para ver sus deudas.'}
                      </p>
                    </div>
                  ) : (
                    <div className="divide-y divide-gray-200">
                      {empDebts.map((d) => {
                        const items = d.items ?? [];
                        const canPickPerItem =
                          d.status === 'pending' &&
                          (d.type === 'standard' || (d.type === 'vale' && d.exchangeRateSnapshot?.rate));

                        const isDebtSelected = debtSelections[index]?.debtIds?.has(d._id) ?? false;

                        // USD seleccionado por ítems de esta deuda o deuda completa
                        const selection = debtSelections[index];
                        const usdByItems = (() => {
                          if (!selection) return 0;
                          
                          // Si la deuda completa está seleccionada, usar el total de la deuda
                          if (selection.debtIds.has(d._id)) {
                            return round2(d.totalAmount || 0);
                          }
                          
                          // Si no, calcular por items individuales
                          let sum = 0;
                          items.forEach((it, idx) => {
                            const key = itemKey(d._id, idx);
                            if (!selection.itemKeys.has(key)) return;
                            if (d.status !== 'pending') return;

                            if (d.type === 'standard') {
                              sum += (Number(it.unitAmount) || 0) * (Number(it.quantity) || 0);
                            } else if (d.exchangeRateSnapshot?.rate) {
                              const bs = (Number(it.unitAmount) || 0) * (Number(it.quantity) || 0);
                              sum += bs / d.exchangeRateSnapshot.rate;
                            }
                          });
                          return round2(sum);
                        })();

                        return (
                          <section key={d._id} className="py-3">
                            <div className="mb-2 flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <span className="font-medium text-gray-900">
                                  {d.description || '(Sin descripción)'}
                                </span>
                                <span className={`${pill} bg-slate-100 text-slate-700`}>
                                  {d.type === 'vale' ? 'Vale' : 'Standard'}
                                </span>
                                <span
                                  className={`${pill} ${d.status === 'pending'
                                    ? 'bg-amber-50 text-amber-700'
                                    : d.status === 'paid'
                                      ? 'bg-emerald-50 text-emerald-700'
                                      : d.status === 'overdue'
                                        ? 'bg-red-50 text-red-700'
                                        : 'bg-gray-100 text-gray-700'
                                    }`}
                                >
                                  {d.status}
                                </span>
                                <span className={`${pill} bg-indigo-50 text-indigo-700`}>
                                  Total USD: ${round2(d.totalAmount)}
                                </span>
                                {d.type === 'vale' && (
                                  <span className={`${pill} bg-gray-100 text-gray-700`}>
                                    {d.exchangeRateSnapshot?.rate
                                      ? `Tasa: ${d.exchangeRateSnapshot.rate}`
                                      : 'Sin tasa (por ítem no disponible)'}
                                  </span>
                                )}
                              </div>

                              {/* Selección de deuda completa (útil para vale sin tasa) */}
                              <label className="flex items-center gap-2 text-xs text-gray-700">
                                <input
                                  type="checkbox"
                                  className="h-4 w-4 rounded border-gray-300"
                                  checked={isDebtSelected}
                                  onChange={(e) => onToggleDebtFull(index, d, e.target.checked)}
                                  disabled={d.status !== 'pending'}
                                  title={d.status !== 'pending' ? 'Deuda no pendiente' : undefined}
                                />
                                Seleccionar deuda completa
                              </label>
                            </div>

                            <div className="overflow-hidden rounded-xl border border-gray-200">
                              <div className="grid grid-cols-12 bg-gray-50 px-3 py-2 text-xs font-medium text-gray-600">
                                <div className="col-span-6">Concepto</div>
                                <div className="col-span-2 text-right">
                                  {d.type === 'vale' ? 'Precio (Bs)' : 'Precio (USD)'}
                                </div>
                                <div className="col-span-1 text-right">Cant.</div>
                                <div className="col-span-2 text-right">
                                  {d.type === 'vale' ? 'Subtotal (Bs)' : 'Subtotal (USD)'}
                                </div>
                                <div className="col-span-1 text-center">Sel.</div>
                              </div>

                              {items.length === 0 ? (
                                <div className="p-3 text-sm text-gray-500">Sin ítems</div>
                              ) : (
                                <ul className="divide-y divide-gray-200">
                                  {items.map((it, idx) => {
                                    const key = itemKey(d._id, idx);
                                    const checked = debtSelections[index]?.itemKeys?.has(key) ?? false;
                                    console.log('it', it);
                                    const canSelect =
                                      canPickPerItem && !isDebtSelected && !it.isPaid; // si está marcada la deuda completa, deshabilitar ítems

                                    const sub = (Number(it.unitAmount) || 0) * (Number(it.quantity) || 0);
                                    const subUSD =
                                      d.type === 'standard'
                                        ? sub
                                        : d.exchangeRateSnapshot?.rate
                                          ? sub / d.exchangeRateSnapshot.rate
                                          : undefined;

                                    return (
                                      <li key={key} className="grid grid-cols-12 items-center gap-3 px-3 py-2 text-sm">
                                        <div className="col-span-6 truncate" title={it.concept}>
                                          {it.concept}
                                        </div>
                                        <div className="col-span-2 text-right tabular-nums">
                                          {d.type === 'vale' ? `${round2(it.unitAmount)} Bs` : `$${round2(it.unitAmount)}`}
                                        </div>
                                        <div className="col-span-1 text-right tabular-nums">{it.quantity}</div>
                                        <div className="col-span-2 text-right tabular-nums">
                                          {d.type === 'vale' ? (
                                            <>
                                              {round2(sub)} Bs
                                              {typeof subUSD === 'number' && (
                                                <span className="ml-2 text-xs text-gray-500">(${round2(subUSD)} USD)</span>
                                              )}
                                            </>
                                          ) : (
                                            `$${round2(sub)}`
                                          )}
                                        </div>
                                        <div className="col-span-1 flex justify-center">
                                          <input
                                            type="checkbox"
                                            className="h-4 w-4 rounded border-gray-300"
                                            checked={checked}
                                            onChange={(e) => onToggleItem(index, d, idx, e.target.checked)}
                                            disabled={!canSelect}
                                            title={
                                              !canSelect
                                                ? isDebtSelected
                                                  ? 'Deuda completa seleccionada'
                                                  : d.status !== 'pending'
                                                    ? 'Deuda no pendiente'
                                                    : 'Sin tasa (por ítem no disponible)'
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

                            {/* Totales por deuda (selección actual) */}
                            <div className="mt-2 text-xs text-gray-700">
                              Selección por esta deuda:{' '}
                              <span className="font-semibold tabular-nums">${usdByItems}</span>
                              {isDebtSelected && (
                                <span className="ml-2 text-gray-600">
                                  (deuda completa: ${round2(d.totalAmount)})
                                </span>
                              )}
                            </div>
                          </section>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              {/* Body fila principal */}
              {expandedRows.has(index) && (
                <div className="space-y-6 p-6">
                  {/* Select empleado y Salario semanal */}
                  <div className="space-y-4">
                    <h4 className="text-sm font-semibold text-gray-800 border-b border-gray-100 pb-2">Información del Empleado</h4>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label className="mb-1 block text-sm font-medium text-gray-700">
                        Empleado
                      </label>

                      <Controller
                        control={control}
                        name={`salaries.${index}.name`}
                        render={({ field: fld }) => (
                          <select
                            {...fld}
                            className={inputBase}
                            onChange={(e) => {
                              const name = e.target.value;
                              fld.onChange(name);

                              // Reset selección de deudas al cambiar empleado
                              clearSelectionForRow(index);

                              // Setear salario semanal
                              const empSel = employees.find((x) => x.name === name);
                              if (empSel) {
                                setValue(`salaries.${index}.amountUSD`, (empSel.weeklySalary as any) ?? 0, {
                                  shouldDirty: true,
                                });
                                recalcRow(index);

                                // 👉 abrir deudas si el empleado tiene
                                if ((empSel as any)?.debts?.length) {
                                  setOpenDebtsRows((prev) => new Set([...prev, index]));
                                }
                              }
                            }}
                          >
                            <option value="">Selecciona un empleado</option>
                            {employees.map((emp) => {
                              const already = selectedNames.has(emp.name);
                              const isSelf = emp.name === (salaries?.[index]?.name ?? '');
                              const disabled = already && !isSelf;
                              return (
                                <option key={emp.name} value={emp.name} disabled={disabled}>
                                  {emp.name}{disabled ? ' (seleccionado)' : ''}
                                </option>
                              );
                            })}
                          </select>
                        )}
                      />
                    </div>

                    <div>
                      <label className="mb-1 block text-sm font-medium text-gray-700">
                        Salario semanal (USD)
                      </label>
                      <input
                        type="number"
                        inputMode="decimal"
                        step="0.01"
                        {...register(`salaries.${index}.amountUSD`, {
                          setValueAs: (v) => (typeof v === 'string' ? Number(v.replace(',', '.')) : v),
                          onChange: () => recalcRow(index),
                        })}
                        className={inputBase}
                        readOnly
                      />
                    </div>
                  </div>
                </div>

                  {/* Descuentos */}
                  <div className="space-y-4">
                    <h4 className="text-sm font-semibold text-gray-800 border-b border-gray-100 pb-2">Descuentos y Adiciones</h4>
                    
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                      <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700">
                          Adición USD (bonus)
                        </label>
                        <input
                          type="number"
                          inputMode="decimal"
                          step="0.01"
                          className={inputBase}
                          {...register(`salaries.${index}.usdBonus`, {
                            setValueAs: (v) => (typeof v === 'string' ? Number(v.replace(',', '.')) : v),
                            onChange: () => recalcRow(index),
                          })}
                          placeholder="0.00"
                        />
                      </div>
                      <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700">
                          Descuento USD (manual)
                        </label>
                        <input
                          type="number"
                          inputMode="decimal"
                          step="0.01"
                          className={inputBase}
                          {...register(`salaries.${index}.usdDiscounts`, {
                            setValueAs: (v) => (typeof v === 'string' ? Number(v.replace(',', '.')) : v),
                            onChange: () => recalcRow(index),
                          })}
                        />
                      </div>
                      <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700">
                          Descuento Bs (manual)
                        </label>
                        <input
                          type="number"
                          inputMode="decimal"
                          step="0.01"
                          className={inputBase}
                          {...register(`salaries.${index}.bsDiscounts`, {
                            setValueAs: (v) => (typeof v === 'string' ? Number(v.replace(',', '.')) : v),
                            onChange: () => recalcRow(index),
                          })}
                        />
                        {!rate && (
                          <p className="mt-1 text-xs text-gray-500">Se convertirá a USD cuando haya una tasa válida.</p>
                        )}
                      </div>
                      <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700">
                          Descuento por deudas (USD)
                        </label>
                        <input
                          type="number"
                          className={inputBase}
                          value={debtSelectionUSD}
                          onChange={() => recalcRow(index)}
                          readOnly
                        />
                      </div>
                    </div>
                  </div>

                  {/* Valores Calculados */}
                  <div className="space-y-4">
                    <h4 className="text-sm font-semibold text-gray-800 border-b border-gray-100 pb-2">Valores Calculados</h4>
                    
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700">
                          Salario en Bs
                        </label>
                        <input
                          type="number"
                          className={inputBase}
                          {...register(`salaries.${index}.amountBs`)}
                          readOnly
                          disabled={!rate}
                        />
                      </div>
                      <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700">
                          Salario neto USD
                        </label>
                        <input
                          type="number"
                          className={inputBase}
                          {...register(`salaries.${index}.netUSD`)}
                          readOnly
                        />
                      </div>
                    </div>
                  </div>

                  {/* Descripción */}
                  <div className="space-y-4">
                    <h4 className="text-sm font-semibold text-gray-800 border-b border-gray-100 pb-2">Información Adicional</h4>
                    
                    <div>
                      <label className="mb-1 block text-sm font-medium text-gray-700">
                        Descripción adicional
                      </label>
                      <input
                        type="text"
                        className={inputBase}
                        {...register(`salaries.${index}.extraDescription`)}
                        placeholder="Opcional"
                      />
                    </div>
                    
                    {debtSelectionUSD > 0 && (
                      <div className="rounded-lg bg-blue-50 border border-blue-200 p-3">
                        <p className="text-sm text-blue-800">
                          <span className="font-medium">Nota:</span> Este neto incluye ${round2(debtSelectionUSD)} de descuento por deudas seleccionadas.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Acciones */}
      <div className="mt-6 flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={() => {
            append({
              name: '',
              amountUSD: 0,
              amountBs: 0,
              bsDiscounts: 0,
              usdDiscounts: 0,
              netUSD: 0,
              extraDescription: '',
              usdBonus: 0,
            });
            // expandir la nueva fila y abrir panel de deudas por conveniencia
            setTimeout(() => {
              setExpandedRows((prev) => new Set([...prev, fields.length]));
              setOpenDebtsRows((prev) => new Set([...prev, fields.length]));
            }, 0);
          }}
          className="inline-flex items-center gap-2 rounded-xl border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Agregar otro salario
        </button>

        <button
          type="submit"
          disabled={isSubmitting || markingItemsLoading || !isValid}
          className="inline-flex items-center gap-2 rounded-xl bg-green-600 px-5 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting || markingItemsLoading ? (
            <>
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
              Procesando…
            </>
          ) : (
            <>
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Crear Tabla de Salarios
            </>
          )}
        </button>
      </div>

      {/* Errores de nivel formulario */}
      {errors?.salaries?.message && (
        <div className="mt-4 rounded-lg border border-red-200 bg-red-50 p-3">
          <div className="flex items-center gap-2">
            <svg className="h-5 w-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-sm font-medium text-red-800">Error en el formulario</p>
          </div>
          <p className="mt-1 text-sm text-red-700">{String(errors.salaries.message)}</p>
        </div>
      )}
    </form>
  );
};
