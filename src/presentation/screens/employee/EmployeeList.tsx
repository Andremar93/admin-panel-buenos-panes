import React from 'react';
import Employee from '@/domain/model/Employee';
import { FormattedAmount } from '../components/FormattedAmount';
import { useExpense } from '@/hooks/useExpense';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface SalaryData {
    name: string;
    amountUSD: number;
    amountBs: number;
    usdDiscounts: number;
    bsDiscounts: number;
    netUSD: number;
    netBs: number;
    extraDescription?: string;
}

interface Props {
    employees: Employee[];
    salaries?: SalaryData[];
    loading: boolean;
    error?: string | null;
}

export const EmployeeList: React.FC<Props> = ({ employees, salaries = [], loading, error }) => {
    if (loading) return <p>Cargando...</p>;
    if (error) return <p className="text-red-500">{error}</p>;

    const { createExpense } = useExpense();


    const totals = salaries.reduce(
        (acc, sal) => {
            acc.amountUSD += sal.amountUSD;
            acc.amountBs += sal.amountBs;
            acc.usdDiscounts += sal.usdDiscounts;
            acc.bsDiscounts += sal.bsDiscounts;
            acc.netUSD += sal.netUSD;
            acc.netBs += sal.netBs ?? sal.amountBs;
            return acc;
        },
        {
            amountUSD: 0,
            amountBs: 0,
            usdDiscounts: 0,
            bsDiscounts: 0,
            netUSD: 0,
            netBs: 0,
        }
    );


    const handleCreateExpense = async () => {
        const date = new Date()
        const formattedDate = format(new Date(), "dd-MMM-yy", { locale: es }).replace('.', '');
        const description = `Sueldos Pagados - ${formattedDate}`;
        await createExpense({
            description,
            amount: totals.netUSD,
            currency: "$",
            date,
            type: "Nómina",
            paid: true,
            paymentMethod: 'cuentaBs'
        });
        alert("Gasto creado correctamente.");
    };


    return (
        <div>
            <h2 className="text-lg font-bold mb-4">Empleados con salarios</h2>
            {salaries.length === 0 ? (
                <p>No hay salarios registrados</p>
            ) : (
                <div>
                    <table className="min-w-full border">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="p-2 border">Empleado</th>
                                <th className="p-2 border">Salario USD</th>
                                <th className="p-2 border">Desc. USD</th>
                                <th className="p-2 border">Desc. Bs</th>
                                <th className="p-2 border">Neto USD</th>
                                <th className="p-2 border">Salario Bs</th>
                            </tr>
                        </thead>
                        <tbody>
                            {salaries.map((sal, i) => (
                                <tr key={i}>
                                    <td className="p-2 border">{sal.name}</td>

                                    <td className="p-2 border">
                                        <FormattedAmount bold={false} amount={sal.amountUSD} currency=" USD" />
                                    </td>
                                    <td className="p-2 border">
                                        <FormattedAmount bold={false} amount={sal.usdDiscounts} currency="USD" />
                                    </td>
                                    <td className="p-2 border">
                                        <FormattedAmount bold={false} amount={sal.bsDiscounts} currency="Bs" prefix="Bs " />
                                    </td>
                                    <td className="p-2 border ">
                                        <FormattedAmount bold={false} amount={sal.netUSD} currency="USD" />
                                    </td>
                                    <td className="p-2 border">
                                        <FormattedAmount amount={sal.amountBs} currency="Bs" prefix="Bs " />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                        <tfoot>
                            <tr className="bg-gray-100 font-semibold">
                                <td className="p-2 border">Totales</td>
                                <td className="p-2 border">
                                    <FormattedAmount amount={totals.amountUSD} currency="USD" />
                                </td>
                                <td className="p-2 border">
                                    <FormattedAmount amount={totals.usdDiscounts} currency="USD" />
                                </td>
                                <td className="p-2 border">
                                    <FormattedAmount amount={totals.bsDiscounts} currency="Bs" prefix="Bs " />
                                </td>
                                <td className="p-2 border">
                                    <FormattedAmount amount={totals.netUSD} currency="USD" />
                                </td>
                                <td className="p-2 border">
                                    <FormattedAmount amount={totals.netBs} currency="Bs" prefix="Bs " />
                                </td>
                            </tr>
                        </tfoot>
                    </table>
                    <button
                        onClick={handleCreateExpense}
                        className="bg-indigo-600 mt-8 hover:bg-indigo-700 text-white px-4 py-2 rounded"
                    >
                        Crear gasto
                    </button>
                </div>

            )}
        </div>
    );
};






// import { Employee } from '@/domain/model/Employee';
// import { useState } from 'react';
// import { FormattedAmount } from '../components/FormattedAmount';
// interface Props {
//     employees: Employee[];
//     loading: boolean;
//     error: string | null;
// }

// export const EmployeeList: React.FC<Props> = ({ employees, loading, error }) => {


//     if (loading) return <p className="text-gray-500">Cargando empleados...</p>;
//     if (error) return <p className="text-red-600 font-medium">Error: {error}</p>;
//     if (employees.length === 0) return <p className="text-gray-400">No hay empleados registrados.</p>;

//     return (

//         <div style={{ flex: 1, paddingLeft: 20 }}>

//             <h2 className="text-xl font-bold text-gray-800 mb-4">Empleados:</h2>
//             <ul className="space-y-4">
//                 {employees.map((employee) => (
//                     <li key={employee._id} className="bg-white p-4 rounded-lg shadow flex flex-col space-y-2 text-sm">
//                         {/* Descripción + Fecha */}
//                         <div className="flex justify-between items-start">
//                             <div className="text-base font-semibold text-primary">{employee.name}</div>
//                         </div>

//                         {/* Etiquetas: tipo y método de pago */}
//                         <div className="flex flex-wrap gap-2">
//                             <span className="px-2 py-0.5 bg-yellow-100 text-yellow-800 text-xs rounded-full border border-yellow-300">
//                                 <FormattedAmount amount={employee.weeklySalary} currency="USD" />
//                             </span>
//                         </div>


//                         {/* Botón editar */}
//                         {/* <button
//                             onClick={() => {
//                                 // Scroll al tope de la página
//                                 window.scrollTo({ top: 0, behavior: 'smooth' });

//                                 // Lógica de edición
//                                 onEdit(toUpdateExpenseData(expense));
//                             }}
//                             className="mt-2 text-blue-500 underline self-start"
//                         >
//                             Editar
//                         </button> */}
//                     </li>
//                 ))}
//             </ul>
//         </div>



//     );
// };
