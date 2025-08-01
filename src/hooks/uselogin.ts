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
      console.log(user);
      if (user.token) {
        localStorage.setItem('auth_token', user.token);
        localStorage.setItem('user', JSON.stringify(user.user));
        user.user.userType == 'admin'
          ? navigate('/dashboard')
          : navigate('/caja');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return { login, loading, error };
};
