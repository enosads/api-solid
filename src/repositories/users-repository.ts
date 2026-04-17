import type { User } from '../../generated/prisma/client'
import type { UserCreateInput } from '../../generated/prisma/models'

export interface UsersRepository {
  findByEmail(email: string): Promise<User | null>
  findById(id: string): Promise<User | null>
  create(data: UserCreateInput): Promise<User>
}
