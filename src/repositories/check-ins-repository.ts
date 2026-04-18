import type { CheckIn } from '../../generated/prisma/client'
import type { CheckInUncheckedCreateInput } from '../../generated/prisma/models'

export interface CheckInsRepository {
  findByUserIdOnDate(userId: string, date: Date): Promise<CheckIn | null>
  findManyByUserId(userId: string, page?: number): Promise<CheckIn[]>
  create(data: CheckInUncheckedCreateInput): Promise<CheckIn>
}
