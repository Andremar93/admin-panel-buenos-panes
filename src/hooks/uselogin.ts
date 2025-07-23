// hooks/useLogin.ts
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LoginUseCaseImpl } from '@/data/repository/LoginUseCaseImpl';

export const useLogin = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const loginUseCase = new LoginUseCaseImpl();
  const navigate = useNavigate();

  const login = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      const user = await loginUseCase.execute(email, password);

      if (user.token) {
        localStorage.setItem('token', user.token);
        navigate('/dashboard');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return { login, loading, error };
};
