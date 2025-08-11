// hooks/useLogin.ts
import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { LoginUseCaseImpl } from '@/data/repository/LoginUseCaseImpl';

export const useLogin = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const loginUseCase = new LoginUseCaseImpl();
  const navigate = useNavigate();

  // Memoizar la función de login para evitar recreaciones
  const login = useCallback(async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      const user = await loginUseCase.execute(email, password);
      if (user.token) {
        localStorage.setItem('auth_token', user.token);
        localStorage.setItem('user', JSON.stringify(user.user));
        user.user.userType === 'admin'
          ? navigate('/dashboard')
          : navigate('/caja');
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Error en el login';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [loginUseCase, navigate]);

  return { 
    login, 
    loading, 
    error,
    clearError: () => setError(null),
  };
};
