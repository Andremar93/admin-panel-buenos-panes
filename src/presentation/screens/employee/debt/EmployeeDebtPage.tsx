import { useEmployee} from '@/hooks/useEmployee';
import { useEffect, useMemo, useState } from 'react';
import { useExchangeRate } from '@/hooks/useExchangeRate';
import {CreateEmployeeDebt} from '@/presentation/screens/employee/debt/CreateEmployeeDebt';

type DebtRow = {
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
    const { employees, loading, error } = useEmployee();
    const { exchangeRate, getExchangeRate } = useExchangeRate();
    const [salaries, setSalaries] = useState<DebtRow[]>([]);

    const exchangeTitle = useMemo(
        () => (exchangeRate ? `Tasa del día: ${exchangeRate}` : 'Cargando tasa…'),
        [exchangeRate]
    );

    const handleCreated = (data: { salaries: DebtRow[] }) => {
        console.log('here')
        setSalaries(data.salaries ?? []);
    };

    useEffect(() => {
        getExchangeRate(new Date().toISOString().split('T')[0]);
    }, [getExchangeRate]);

    return (
        <div className="mx-auto max-w-7xl p-6">
            <div className="mb-6 flex flex-col gap-2">
                <h1 className="text-2xl font-bold text-gray-900">Deudas Empleados</h1>
                <p className="text-sm text-gray-500">{exchangeTitle}</p>
            </div>

            {/* <div className="grid grid-cols-1 gap-6 lg:grid-cols-2"> */}
            <div className="flex justify-center">
                <CreateEmployeeDebt
                    employees={employees}
                    currentUserId="67a2123e947559906d96eaa1"
                    onCreated={handleCreated}
                    // exchangeRate={exchangeRate}
                />
            </div>
        </div>
    );
}
