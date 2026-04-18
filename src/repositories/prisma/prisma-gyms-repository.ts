import { prisma } from '@/lib/prisma'
import { type Gym, Prisma } from '../../../generated/prisma/client'
import type { GymCreateInput } from '../../../generated/prisma/models'
import type { FindManyNearbyParams, GymsRepository } from '../gyms-repository'

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

    const EARTH_RADIUS_KM = 6371
    const MAX_DISTANCE_IN_KM = 10

    const gyms = await prisma.$queryRaw<Gym[]>`
      SELECT * FROM "Gym"
      WHERE (
        ${EARTH_RADIUS_KM} * acos(
          cos(radians(90 - ${latitude})) *
          cos(radians(90 - latitude)) *
          cos(radians(longitude - ${longitude})) +
          sin(radians(90 - ${latitude})) *
          sin(radians(90 - latitude))
        )
      ) <= ${MAX_DISTANCE_IN_KM}
      ORDER BY (
        ${EARTH_RADIUS_KM} * acos(
          cos(radians(90 - ${latitude})) *
          cos(radians(90 - latitude)) *
          cos(radians(longitude - ${longitude})) +
          sin(radians(90 - ${latitude})) *
          sin(radians(90 - latitude))
        )
      ) ASC
    `

    return gyms
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
