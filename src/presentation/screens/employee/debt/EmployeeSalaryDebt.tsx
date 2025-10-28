import { useEmployee } from '@/hooks/useEmployee';
import { useEffect, useMemo, useState } from 'react';
import { EmployeeSalaryList } from '@/presentation/screens/employee/salary/EmployeeSalaryList';
import { CreateEmployeeDebt } from './CreateEmployeeDebt';
import { useExchangeRate } from '@/hooks/useExchangeRate';

type SalaryRow = {
    name: string;
    amountUSD: number;
    amountBs: number;
    usdDiscounts: number;
    bsDiscounts: number;
    netUSD: number;
    netBs?: number;
    extraDescription?: string;
};

export function EmployeeDebtPage() {
    const { employeesWithUnpaidDebts, loading, error } = useEmployee();
    const { exchangeRate, getExchangeRate } = useExchangeRate();
    const [salaries, setSalaries] = useState<SalaryRow[]>([]);

    const exchangeTitle = useMemo(
        () => (exchangeRate ? `Tasa del día: ${exchangeRate}` : 'Cargando tasa…'),
        [exchangeRate]
    );

    const handleCreated = (data: { salaries: SalaryRow[] }) => {
        setSalaries(data.salaries ?? []);
    };

    useEffect(() => {
        getExchangeRate(new Date().toISOString().split('T')[0]);
    }, [getExchangeRate]);

    return (
        <div className="w-full max-w-[85%] mx-auto p-6">
            <div className="mb-6 flex flex-col gap-2">
                <h1 className="text-2xl font-bold text-gray-900">Nómina</h1>
                <p className="text-sm text-gray-500">{exchangeTitle}</p>
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                <CreateEmployeeDebt
                    onCreated={handleCreated}
                    employees={employeesWithUnpaidDebts}
                />

                <section>
                    <EmployeeSalaryList
                        employees={employeesWithUnpaidDebts}
                        salaries={salaries}
                        loading={loading}
                        error={error}
                    />
                </section>
            </div>
        </div>
    );
}
