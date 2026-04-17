import { randomUUID } from 'node:crypto'
import type { User } from '../../../generated/prisma/client'
import type { UserCreateInput } from '../../../generated/prisma/models'
import type { UsersRepository } from '../users-repository'

export class InMemoryUsersRepository implements UsersRepository {
  public items: User[] = []

  async findByEmail(email: string): Promise<User | null> {
    return this.items.find((user) => user.email === email) ?? null
  }

  async findById(id: string): Promise<User | null> {
    return this.items.find((user) => user.id === id) ?? null
  }

  async create(data: UserCreateInput): Promise<User> {
    const user: User = {
      id: randomUUID(),
      name: data.name,
      email: data.email,
      password_hash: data.password_hash,
      created_at: new Date(),
    }

    this.items.push(user)

    return user
  }
}
