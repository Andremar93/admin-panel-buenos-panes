// hooks/useLogin.ts
import { useState, useEffect, useCallback } from 'react';
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

    // Memoizar la función de carga para evitar recreaciones
    const loadEmployees = useCallback(async () => {
        setLoading(true);
        try {
            const data = await fetchEmployeesUseCase.execute();
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
    }, [loadEmployees]);

    return {
        employees,
        loading,
        error,
        reload: loadEmployees,
        clearError: () => setError(null),
    };
};
