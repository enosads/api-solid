import { prisma } from '@/lib/prisma'
import { UserAlreadyExistsError } from '@/use-cases/errors/user-already-exists-error'
import type { UserCreateInput } from '../../generated/prisma/models'

export class PrismaUsersRepository {
  async findByEmail(email: string) {
    return prisma.user.findUnique({ where: { email } })
  }

  async create(data: UserCreateInput) {
    const userAlreadyExists = await this.findByEmail(data.email)

    if (userAlreadyExists) {
      throw new UserAlreadyExistsError()
    }

    return prisma.user.create({ data })
  }
}
