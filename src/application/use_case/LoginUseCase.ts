import { Login } from '@/domain/model/Login'

export interface LoginUseCase {
    execute(email: string, password: string): Promise<Login>
  }