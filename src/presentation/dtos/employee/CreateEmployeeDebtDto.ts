// src/presentation/dtos/employee/CreateEmployeeDebtDto.ts
import { z } from 'zod';

export const DebtItemForm = z.object({
  concept: z.string().trim().min(1, 'Concepto requerido'),
  unitAmount: z.coerce.number().min(0, 'Debe ser ≥ 0'),
  quantity: z.coerce.number().int().min(1, 'Debe ser un entero ≥ 1'),
});

export const CreateEmployeeDebtFormDTO = z.object({
  employeeId: z.string().min(1, 'Empleado requerido'),

  type: z.enum(['standard', 'vale']).default('standard'),

  // Single date sent for both types (UI: <input type="date"> → "YYYY-MM-DD")
  paymentDate: z
    .string()
    .min(1, 'Fecha requerida')
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Formato inválido (YYYY-MM-DD)'),

  description: z.string().trim().optional().default(''),
  notes: z.string().trim().optional().default(''),

  // UI-only; backend recalcula total
  totalAmount: z.coerce.number().optional().default(0),

  // Embedded items
  items: z.array(DebtItemForm).min(1, 'Agrega al menos un ítem'),
});

export type CreateEmployeeDebtFormDTOType = z.infer<typeof CreateEmployeeDebtFormDTO>;

// Payload sent to the API (no snapshot; just the date)
export type CreateEmployeeDebtDTOType = {
  employeeId: string;
  type: 'standard' | 'vale';
  paymentDate: string; // ISO YYYY-MM-DD
  description?: string;
  notes?: string;
  items: Array<{ concept: string; unitAmount: number; quantity: number }>;
  createdBy: string;
};
