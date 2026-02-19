// CreateIncomeDTO.ts

import { z } from 'zod';

/** Expense item sent with create income (backend creates these with the income) */
export const IncomeExpenseItemDTO = z.object({
  description: z.string().min(1),
  amount: z.number().nonnegative(),
  currency: z.enum(['$', 'Bs']),
  type: z.string().min(1),
  subType: z.string().optional(),
  paymentMethod: z.string().min(1),
  paid: z.boolean(),
  date: z.string().or(z.date()).optional(),
  /** Employee name when type is "Nómina" */
  employeeName: z.string().optional(),
  /** Employee id when type is "Nómina" */
  employeeId: z.string().optional(),
});
export type IncomeExpenseItemType = z.infer<typeof IncomeExpenseItemDTO>;

// Validación con Zod (muy usado para validar DTOs)
export const CreateIncomeDTO = z.object({
  sitef: z.number(),
  puntoExterno: z.number(),
  efectivoBs: z.number(),
  efectivoDolares: z.number(),
  pagomovil: z.number(),
  biopago: z.number(),
  /** Calculated from expenses array by backend - not sent */
  gastosBs: z.number().optional(),
  /** Calculated from expenses array by backend - not sent */
  gastosDolares: z.number().optional(),
  totalSistema: z.number(),
  notas: z.string().optional(),
  date: z.string().or(z.date()),
  /** Expenses to create with this income (sent in same request) */
  expenses: z.array(IncomeExpenseItemDTO).optional(),
});

// Tipo TypeScript inferido desde el esquema zod
export type CreateIncomeDTOType = z.infer<typeof CreateIncomeDTO>;
