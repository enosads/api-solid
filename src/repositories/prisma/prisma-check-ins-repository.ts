import dayjs from 'dayjs'
import { prisma } from '@/lib/prisma'
import type { CheckIn } from '../../../generated/prisma/client'
import type { CheckInUncheckedCreateInput } from '../../../generated/prisma/models'
import type { CheckInsRepository } from '../check-ins-repository'

export class PrismaCheckInsRepository implements CheckInsRepository {
  async findById(id: string): Promise<CheckIn | null> {
    const checkIn = await prisma.checkIn.findUnique({
      where: {
        id,
      },
    })
    return checkIn
  }

  async findByUserIdOnDate(
    userId: string,
    date: Date,
  ): Promise<CheckIn | null> {
    const startOfTheDay = dayjs(date).startOf('date').toDate()
    const endOfTheDay = dayjs(date).endOf('date').toDate()

    const checkIn = await prisma.checkIn.findFirst({
      where: {
        user_id: userId,
        created_at: {
          gte: startOfTheDay,
          lte: endOfTheDay,
        },
      },
    })
    return checkIn
  }
  async findManyByUserId(userId: string, page: number = 1): Promise<CheckIn[]> {
    const ITEMS_PER_PAGE = 20
    const skip = (page - 1) * ITEMS_PER_PAGE
    const checkIns = await prisma.checkIn.findMany({
      where: {
        user_id: userId,
      },
      take: ITEMS_PER_PAGE,
      skip,
    })
    return checkIns
  }

  async countByUserId(userId: string): Promise<number> {
    const count = await prisma.checkIn.count({
      where: {
        user_id: userId,
      },
    })
    return count
  }

  async create(data: CheckInUncheckedCreateInput): Promise<CheckIn> {
    const checkIn = await prisma.checkIn.create({ data })
    return checkIn
  }

  async save(checkIn: CheckIn): Promise<CheckIn> {
    const updatedCheckIn = await prisma.checkIn.update({
      where: {
        id: checkIn.id,
      },
      data: checkIn,
    })
    return updatedCheckIn
  }
}
