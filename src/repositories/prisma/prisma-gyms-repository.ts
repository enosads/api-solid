import { prisma } from '@/lib/prisma'
import { getDistanceBetweenCoordinates } from '@/use-cases/utils/get-distance-between-coordinates'
import { type Gym, Prisma } from '../../../generated/prisma/client'
import type { GymCreateInput } from '../../../generated/prisma/models'
import type { FindManyNearbyParams, GymsRepository } from '../gyms-repository'

const MAX_DISTANCE_IN_KM = 10

export class PrismaGymsRepository implements GymsRepository {
  async findById(id: string): Promise<Gym | null> {
    return prisma.gym.findUnique({
      where: {
        id,
      },
    })
  }

  async findManyNearby(params: FindManyNearbyParams): Promise<Gym[]> {
    const { latitude, longitude } = params
    const gyms = await prisma.gym.findMany()
    return gyms.filter((gym) => {
      const gymLatitude = Number(gym.latitude.toString())
      const gymLongitude = Number(gym.longitude.toString())
      const distance = getDistanceBetweenCoordinates(
        { latitude, longitude },
        { latitude: gymLatitude, longitude: gymLongitude },
      )
      return distance < MAX_DISTANCE_IN_KM
    })
  }

  async searchMany(query: string, page: number): Promise<Gym[]> {
    const ITEMS_PER_PAGE = 20
    return prisma.gym.findMany({
      where: {
        title: {
          contains: query,
        },
      },
      skip: (page - 1) * ITEMS_PER_PAGE,
      take: ITEMS_PER_PAGE,
    })
  }

  async create(data: GymCreateInput): Promise<Gym> {
    return prisma.gym.create({
      data: {
        title: data.title,
        description: data.description,
        phone: data.phone,
        latitude: new Prisma.Decimal(data.latitude.toString()),
        longitude: new Prisma.Decimal(data.longitude.toString()),
      },
    })
  }
}
