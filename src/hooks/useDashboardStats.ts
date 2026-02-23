import { useMemo } from 'react';

export type CurrencyView = 'USD' | 'Bs';

export type Income = {
    rate?: number;
    efectivoDolares: number;
    efectivoBs: number;
    sitef: number;
    pagomovil: number;
    biopago: number;
    puntoExterno: number;
    gastosBs: number;
    gastosDolares: number;
    totalSistema: number;
};

export type Expense = {
    type: string;
    date: string;
    amountDollars?: number;
    amountBs?: number;
};

export type Invoice = {
    paid: boolean;
    amountDollars: number;
};

type DonutItem = { label: string; value: number; color: string; percentage: number };

type Range = { from?: string; to?: string };

const safeRate = (rate?: number) => (rate && rate !== 0 ? rate : 100);

// Safer day key to avoid timezone issues (works if exp.date is ISO or YYYY-MM-DD)
const dayKey = (dateStr: string) => (dateStr || '').split('T')[0];

function sumIncomes(incomes: Income[]) {
    return incomes.reduce(
        (acc, inv) => {
            const rate = safeRate(inv.rate);

            acc.efectivoDolares += inv.efectivoDolares;
            acc.efectivoBs += inv.efectivoBs;
            acc.sitef += inv.sitef;
            acc.pagomovil += inv.pagomovil;
            acc.biopago += inv.biopago;
            acc.puntoExterno += inv.puntoExterno;
            acc.gastosBs += inv.gastosBs;
            acc.gastosDolares += inv.gastosDolares;
            acc.totalSistema += inv.totalSistema;

            acc.efectivoBsUSD += inv.efectivoBs / rate;
            acc.sitefUSD += inv.sitef / rate;
            acc.pagomovilUSD += inv.pagomovil / rate;
            acc.biopagoUSD += inv.biopago / rate;
            acc.puntoExternoUSD += inv.puntoExterno / rate;
            acc.gastosBsUSD += inv.gastosBs / rate;

            return acc;
        },
        {
            efectivoDolares: 0,
            efectivoBs: 0,
            sitef: 0,
            pagomovil: 0,
            biopago: 0,
            puntoExterno: 0,
            gastosBs: 0,
            gastosDolares: 0,
            totalSistema: 0,

            efectivoBsUSD: 0,
            sitefUSD: 0,
            pagomovilUSD: 0,
            biopagoUSD: 0,
            puntoExternoUSD: 0,
            gastosBsUSD: 0,
        }
    );
}

function pickIncomeSnapshot(incomes: Income[], index: number) {
    const inv = incomes[index];
    if (!inv) {
        return {
            efectivoDolares: 0,
            efectivoBs: 0,
            sitef: 0,
            pagomovil: 0,
            biopago: 0,
            puntoExterno: 0,
            gastosBs: 0,
            gastosDolares: 0,
            totalSistema: 0,
            efectivoBsUSD: 0,
            sitefUSD: 0,
            pagomovilUSD: 0,
            biopagoUSD: 0,
            puntoExternoUSD: 0,
            gastosBsUSD: 0,
        };
    }

    const rate = safeRate(inv.rate);

    return {
        efectivoDolares: inv.efectivoDolares,
        efectivoBs: inv.efectivoBs,
        sitef: inv.sitef,
        pagomovil: inv.pagomovil,
        biopago: inv.biopago,
        puntoExterno: inv.puntoExterno,
        gastosBs: inv.gastosBs,
        gastosDolares: inv.gastosDolares,
        totalSistema: inv.totalSistema,

        efectivoBsUSD: inv.efectivoBs / rate,
        sitefUSD: inv.sitef / rate,
        pagomovilUSD: inv.pagomovil / rate,
        biopagoUSD: inv.biopago / rate,
        puntoExternoUSD: inv.puntoExterno / rate,
        gastosBsUSD: inv.gastosBs / rate,
    };
}

function groupExpensesByType(expenses: Expense[]) {
    const map = expenses.reduce((acc, exp) => {
        const key = exp.type || 'Otros';
        if (!acc[key]) acc[key] = { totalDollars: 0, totalBs: 0 };
        acc[key].totalDollars += exp.amountDollars || 0;
        acc[key].totalBs += exp.amountBs || 0;
        return acc;
    }, {} as Record<string, { totalDollars: number; totalBs: number }>);

    return Object.entries(map)
        .map(([type, totals]) => ({ type, ...totals }))
        .sort((a, b) => b.totalDollars - a.totalDollars);
}

function toDonutData(rows: { label: string; value: number; color: string }[]): DonutItem[] {
    const total = rows.reduce((sum, r) => sum + r.value, 0);
    return rows
        .slice()
        .sort((a, b) => b.value - a.value)
        .map(r => ({
            ...r,
            percentage: total > 0 ? (r.value / total) * 100 : 0,
        }));
}

