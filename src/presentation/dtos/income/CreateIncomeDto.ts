// CreateIncomeDTO.ts

import { z } from 'zod';

// Validación con Zod (muy usado para validar DTOs)
export const CreateIncomeDTO = z.object({
  sitef: z.number(),
  puntoExterno: z.number(),
  efectivoBs: z.number(),
  efectivoDolares: z.number(),
  pagomovil: z.number(),
  biopago: z.number(),
  gastosBs: z.number(),
  gastosDolares: z.number(),
  totalSistema: z.number(),
  notas: z.string().optional(),
  date: z.string().or(z.date()),
});

// Tipo TypeScript inferido desde el esquema zod
export type CreateIncomeDTOType = z.infer<typeof CreateIncomeDTO>;
