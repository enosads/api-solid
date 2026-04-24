import { databaseSchema, prisma } from '@/lib/prisma'
import type { Gym } from '../../../generated/prisma/client'
import { Prisma } from '../../../generated/prisma/client'
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

    const gymsTable = Prisma.raw(`"${databaseSchema}"."gyms"`)

    const gyms = await prisma.$queryRaw<Gym[]>`
      SELECT * FROM (
        SELECT *,
          ${EARTH_RADIUS_KM}::float8 * acos(
            LEAST(1.0, GREATEST(-1.0,
              cos(radians(90 - ${latitude}::float8)) *
              cos(radians(90 - latitude)) *
              cos(radians(longitude - ${longitude}::float8)) +
              sin(radians(90 - ${latitude}::float8)) *
              sin(radians(90 - latitude))
            ))
          ) AS distance
        FROM ${gymsTable}
      ) AS gym_with_distance
      WHERE distance <= ${MAX_DISTANCE_IN_KM}::float8
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
          mode: 'insensitive',
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
