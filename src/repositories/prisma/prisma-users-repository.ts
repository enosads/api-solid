import { prisma } from '@/lib/prisma'
import type { User } from '../../../generated/prisma/client'
import type { UserCreateInput } from '../../../generated/prisma/models'
import type { UsersRepository } from '../users-repository'

export class PrismaUsersRepository implements UsersRepository {
  async findByEmail(email: string): Promise<User | null> {
    return prisma.user.findUnique({ where: { email } })
  }

  async create(data: UserCreateInput): Promise<User> {
    return prisma.user.create({ data })
  }
}
