// data/usecases/LoginUseCaseImpl.ts
import { LoginUseCase } from '@/application/use_case/login/LoginUseCase'
import { Login } from '@/domain/model/Login'
import { AuthApi } from '@/infrastructure/AuthApi'

export class LoginUseCaseImpl implements LoginUseCase {
  async execute(email: string, password: string): Promise<Login> {
    return await AuthApi.login(email, password)
  }
}
