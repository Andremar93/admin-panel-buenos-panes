import { useEmployee } from "@/hooks/useEmployee"
import { useEffect, useState } from 'react';
import { EmployeeList } from "./EmployeeList";


export function EmployeePage() {
    const { employees, loading, error } = useEmployee();
    // const [selectedEmployee, setSelectedEmployee] = useState<UpdateEmployeeDTOType | null>(null);


    return (
        <div style={{ display: 'flex', gap: 20, padding: 20 }}>
            <div style={{ flex: 1, borderRight: '1px solid #ccc', paddingRight: 20 }}>

                <EmployeeList
                    employees={employees}
                    loading={loading}
                    error={error}
                />

            </div>
        </div>
    )
}
