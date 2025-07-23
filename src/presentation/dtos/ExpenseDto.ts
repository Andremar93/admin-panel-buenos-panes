import { unknown, z } from 'zod';

export const ExpenseDTO = z.object({
  amountDollars: z.number().nonnegative(),
  amountBs: z.number().nonnegative(),
  currency: z.enum(['$', 'Bs']),
  type: z.string().min(1, 'El tipo de gasto es requerido'),
  subType: z.string().optional(),
  paymentMethod: z.string().optional(),
  description: z.string().min(1, 'La descripción es requerida'),
  date: z.coerce.date(),
  paid: z.boolean(),
  invoiceId: z.string().optional(), // Si usás ObjectId en backend, podés validar el formato también
  googleRow: z.number().int().nonnegative()
});

// Para usar con inferencia de tipos
export type ExpenseDTOType = z.infer<typeof ExpenseDTO>;
