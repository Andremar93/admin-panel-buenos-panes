// hooks/useLogin.ts
import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

import {
    fetchEmployeesUseCase,
} from '@/application/di/employeeInstance';
import { Employee } from '@/domain/model/Employee';

export const useEmployee = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [employeesWithUnpaidDebts, setEmployeesWithUnpaidDebts] = useState<Employee[]>([]);
    // Memoizar la función de carga para evitar recreaciones
    const loadEmployees = useCallback(async () => {
        setLoading(true);
        try {
            const query = '?includeDebts=true&debtsLimit=100'; // simple y directo
            const data = await fetchEmployeesUseCase.execute(query);
            setEmployees(data);
            setError(null);
        } catch (err: unknown) {
            const errorMessage = err instanceof Error ? err.message : 'Error al cargar los empleados.';
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    }, []);


    const loadEmployeesWithUnpaidDebts = useCallback(async () => {
        setLoading(true);
        try {
            const query = '?includeDebts=true&debtsLimit=100&debtStatus=pending';
            const data = await fetchEmployeesUseCase.execute(query);
            setEmployees(data);
            setError(null);
        } catch (err: unknown) {
            const errorMessage = err instanceof Error ? err.message : 'Error al cargar los empleados.';
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    }, []);

    // Cargar empleados al montar el componente
    useEffect(() => {
        loadEmployees();
        loadEmployeesWithUnpaidDebts()
    }, [loadEmployees]);

    return {
        employees,
        employeesWithUnpaidDebts,
        loading,
        error,
        reload: loadEmployees,
        clearError: () => setError(null),
    };
};
