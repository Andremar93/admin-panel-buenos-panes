// src/presentation/dtos/InvoiceDto.ts

import { z } from 'zod';

export const InvoiceDTO = z.object({
  supplier: z.string().min(1, 'Proveedor requerido'),
  dueDate: z.string().or(z.date()), // puede ser string (input) o Date (cuando se parsea)
  amountDollars: z.number().min(0, 'Debe ser mayor o igual a 0'),
  amountBs: z.number().min(0, 'Debe ser mayor o igual a 0'),
  currency: z.enum(['$', 'Bs']),
  type: z.string().min(1, 'Tipo requerido'),
  subType: z.string().optional(),
  paymentMethod: z.string().optional(),
  description: z.string().min(1, 'Descripción requerida'),
  date: z.string().or(z.date()),
  paid: z.boolean(),
  googleRow: z.number().int().nonnegative(),
  numeroFactura: z.string().optional(),
});

export type InvoiceDTOType = z.infer<typeof InvoiceDTO>;
