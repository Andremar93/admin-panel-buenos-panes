// data/usecases/LoginUseCaseImpl.ts
import { LoginUseCase } from '@/application/use_case/login/LoginUseCase'
import { Login } from '@/domain/model/Login'
import { AuthApi } from '@/infrastructure/AuthApi'

export class LoginUseCaseImpl implements LoginUseCase {
  async execute(username: string, password: string): Promise<Login> {
    return await AuthApi.login(username, password)
  }
}
