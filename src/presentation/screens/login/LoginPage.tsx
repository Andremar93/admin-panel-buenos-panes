// src/presentation/screens/login/LoginPage.tsx

import { LoginForm } from '@/presentation/screens/login/LoginForm'


export const LoginPage = () => {
  return (
    <div className="min-h-screen grid place-items-center bg-gray-100 px-4">
      <div className="form-wrapper">
        <LoginForm />
      </div>
    </div>
  )
}