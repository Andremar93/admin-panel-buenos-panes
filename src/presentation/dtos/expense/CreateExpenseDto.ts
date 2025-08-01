// CreateExpenseDTO.ts

import { z } from 'zod';

// Validación con Zod (muy usado para validar DTOs)
export const CreateExpenseDTO = z.object({
  amount: z.number().nonnegative(),
  currency: z.enum(['$', 'Bs']),
  type: z.string().min(1, 'El tipo de gasto es requerido'),
  subType: z.string().optional(),
  paymentMethod: z.string().min(1, 'El metodo de pago es requerido'),
  description: z.string().min(1, 'La descripción es requerida'),
  date: z.string().or(z.date()),
  paid: z.boolean(),
});

// Tipo TypeScript inferido desde el esquema zod
export type CreateExpenseDTOType = z.infer<typeof CreateExpenseDTO>;
