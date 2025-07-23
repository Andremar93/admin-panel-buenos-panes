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
    <form onSubmit={handleSubmit} className="flex flex-col">
      <input
        className="input"
        type="username"
        value={username}
        onChange={e => setUsername(e.target.value)}
        placeholder="Username"
      />
      <input
        className="input"
        type="password"
        value={password}
        onChange={e => setPassword(e.target.value)}
        placeholder="Password"
      />
      <button className="btn mt-2" type="submit" disabled={loading}>
        {loading ? 'Cargando...' : 'Entrar'}
      </button>
      {error && <p className="error-message">{error}</p>}
    </form>
  )
}

