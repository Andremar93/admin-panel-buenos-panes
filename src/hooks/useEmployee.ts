// hooks/useLogin.ts
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import {
    fetchEmployeesUseCase,
} from '@/application/di/employeeInstance';
import Employee from '@/domain/model/Employee';

export const useEmployee = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();
    const [employees, setEmployees] = useState<Employee[]>([]);


    useEffect(() => {
        loadEmployees();
    }, []);


    const loadEmployees = async () => {
        setLoading(true);
        try {
            const data = await fetchEmployeesUseCase.execute();
            setEmployees(data);
            setError(null);
        } catch (err: any) {
            setError(err.message || 'Error al cargar los empleados.');
        } finally {
            setLoading(false);
        }
    };

    return {
        employees,
        loading,
        error,
        reload: loadEmployees
    }

};
