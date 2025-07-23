import { Login } from '@/domain/model/Login'
import { api } from '@/config/api'

export const AuthApi = {
    async login(username: string, password: string): Promise<Login> {
      const res = await api.post('/login', { username, password })
      return res.data 
    }
  }
