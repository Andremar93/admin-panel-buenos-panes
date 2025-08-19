// UpdateInvoiceDTO.ts

import { z } from 'zod';

export const UpdateInvoiceDTO = z.object({
  _id: z.string(),
  supplier: z.string().min(1, 'Proveedor requerido'),
  type: z.string().min(1, 'Tipo requerido'),
  amount: z.number(),
  currency: z.enum(['$', 'Bs']),
  numeroFactura: z.string().optional(),
  date: z.string().or(z.date()),
  dueDate: z.string().or(z.date()),
  paymentMethod: z.string().optional(),
  description: z.string().optional(),
  paid: z.boolean().optional(),
  googleRow: z.number().optional(),
});

export type UpdateInvoiceDTOType = z.infer<typeof UpdateInvoiceDTO>;
