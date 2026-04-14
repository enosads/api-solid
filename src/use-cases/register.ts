import { hash } from 'bcryptjs'
import type { PrismaUsersRepository } from '@/repositories/prisma-users-repository'

interface RegisterUseCaseRequest {
  name: string
  email: string
  password: string
}

export class RegisterUseCase {
  constructor(private usersRepository: PrismaUsersRepository) {}

  async execute({ name, email, password }: RegisterUseCaseRequest) {
    const passwordHash = await hash(password, 6)

    await this.usersRepository.create({
      name,
      email,
      password_hash: passwordHash,
    })
  }
}
