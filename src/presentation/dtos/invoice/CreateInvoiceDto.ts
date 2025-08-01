// src/presentation/dtos/InvoiceDto.ts

import { z } from 'zod';

export const CreateInvoiceDTO = z.object({
  dueDate: z.string().or(z.date()),
  supplier: z.string().min(1, 'Proveedor requerido'),
  type: z.string().min(1, 'Tipo requerido'),
  amount: z.number(),
  currency: z.enum(['$', 'Bs']),
  numeroFactura: z.string(),
  date: z.string().or(z.date())
});

export type CreateInvoiceDTOType = z.infer<typeof CreateInvoiceDTO>;