export function useDashboardStats(args: {
    incomes: Income[];
    expenses: Expense[];
    invoices: Invoice[];
    currencyView: CurrencyView;
    filterRangeIncome: Range;
    startDate: string;
    finishDate: string;
    expenseColorMap: Record<string, string>;
}) {
    const {
        incomes,
        expenses,
        invoices,
        currencyView,
        filterRangeIncome,
        startDate,
        finishDate,
        expenseColorMap,
    } = args;

    const incomeTotals = useMemo(() => sumIncomes(incomes), [incomes]);
    const incomeToday = useMemo(() => pickIncomeSnapshot(incomes, 0), [incomes]);
    const incomeYesterday = useMemo(() => pickIncomeSnapshot(incomes, 1), [incomes]);

    const expenseByType = useMemo(() => groupExpensesByType(expenses), [expenses]);

    const totalIngresosUSD = useMemo(
        () =>
            incomeTotals.efectivoDolares +
            incomeTotals.efectivoBsUSD +
            incomeTotals.sitefUSD +
            incomeTotals.pagomovilUSD +
            incomeTotals.biopagoUSD +
            incomeTotals.puntoExternoUSD,
        [incomeTotals]
    );

    const totalIngresosBs = useMemo(
        () =>
            incomeTotals.efectivoBs +
            incomeTotals.sitef +
            incomeTotals.pagomovil +
            incomeTotals.biopago +
            incomeTotals.puntoExterno,
        [incomeTotals]
    );

    const totalGastosUSD = useMemo(
        () => expenses.reduce((acc, e) => acc + (e.amountDollars || 0), 0),
        [expenses]
    );

    const totalGastosBs = useMemo(
        () => expenses.reduce((acc, e) => acc + (e.amountBs || 0), 0),
        [expenses]
    );

    const todayKey = useMemo(() => dayKey(new Date().toISOString()), []);
    const yesterdayKey = useMemo(() => {
        const d = new Date();
        d.setDate(d.getDate() - 1);
        return dayKey(d.toISOString());
    }, []);

    const expensesToday = useMemo(
        () => expenses.filter(e => dayKey(e.date) === todayKey),
        [expenses, todayKey]
    );

    const expensesYesterday = useMemo(
        () => expenses.filter(e => dayKey(e.date) === yesterdayKey),
        [expenses, yesterdayKey]
    );

    // NOTE: Keep as Bs (matches your original behavior). Switch to amountDollars if needed.
    const totalGastosTodayBs = useMemo(
        () => expensesToday.reduce((acc, e) => acc + (e.amountBs || 0), 0),
        [expensesToday]
    );

    const gastosChartData = useMemo(() => {
        const rows = expenseByType.map(item => ({
            label: item.type,
            value: currencyView === 'USD' ? item.totalDollars : item.totalBs,
            color: expenseColorMap[item.type] || '#9ca3af',
        }));
        return toDonutData(rows);
    }, [expenseByType, currencyView, expenseColorMap]);

    const ingresosChartData = useMemo(() => {
        const rows =
            currencyView === 'USD'
                ? [
                    { label: 'Efectivo', value: incomeTotals.efectivoDolares, color: '#10b981' },
                    { label: 'Sitef', value: incomeTotals.sitefUSD, color: '#3b82f6' },
                    { label: 'Pago Móvil', value: incomeTotals.pagomovilUSD, color: '#d946ef' },
                    { label: 'Biopago', value: incomeTotals.biopagoUSD, color: '#f59e0b' },
                    { label: 'Punto Externo', value: incomeTotals.puntoExternoUSD, color: '#ef4444' },
                ]
                : [
                    { label: 'Efectivo Bs', value: incomeTotals.efectivoBs, color: '#3b82f6' },
                    { label: 'Sitef', value: incomeTotals.sitef, color: '#d946ef' },
                    { label: 'Pago Móvil', value: incomeTotals.pagomovil, color: '#f59e0b' },
                    { label: 'Biopago', value: incomeTotals.biopago, color: '#ef4444' },
                    { label: 'Punto Externo', value: incomeTotals.puntoExterno, color: '#6b7280' },
                ];

        return toDonutData(rows);
    }, [incomeTotals, currencyView, incomeTotals.efectivoDolares, incomeTotals.sitefUSD, incomeTotals.pagomovilUSD]);

    const totalPendienteDolares = useMemo(
        () => invoices.filter(inv => !inv.paid).reduce((acc, inv) => acc + inv.amountDollars, 0),
        [invoices]
    );

    const totalProveedoresUSD = useMemo(
        () => expenseByType.find(i => i.type === 'Proveedor')?.totalDollars || 0,
        [expenseByType]
    );

    const totalFacturasBar = totalProveedoresUSD + totalPendienteDolares;
    const pagadoPercent = totalFacturasBar ? (totalProveedoresUSD / totalFacturasBar) * 100 : 0;
    const porPagarPercent = totalFacturasBar ? (totalPendienteDolares / totalFacturasBar) * 100 : 0;

    const promedioDiarioIngresos = useMemo(() => {
        if (!totalIngresosUSD) return 0;

        const from = filterRangeIncome.from?.split('T')[0] || startDate;
        const to = filterRangeIncome.to?.split('T')[0] || finishDate;

        if (from && to) {
            const fromDate = new Date(from);
            const toDate = new Date(to);
            const diffDays = Math.ceil((toDate.getTime() - fromDate.getTime()) / 86400000) + 1;
            return diffDays > 0 ? totalIngresosUSD / diffDays : 0;
        }

        return incomes.length ? totalIngresosUSD / incomes.length : 0;
    }, [totalIngresosUSD, filterRangeIncome, startDate, finishDate, incomes.length]);

    return {
        incomeTotals,
        incomeToday,
        incomeYesterday,

        expenseByType,

        totalIngresosUSD,
        totalIngresosBs,

        totalGastosUSD,
        totalGastosBs,

        expensesToday,
        expensesYesterday,
        totalGastosTodayBs,

        gastosChartData,
        ingresosChartData,

        totalPendienteDolares,
        totalProveedoresUSD,
        pagadoPercent,
        porPagarPercent,

        promedioDiarioIngresos,
    };
}