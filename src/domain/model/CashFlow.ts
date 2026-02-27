export interface CashFlowDay {
    date: string;
    ingresos: number;
    gastos: number;
    net: number;
    accumulated: number;
  }
  
  export interface MonthlyCashFlow {
    balanceFinal: number;
    currency: 'USD' | 'Bs';
    days: CashFlowDay[];
  }