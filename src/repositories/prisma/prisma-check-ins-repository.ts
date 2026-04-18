import dayjs from 'dayjs'
import { prisma } from '@/lib/prisma'
import type { CheckIn } from '../../../generated/prisma/client'
import type { CheckInUncheckedCreateInput } from '../../../generated/prisma/models'
import type { CheckInsRepository } from '../check-ins-repository'

export class PrismaCheckInsRepository implements CheckInsRepository {
  findByUserIdOnDate(userId: string, date: Date): Promise<CheckIn | null> {
    const startOfTheDay = dayjs(date).startOf('date').toDate()
    const endOfTheDay = dayjs(date).endOf('date').toDate()

    return prisma.checkIn.findFirst({
      where: {
        user_id: userId,
        created_at: {
          gte: startOfTheDay,
          lte: endOfTheDay,
        },
      },
    })
  }
  findManyByUserId(userId: string, page: number = 1): Promise<CheckIn[]> {
    const ITEMS_PER_PAGE = 20
    return prisma.checkIn.findMany({
      where: {
        user_id: userId,
      },
      take: ITEMS_PER_PAGE,
      skip: (page - 1) * ITEMS_PER_PAGE,
    })
  }

  countByUserId(userId: string): Promise<number> {
    return prisma.checkIn.count({
      where: {
        user_id: userId,
      },
    })
  }

  async create(data: CheckInUncheckedCreateInput): Promise<CheckIn> {
    return prisma.checkIn.create({ data })
  }
}
