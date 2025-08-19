// src/presentation/dtos/employee-debt/CreateEmployeeDebtWithItemsDto.ts
import { z } from 'zod';

export const objectId = z
    .string()
    .regex(/^[0-9a-fA-F]{24}$/, 'ObjectId inválido');

export const CreateDebtItemDTO = z.object({
    description: z.string().min(1, 'Descripción requerida').max(200),
    unitPrice: z.coerce.number().min(0, 'Precio >= 0'),
    quantity: z.coerce.number().int().min(1, 'Cantidad >= 1').default(1),
});

export const CreateEmployeeDebtWithItemsDTO = z
    .object({
        employeeId: objectId,
        description: z.string().min(1, 'Descripción requerida').max(500),
        notes: z.string().max(1000).optional(),
        dueDate: z.string().optional(), // Fecha de vencimiento opcional
        items: z.array(CreateDebtItemDTO).min(1, 'Debes agregar al menos 1 ítem'),
    })
    .transform((d) => ({
        ...d,
    }));

export type CreateEmployeeDebtWithItemsDTOType = z.infer<
    typeof CreateEmployeeDebtWithItemsDTO
>;
