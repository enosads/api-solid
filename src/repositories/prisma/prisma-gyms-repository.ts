import { prisma } from '@/lib/prisma'
import { Decimal } from '../../../generated/prisma/internal/prismaNamespace'
import type { Gym } from '../../../generated/prisma/client'
import type { GymCreateInput } from '../../../generated/prisma/models'
import type { GymsRepository } from '../gyms-repository'

export class PrismaGymsRepository implements GymsRepository {
  async findById(id: string): Promise<Gym | null> {
    return prisma.gym.findUnique({
      where: {
        id,
      },
    })
  }

  async create(data: GymCreateInput): Promise<Gym> {
    return prisma.gym.create({
      data: {
        title: data.title,
        description: data.description,
        phone: data.phone,
        latitude: new Decimal(data.latitude),
        longitude: new Decimal(data.longitude),
      },
    })
  }
}
