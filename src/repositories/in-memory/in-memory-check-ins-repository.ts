import dayjs from 'dayjs'
import type { CheckIn } from '../../../generated/prisma/client'
import type { CheckInUncheckedCreateInput } from '../../../generated/prisma/models'
import type { CheckInsRepository } from '../check-ins-repository'

export class InMemoryCheckInsRepository implements CheckInsRepository {
  public items: CheckIn[] = []

  findByUserIdOnDate(userId: string, date: Date): Promise<CheckIn | null> {
    const startOfTheDay = dayjs(date).startOf('date')
    const endOfTheDay = dayjs(date).endOf('date')

    const checkOnSameDate = this.items.find((checkIn) => {
      const checkInDate = dayjs(checkIn.created_at)
      const isOnSameDate =
        checkInDate.isAfter(startOfTheDay) && checkInDate.isBefore(endOfTheDay)
      return checkIn.user_id === userId && isOnSameDate
    })

    return Promise.resolve(checkOnSameDate ?? null)
  }

  async findManyByUserId(userId: string, page: number = 1): Promise<CheckIn[]> {
    const ITEMS_PER_PAGE = 20
    return this.items
      .filter((checkIn) => checkIn.user_id === userId)
      .slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE)
  }

  async countByUserId(userId: string): Promise<number> {
    return this.items.filter((checkIn) => checkIn.user_id === userId).length
  }

  async create(data: CheckInUncheckedCreateInput): Promise<CheckIn> {
    const checkIn: CheckIn = {
      id: crypto.randomUUID(),
      created_at: new Date(),
      gym_id: data.gym_id,
      user_id: data.user_id,
      validated_at: data.validated_at ? new Date(data.validated_at) : null,
    }

    this.items.push(checkIn)

    return checkIn
  }
}
