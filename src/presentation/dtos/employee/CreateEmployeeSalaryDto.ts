// CreateExpenseDTO.ts

import { z } from 'zod';

// Validación con Zod (muy usado para validar DTOs)
export const CreateEmployeeSalaryDTO = z.object({
    amountBs: z.number().nonnegative(),
    amountUSD: z.number().nonnegative(),
    name: z.string().min(1, 'El empleado es requerido'),
    bsDiscounts: z.number().nonnegative(),
    usdDiscounts: z.number().nonnegative(),
    extraDescription: z.string().optional(),
    netUSD: z.number().nonnegative()
});

// Tipo TypeScript inferido desde el esquema zod
export type CreateEmployeeSalaryDTOType = z.infer<typeof CreateEmployeeSalaryDTO>;
