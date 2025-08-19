// presentation/screens/login/LoginForm.tsx
import { useLogin } from '@/hooks/uselogin'
import { useState } from 'react'

export const LoginForm = () => {
  const { login, loading, error } = useLogin()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    login(username, password)
  }

  return (
    <form onSubmit={handleSubmit} className="form-container space-y-4">
      <h2 className="form-title text-center">Iniciar Sesión</h2>
      
      <div className="form-group">
        <input
          className="form-input"
          type="username"
          value={username}
          onChange={e => setUsername(e.target.value)}
          placeholder="Username"
        />
      </div>
      
      <div className="form-group">
        <input
          className="form-input"
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          placeholder="Password"
        />
      </div>
      
      <button className="btn btn-primary w-full" type="submit" disabled={loading}>
        {loading ? 'Cargando...' : 'Entrar'}
      </button>
      
      {error && <p className="form-error text-center">{error}</p>}
    </form>
  )
}

