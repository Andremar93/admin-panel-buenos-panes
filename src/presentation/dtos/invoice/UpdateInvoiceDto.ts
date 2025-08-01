// src/presentation/dtos/InvoiceDto.ts

import { z } from 'zod';

export const UpdateInvoiceDTO = z.object({
  _id: z.string(),
  dueDate: z.string().or(z.date()),
  supplier: z.string().min(1, 'Proveedor requerido'),
  type: z.string().min(1, 'Tipo requerido'),
  amount: z.number(),
  currency: z.enum(['$', 'Bs']),
  numeroFactura: z.string(),
  date: z.string().or(z.date()),
});

export type UpdateInvoiceDTOType = z.infer<typeof UpdateInvoiceDTO>;
