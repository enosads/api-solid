import { hash } from 'bcryptjs'
import { prisma } from '@/lib/prisma'
import { PrismaUsersRepository } from '@/repositories/prisma-users-repository'
import { UserAlreadyExistsError } from './errors/user-already-exists-error'

type RegisterUseCaseRequest = {
  name: string
  email: string
  password: string
}

export async function registerUseCase({
  name,
  email,
  password,
}: RegisterUseCaseRequest) {
  const userAlreadyExists = await prisma.user.findUnique({
    where: { email },
  })

  if (userAlreadyExists) {
    throw new UserAlreadyExistsError()
  }

  const passwordHash = await hash(password, 6)

  const prismaUserRepository = new PrismaUsersRepository()
  prismaUserRepository.create({ name, email, password_hash: passwordHash })
}
