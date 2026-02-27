export interface MonthlyCashFlowDto {
    balanceFinal: number;
    currency: 'USD' | 'Bs';
    days: {
      date: string;
      ingresos: number;
      gastos: number;
      net: number;
      accumulated: number;
    }[];
  }