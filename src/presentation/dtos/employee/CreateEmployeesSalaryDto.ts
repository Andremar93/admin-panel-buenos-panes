import { CreateEmployeeSalaryDTO } from "./CreateEmployeeSalaryDto";
import { z } from 'zod';

// Lista de salarios de empleados
export const CreateEmployeesSalaryDTO = z.object({
    date: z.string().min(1, 'La fecha de pago es requerida'), // O podés usar z.date() si recibís un objeto Date
    salaries: z.array(CreateEmployeeSalaryDTO).min(1, 'Debe haber al menos un salario'),
});

// Tipo TypeScript inferido para la lista
export type CreateEmployeesSalaryDTOType = z.infer<typeof CreateEmployeesSalaryDTO>;
