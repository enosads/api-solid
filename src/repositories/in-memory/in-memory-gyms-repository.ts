import { randomUUID } from 'node:crypto'
import { getDistanceBetweenCoordinates } from '@/use-cases/utils/get-distance-between-coordinates'
import type { Gym } from '../../../generated/prisma/client'
import type { GymCreateInput } from '../../../generated/prisma/models'
import type { FindManyNearbyParams, GymsRepository } from '../gyms-repository'

export class InMemoryGymsRepository implements GymsRepository {
  public items: Gym[] = []

  async findById(id: string): Promise<Gym | null> {
    const gym = this.items.find((gym) => gym.id === id)
    if (!gym) {
      return null
    }
    return gym
  }

  async findManyNearby(params: FindManyNearbyParams): Promise<Gym[]> {
    const { latitude, longitude } = params
    const MAX_DISTANCE_IN_KM = 10

    return this.items.filter((gym) => {
      const distance = getDistanceBetweenCoordinates(
        { latitude, longitude },
        { latitude: gym.latitude, longitude: gym.longitude },
      )
      return distance < MAX_DISTANCE_IN_KM
    })
  }

  async searchMany(query: string, page: number): Promise<Gym[]> {
    const ITEMS_PER_PAGE = 20
    return this.items
      .filter((gym) => gym.title.toLowerCase().includes(query.toLowerCase()))
      .slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE)
  }

  async create(data: GymCreateInput): Promise<Gym> {
    const gym: Gym = {
      id: randomUUID(),
      title: data.title,
      description: data.description ?? null,
      phone: data.phone ?? null,
      latitude: data.latitude,
      longitude: data.longitude,
    }
    this.items.push(gym)
    return gym
  }
}
