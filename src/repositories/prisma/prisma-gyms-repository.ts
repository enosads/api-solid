import { prisma } from '@/lib/prisma'
import { type Gym, Prisma } from '../../../generated/prisma/client'
import type { GymCreateInput } from '../../../generated/prisma/models'
import type { FindManyNearbyParams, GymsRepository } from '../gyms-repository'

export class PrismaGymsRepository implements GymsRepository {
  async findById(id: string): Promise<Gym | null> {
    const gym = await prisma.gym.findUnique({
      where: {
        id,
      },
    })
    return gym
  }

  async findManyNearby(params: FindManyNearbyParams): Promise<Gym[]> {
    const { latitude, longitude } = params

    const EARTH_RADIUS_KM = 6371
    const MAX_DISTANCE_IN_KM = 10

    const gyms = await prisma.$queryRaw<Gym[]>`
      SELECT * FROM (
        SELECT *,
          ${EARTH_RADIUS_KM} * acos(
            cos(radians(90 - ${latitude})) *
            cos(radians(90 - latitude)) *
            cos(radians(longitude - ${longitude})) +
            sin(radians(90 - ${latitude})) *
            sin(radians(90 - latitude))
          ) AS distance
        FROM "Gym"
      ) AS gym_with_distance
      WHERE distance <= ${MAX_DISTANCE_IN_KM}
      ORDER BY distance ASC
    `

    return gyms
  }

  async searchMany(query: string, page: number): Promise<Gym[]> {
    const ITEMS_PER_PAGE = 20
    const skip = (page - 1) * ITEMS_PER_PAGE
    const gyms = await prisma.gym.findMany({
      where: {
        title: {
          contains: query,
        },
      },
      skip,
      take: ITEMS_PER_PAGE,
    })
    return gyms
  }

  async create(data: GymCreateInput): Promise<Gym> {
    const gym = await prisma.gym.create({
      data,
    })
    return gym
  }
}
