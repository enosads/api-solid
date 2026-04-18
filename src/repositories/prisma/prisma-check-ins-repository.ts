import dayjs from 'dayjs'
import { prisma } from '@/lib/prisma'
import type { CheckIn } from '../../../generated/prisma/client'
import type { CheckInUncheckedCreateInput } from '../../../generated/prisma/models'
import type { CheckInsRepository } from '../check-ins-repository'

export class PrismaCheckInsRepository implements CheckInsRepository {
  async create(data: CheckInUncheckedCreateInput): Promise<CheckIn> {
    return prisma.checkIn.create({ data })
  }

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
}
