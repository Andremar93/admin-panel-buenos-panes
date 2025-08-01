export interface Income {
  _id: string;
  sitef: number;
  puntoExterno: number;
  efectivoBs: number;
  efectivoDolares: number;
  pagomovil: number;
  biopago: number;
  gastosBs: number;
  gastosDolares: number;
  totalSistema: number;
  notas: string;
  date: Date;
  rate: number,
  googleRow: number;
}

export default Income;
