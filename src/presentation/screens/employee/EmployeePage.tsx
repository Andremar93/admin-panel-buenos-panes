import { useEmployee } from "@/hooks/useEmployee"
import { useEffect, useState } from 'react';
import { EmployeeList } from "./EmployeeList";
import { CreateEmployeeSalary } from "./CreateEmployeeSalary";
import { CreateEmployeeSalaryDTOType } from "@/presentation/dtos/employee/CreateEmployeeSalaryDto";
import { useExchangeRate } from "@/hooks/useExchangeRate";


export function EmployeePage() {
    const { employees, loading, error } = useEmployee();
    const { exchangeRate, getExchangeRate } = useExchangeRate();
    const [salaries, setSalaries] = useState([]);

    const handleCreated = (data) => {
        setSalaries(data.salaries); // store created salaries in state
    };

    useEffect(() => {
        getExchangeRate(new Date().toISOString().split('T')[0]);
    }, []);

    return (
        <div style={{ display: 'flex', gap: 20, padding: 20 }}>
            <div style={{ flex: 1, borderRight: '1px solid #ccc', paddingRight: 20 }}>
                <CreateEmployeeSalary
                    onCreated={handleCreated}
                    employees={employees}
                    exchangeRate={exchangeRate}
                />
            </div>
            <EmployeeList
                employees={employees}
                salaries={salaries}
                loading={loading}
                error={error}
            />
        </div>
    );
}
