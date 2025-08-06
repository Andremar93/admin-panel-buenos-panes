import { Employee } from '@/domain/model/Employee';
import { useState } from 'react';
import { FormattedAmount } from '../components/FormattedAmount';
interface Props {
    employees: Employee[];
    loading: boolean;
    error: string | null;
}

export const EmployeeList: React.FC<Props> = ({ employees, loading, error }) => {


    if (loading) return <p className="text-gray-500">Cargando empleados...</p>;
    if (error) return <p className="text-red-600 font-medium">Error: {error}</p>;
    if (employees.length === 0) return <p className="text-gray-400">No hay empleados registrados.</p>;

    return (

        <div style={{ flex: 1, paddingLeft: 20 }}>

            <h2 className="text-xl font-bold text-gray-800 mb-4">Empleados:</h2>
            <ul className="space-y-4">
                {employees.map((employee) => (
                    <li key={employee._id} className="bg-white p-4 rounded-lg shadow flex flex-col space-y-2 text-sm">
                        {/* Descripción + Fecha */}
                        <div className="flex justify-between items-start">
                            <div className="text-base font-semibold text-primary">{employee.name}</div>
                        </div>

                        {/* Etiquetas: tipo y método de pago */}
                        <div className="flex flex-wrap gap-2">
                            <span className="px-2 py-0.5 bg-yellow-100 text-yellow-800 text-xs rounded-full border border-yellow-300">
                                <FormattedAmount amount={employee.weeklySalary} currency="USD" />
                            </span>
                        </div>


                        {/* Botón editar */}
                        {/* <button
                            onClick={() => {
                                // Scroll al tope de la página
                                window.scrollTo({ top: 0, behavior: 'smooth' });

                                // Lógica de edición
                                onEdit(toUpdateExpenseData(expense));
                            }}
                            className="mt-2 text-blue-500 underline self-start"
                        >
                            Editar
                        </button> */}
                    </li>
                ))}
            </ul>
        </div>



    );
};
