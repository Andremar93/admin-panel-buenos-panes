import { useEmployee } from '@/hooks/useEmployee';
import { useEffect, useMemo, useState } from 'react';
import { EmployeeSalaryList } from './EmployeeSalaryList';
import { CreateEmployeeSalary } from './CreateEmployeeSalary';
import { useExchangeRate } from '@/hooks/useExchangeRate';

type SalaryRow = {
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

type DebtItemToMark = {
    debtId: string;
    itemIndexes: number[];
};

export function EmployeeSalaryPage() {
    const { employees, loading, error } = useEmployee();
    const { exchangeRate, getExchangeRate } = useExchangeRate();
    const [salaries, setSalaries] = useState<SalaryRow[]>([]);
    const [debtItemsToMark, setDebtItemsToMark] = useState<DebtItemToMark[]>([]);

    const exchangeTitle = useMemo(
        () => (exchangeRate ? `Tasa del día: ${String(exchangeRate.rate)}` : 'Cargando tasa…'),
        [exchangeRate]
    );

    const handleCreated = (data: any) => {
        setSalaries(data.salaries ?? []);
        setDebtItemsToMark(data.debtItemsToMark ?? []);
    };

    useEffect(() => {
        getExchangeRate(new Date().toISOString().split('T')[0]);
    }, [getExchangeRate]);

    return (
        <div className="mx-auto max-w-7xl p-6 space-y-6">
            <div className="mb-4 flex flex-col gap-1">
                <h1 className="text-2xl font-bold text-gray-900">Nómina</h1>
                <p className="text-sm text-gray-500">{exchangeTitle}</p>
            </div>

            <div className="space-y-4">
                <CreateEmployeeSalary
                    onCreated={handleCreated}
                    employees={employees}
                    exchangeRate={String(exchangeRate?.rate || '')}
                />

                <section>
                    <EmployeeSalaryList
                        employees={employees}
                        salaries={salaries}
                        loading={loading}
                        error={error}
                    />
                </section>
            </div>
        </div>
    );
}
