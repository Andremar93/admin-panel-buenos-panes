import React, { useEffect, useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CreateEmployeesSalaryDTO, CreateEmployeesSalaryDTOType } from '@/presentation/dtos/employee/CreateEmployeesSalaryDto';
import Employee from '@/domain/model/Employee';

interface Props {
    onCreated: (data: CreateEmployeesSalaryDTOType) => void;
    employees: Employee[];
    exchangeRate: string;
}

export const CreateEmployeeSalary: React.FC<Props> = ({ onCreated, employees, exchangeRate }) => {
    const {
        register,
        control,
        handleSubmit,
        watch,
        setValue,
        formState: { errors },
    } = useForm<CreateEmployeesSalaryDTOType>({
        resolver: zodResolver(CreateEmployeesSalaryDTO),
        defaultValues: {
            date: new Date().toISOString().split('T')[0], // formato YYYY-MM-DD
            salaries: [{ name: '', amountUSD: 0, amountBs: 0, bsDiscounts: 0, usdDiscounts: 0, extraDescription: '' }],
        },
    });

    const { fields, append, remove } = useFieldArray({
        control,
        name: 'salaries',
    });

    const [expandedRows, setExpandedRows] = useState<Set<number>>(new Set([0]));

    const salaries = watch('salaries');

    // Auto set weekly salary when employee is selected
    useEffect(() => {
        salaries.forEach((salary, index) => {
            const emp = employees.find(e => e.name === salary.name);
            if (emp) {
                if (salary.amountUSD !== emp.weeklySalary) {
                    setValue(`salaries.${index}.amountUSD`, emp.weeklySalary);
                }
            }
        });
    }, [salaries.map(s => s.name).join(','), employees, setValue]);



    useEffect(() => {
        salaries.forEach((salary, index) => {
            const usd = salary.amountUSD || 0;
            const usdDiscount = salary.usdDiscounts || 0;
            const bsDiscounts = (salary.bsDiscounts / Number(exchangeRate)) || 0;

            const totalDiscounts = usd - (usdDiscount + bsDiscounts);

            // Convertir USD a Bs y redondear a 2 decimales
            const bs = parseFloat((totalDiscounts * Number(exchangeRate)).toFixed(2));
            setValue(`salaries.${index}.amountBs`, bs);

            // Calcular netos en USD redondeado
            const netUSD = parseFloat(totalDiscounts.toFixed(2));
            setValue(`salaries.${index}.netUSD`, netUSD);
        });
    }, [
        JSON.stringify(salaries.map(s => ({
            amountUSD: s.amountUSD,
            usdDiscounts: s.usdDiscounts,
            bsDiscounts: s.bsDiscounts
        }))),
        exchangeRate,
        setValue
    ]);

    const onSubmit = (data: CreateEmployeesSalaryDTOType) => {
        onCreated(data);
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 bg-white p-6 rounded-xl shadow-md">
            <h2 className="text-lg font-bold text-primary">Crear salarios</h2>

            {/* Fecha */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Fecha de pago</label>
                <input type="date" {...register('date')} className="input" />
                {errors.date && <p className="text-red-500 text-sm">{errors.date.message}</p>}
            </div>

            {fields.map((field, index) => (
                <div key={field.id} className="border p-4 rounded-md space-y-2 bg-gray-50">
                    <div className="flex justify-between items-center">
                        <span className="font-medium text-sm text-gray-700">{field.name}</span>
                        <div className="flex gap-2">
                            <button
                                type="button"
                                className="text-sm text-blue-500 underline"
                                onClick={() => {
                                    const newSet = new Set(expandedRows);
                                    if (expandedRows.has(index)) newSet.delete(index);
                                    else newSet.add(index);
                                    setExpandedRows(newSet);
                                }}
                            >
                                {expandedRows.has(index) ? 'Minimizar' : 'Expandir'}
                            </button>
                            <button type="button" onClick={() => remove(index)} className="text-sm text-red-500 underline">
                                Quitar
                            </button>
                        </div>
                    </div>

                    {expandedRows.has(index) && (
                        <div className="space-y-2 mt-2">
                            {/* Select de empleado */}
                            <select {...register(`salaries.${index}.name`)} className="input">
                                <option value="">Selecciona un empleado</option>
                                {employees
                                    .filter(emp => {
                                        const selectedNames = salaries.map(s => s.name);
                                        return (
                                            emp.name === salaries[index]?.name || !selectedNames.includes(emp.name)
                                        );
                                    })
                                    .map(emp => (
                                        <option key={emp.name} value={emp.name}>
                                            {emp.name}
                                        </option>
                                    ))}
                            </select>

                            {/* Weekly salary */}
                            <div>
                                <label>Salario semanal (USD)</label>
                                <input type="number" {...register(`salaries.${index}.amountUSD`)} className="input disabled" readOnly />
                            </div>

                            {/* Discounts */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label>Descuento USD</label>
                                    <input
                                        type="number"
                                        {...register(`salaries.${index}.usdDiscounts`, { valueAsNumber: true })}
                                        className="input"
                                    />
                                </div>
                                <div>
                                    <label>Descuento Bs</label>
                                    <input
                                        type="number"
                                        {...register(`salaries.${index}.bsDiscounts`, { valueAsNumber: true })}
                                        className="input"
                                    />
                                </div>
                            </div>

                            {/* Calculated amounts */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label>Salario en Bs</label>
                                    <input type="number" {...register(`salaries.${index}.amountBs`)} className="input disabled" readOnly />
                                </div>
                                <div>
                                    <label>Salario neto USD</label>
                                    <input type="number" {...register(`salaries.${index}.netUSD`)} className="input disabled" readOnly />
                                </div>
                            </div>

                            {/* Extra description */}
                            <div>
                                <label>Descripción adicional</label>
                                <input type="text" {...register(`salaries.${index}.extraDescription`)} className="input" />
                            </div>
                        </div>
                    )}
                </div>

            ))}

            <button
                type="button"
                onClick={() => {
                    append({ name: '', amountUSD: 0, amountBs: 0, bsDiscounts: 0, usdDiscounts: 0, extraDescription: '' });
                    setTimeout(() => {
                        setExpandedRows(new Set([fields.length])); // expand only the new one
                    }, 0); // espera al render
                }}

                className="bg-blue-500 text-white px-4 py-2 rounded"
            >
                Agregar otro salario
            </button>

            <button type="submit" className="bg-green-600 text-white px-6 py-2 rounded">
                Crear Tabla
            </button>
        </form>
    );
};
