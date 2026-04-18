import { randomUUID } from 'node:crypto'
import type { Gym } from '../../../generated/prisma/client'
import type { Decimal } from '../../../generated/prisma/internal/prismaNamespace'
import type { GymCreateInput } from '../../../generated/prisma/models'
import type { GymsRepository } from '../gyms-repository'

export class InMemoryGymsRepository implements GymsRepository {
  public items: Gym[] = []

  async findById(id: string): Promise<Gym | null> {
    const gym = this.items.find((gym) => gym.id === id)
    if (!gym) {
      return null
    }
    return gym
  }

  async create(data: GymCreateInput): Promise<Gym> {
    const gym: Gym = {
      id: randomUUID(),
      title: data.title,
      description: data.description ?? null,
      phone: data.phone ?? null,
      latitude: data.latitude as Decimal,
      longitude: data.longitude as Decimal,
    }
    this.items.push(gym)
    return gym
  }
}
