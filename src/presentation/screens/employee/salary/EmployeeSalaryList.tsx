import React, { useMemo, useState } from 'react';
import { Employee } from '@/domain/model/Employee';
import { FormattedAmount } from '../../components/FormattedAmount';
import { useExpense } from '@/hooks/useExpense';
import { format } from 'date-fns';

type SalaryData = {
  name: string;
  amountUSD: number;
  amountBs: number;
  usdDiscounts: number;
  bsDiscounts: number;
  netUSD: number;
  netBs?: number;
  extraDescription?: string | undefined;
  usdBonus?: number | undefined;
};

type Props = {
  employees: Employee[];
  salaries?: ReadonlyArray<SalaryData>;
  loading: boolean;
  error?: string | null;
};

export const EmployeeSalaryList: React.FC<Props> = ({
  employees,
  salaries = [],
  loading,
  error,
}) => {
  const { createExpense } = useExpense();
  const [submitting, setSubmitting] = useState(false);

  const totals = useMemo(
    () =>
      salaries.reduce(
        (acc, s) => {
          acc.amountUSD += s.amountUSD || 0;
          acc.amountBs += s.amountBs || 0;
          acc.usdDiscounts += s.usdDiscounts || 0;
          acc.bsDiscounts += s.bsDiscounts || 0;
          acc.netUSD += s.netUSD || 0;
          acc.netBs += s.netBs ?? s.amountBs ?? 0;
          return acc;
        },
        {
          amountUSD: 0,
          amountBs: 0,
          usdDiscounts: 0,
          bsDiscounts: 0,
          netUSD: 0,
          netBs: 0,
        }
      ),
    [salaries]
  );

  const handleCreateExpense = async () => {
    if (!salaries.length || totals.netUSD <= 0) return;
    const ok = window.confirm('¿Crear el gasto de nómina con los totales calculados?');
    if (!ok) return;

    try {
      setSubmitting(true);
      const now = new Date();
      const formatted = format(now, 'dd-MMM-yy').replace('.', '');
      const description = `Sueldos Pagados - ${formatted}`;

      await createExpense({
        description,
        amount: totals.netUSD,
        currency: '$',
        date: now,
        type: 'Nómina',
        paid: true,
        paymentMethod: 'cuentaBs',
      });

      alert('Gasto creado correctamente.');
    } catch (e) {
      console.error(e);
      alert('Hubo un problema creando el gasto.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="mb-3 h-6 w-40 animate-pulse rounded bg-gray-100" />
        <div className="h-40 w-full animate-pulse rounded bg-gray-100" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-red-700">
        {error}
      </div>
    );
  }

  return (
    <div className="card">
      <div className="card-header">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Empleados con salarios</h2>
            <p className="text-sm text-gray-500">
              {salaries.length
                ? `${salaries.length} registro(s) de salario`
                : 'Agrega salarios para ver el detalle'}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="rounded-lg border border-gray-200 px-3 py-2">
              <p className="text-xs text-gray-500">Total Neto USD</p>
              <p className="text-base font-semibold text-gray-900">
                <FormattedAmount amount={totals.netUSD} currency="USD" />
              </p>
            </div>
            <div className="rounded-lg border border-gray-200 px-3 py-2">
              <p className="text-xs text-gray-500">Total Neto Bs</p>
              <p className="text-base font-semibold text-gray-900">
                <FormattedAmount amount={totals.netBs} currency="Bs" prefix="Bs " />
              </p>
            </div>

            <button
              onClick={handleCreateExpense}
              disabled={!salaries.length || totals.netUSD <= 0 || submitting}
              className="inline-flex items-center gap-2 rounded-xl bg-green-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                  Creando…
                </>
              ) : (
                <>
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Crear Gasto de Nómina
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="table">
          <thead className="table-header">
            <tr>
              <th className="table-header-cell">Empleado</th>
              <th className="table-header-cell">Salario USD</th>
              <th className="table-header-cell">Desc. USD</th>
              <th className="table-header-cell">Desc. Bs</th>
              <th className="table-header-cell">Neto USD</th>
              <th className="table-header-cell">Salario Bs</th>
            </tr>
          </thead>
          <tbody className="table-body">
            {salaries.length === 0 ? (
              <tr>
                <td colSpan={6} className="table-cell text-center py-12">
                  <div className="flex flex-col items-center">
                    <svg className="h-12 w-12 text-gray-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    <p className="text-sm text-gray-500 mb-2">No hay salarios registrados</p>
                    <p className="text-xs text-gray-400">Agrega empleados para ver el detalle</p>
                  </div>
                </td>
              </tr>
            ) : (
              salaries.map((s, i) => (
                <tr key={`${s.name}-${i}`} className="table-row">
                  <td className="table-cell font-medium">{s.name}</td>
                  <td className="table-cell">
                    <FormattedAmount bold={false} amount={s.amountUSD} currency="USD" />
                  </td>
                  <td className="table-cell">
                    <FormattedAmount bold={false} amount={s.usdDiscounts} currency="USD" />
                  </td>
                  <td className="table-cell">
                    <FormattedAmount
                      bold={false}
                      amount={s.bsDiscounts}
                      currency="Bs"
                      prefix="Bs "
                    />
                  </td>
                  <td className="table-cell font-semibold">
                    <FormattedAmount bold={false} amount={s.netUSD} currency="USD" />
                  </td>
                  <td className="table-cell">
                    <FormattedAmount
                      amount={s.amountBs}
                      currency="Bs"
                      prefix="Bs "
                    />
                  </td>
                </tr>
              ))
            )}
          </tbody>
          <tfoot>
            <tr className="bg-gray-50 font-semibold text-gray-900 [&>td]:px-4 [&>td]:py-3">
              <td>Totales</td>
              <td>
                <FormattedAmount amount={totals.amountUSD} currency="USD" />
              </td>
              <td>
                <FormattedAmount amount={totals.usdDiscounts} currency="USD" />
              </td>
              <td>
                <FormattedAmount amount={totals.bsDiscounts} currency="Bs" prefix="Bs " />
              </td>
              <td>
                <FormattedAmount amount={totals.netUSD} currency="USD" />
              </td>
              <td>
                <FormattedAmount amount={totals.netBs} currency="Bs" prefix="Bs " />
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
};
