import { z } from 'zod';

// DTO: Crear un ítem de deuda (simple)
export const CreateDebtItemDTO = z.object({
  description: z.string().min(1).max(200),
  unitPrice: z.number().nonnegative(),
  quantity: z.number().int().positive().default(1),
});

export type CreateDebtItemDTOType = z.infer<typeof CreateDebtItemDTO>;
