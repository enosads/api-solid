import type { CheckIn } from '../../generated/prisma/client'
import type { CheckInUncheckedCreateInput } from '../../generated/prisma/models'

export interface CheckInsRepository {
  findById(id: string): Promise<CheckIn | null>
  findByUserIdOnDate(userId: string, date: Date): Promise<CheckIn | null>
  findManyByUserId(userId: string, page?: number): Promise<CheckIn[]>
  countByUserId(userId: string): Promise<number>
  create(data: CheckInUncheckedCreateInput): Promise<CheckIn>
  save(checkIn: CheckIn): Promise<CheckIn>
}
