import { prisma } from '@/lib/prisma'
import type { UserCreateInput } from '../../generated/prisma/models'

export class PrismaUsersRepository {
  async create(data: UserCreateInput) {async create(data: UserCreateInput): Promise<User> 
    return await prisma.user.create({ data })
}
