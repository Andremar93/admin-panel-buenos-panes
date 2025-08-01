// UpdateIncomeDTO.ts

import { z } from 'zod';

// Validación con Zod (muy usado para validar DTOs)
export const UpdateIncomeDTO = z.object({
  _id: z.string(),
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
export type UpdateIncomeDTOType = z.infer<typeof UpdateIncomeDTO>;
